/*
 * Copyright (c) 2023 CONTROLLINO GmbH.
 *
 * SPDX-License-Identifier: MIT
 */

#include "SPI.h"
#include "net.h"

/**
 * \file net.c
 *
 * Based on mongoose device-dashboard example (Copyright (c) 2023 Cesanta Software Limited)
 *
 * \author Pedro Marquez @pmmarquez, CONTROLLINO Firmware Team
 */

/* Mongoose event manager */
struct mg_mgr mgr;

/* Ethernet W5500 SPI interface */
#define SS_PIN PIN_SPI_SS_ETHERNET_LIB    // Slave select pin
struct mg_tcpip_spi spi = {
    NULL,                                               // SPI data
    [](void*) { digitalWrite(SS_PIN, LOW); },          // begin transation
    [](void*) { digitalWrite(SS_PIN, HIGH); },         // end transaction
    [](void*, uint8_t c) { return SPI.transfer(c); },  // execute transaction
};

/* Unique board id */
uint8_t* id;

// Board connection data
extern char macAddress[18];
extern char ipAddress[16];
extern char gateway[16];
extern char subnetMask[16];

/* TCP/IP Network interface */
struct mg_tcpip_if mif = {
  .mac = { 2, id[3], id[4], id[5], id[6], id[7] },
  .ip = mg_htonl(MG_U32(10, 22, 1, 184)),
  .mask = mg_htonl(MG_U32(255, 255, 255, 0)),
  .gw = mg_htonl(MG_U32(10, 22, 1, 254)),
  .driver = &mg_tcpip_driver_w5500,
  .driver_data = &spi
};

static uint64_t s_boot_timestamp = 0;  // Updated by SNTP

// SNTP connection event handler. When we get a response from an SNTP server,
// adjust s_boot_timestamp. We'll get a valid time from that point on
static void sfn(struct mg_connection *c, int ev, void *ev_data, void *fn_data) {
  uint64_t *expiration_time = (uint64_t *) c->data;
  if (ev == MG_EV_OPEN) {
    *expiration_time = mg_millis() + 3000;  // Store expiration time in 3s
  } else if (ev == MG_EV_SNTP_TIME) {
    uint64_t t = *(uint64_t *) ev_data;
    s_boot_timestamp = t - mg_millis();
    c->is_closing = 1;
  } else if (ev == MG_EV_POLL) {
    if (mg_millis() > *expiration_time) c->is_closing = 1;
  }
  (void) fn_data;
}

static void timer_sntp_fn(void* param) {  // SNTP timer function. Sync up time
  mg_sntp_connect((struct mg_mgr*)param, "udp://time.google.com:123", sfn, NULL);
}

// Websocket handlers
extern void handle_rx_ws(const char* data, size_t len);
extern void update_data_ws(void);
mg_connection* ws_conn = NULL;
extern void handle_tx_ws(const char* data, size_t len) {
  if (ws_conn != NULL) {
    // Debug part of ws send
    // MG_INFO(("WS send %lu %.*s...", ws_conn->id, (int)len / 8, data));
    mg_ws_send(ws_conn, data, len, WEBSOCKET_OP_TEXT);
  }
}


// HTTP request handler function
static void handle_http(struct mg_connection *c, int ev, void *ev_data, void *fn_data) {
  if (ev == MG_EV_HTTP_MSG) {
    struct mg_http_message* hm = (struct mg_http_message*)ev_data;
    MG_INFO(("uri %.*s", (int)hm->uri.len, hm->uri.ptr));
    if (mg_http_match_uri(hm, "/ws")) {
      // Upgrade to websocket. From now on, a connection is a full-duplex
      // Websocket connection, which will receive MG_EV_WS_MSG events.
      mg_ws_upgrade(c, hm, NULL);
      MG_INFO(("WS connect %lu", c->id));
    }
    else {
      // handle /home as /
      if (mg_http_match_uri(hm, "/home")) {
        hm->uri = mg_str_s("/");
      }
      struct mg_http_serve_opts opts;
      memset(&opts, 0, sizeof(opts));
      opts.root_dir = "/web";  // On embedded, use packed files
      opts.fs = &mg_fs_packed;
      mg_http_serve_dir(c, hm, &opts);
    }
    MG_DEBUG(("%lu %.*s %.*s -> %.*s", c->id, (int)hm->method.len,
              hm->method.ptr, (int) hm->uri.len, hm->uri.ptr, (int) 3,
              &c->send.buf[9]));
  }
  else if (ev == MG_EV_WS_MSG) {
    // Got websocket frame. Received data is wm->data.
    struct mg_ws_message* wm = (struct mg_ws_message*)ev_data;

    // Debug part of ws receive
    // MG_INFO(("WS recv %lu %.*s", c->id, (int)wm->data.len, wm->data.ptr));
    
    // Heartbeat echo it back!
    if (wm->data.ptr[0] == 'h') {
      mg_ws_send(c, wm->data.ptr, wm->data.len, WEBSOCKET_OP_TEXT);
    }
    else if (wm->data.ptr[0] == 'd') {
      // Update current websocket connection and update data
      ws_conn = c;
      update_data_ws();
    }
    else {
      handle_rx_ws(wm->data.ptr, wm->data.len);
    }

    mg_iobuf_del(&c->recv, 0, c->recv.len);
  }
  (void)fn_data;
}

void web_init(struct mg_mgr* mgr) {
  // Serve HTTP on HTTP_URL
  mg_http_listen(mgr, HTTP_URL, handle_http, NULL);

  mg_timer_add(mgr, 3600 * 1000, MG_TIMER_RUN_NOW | MG_TIMER_REPEAT,
    timer_sntp_fn, mgr);

  MG_INFO(("HTTP listener on %s", HTTP_URL));
  MG_INFO(("WS listen on %s/ws", HTTP_URL));
}

/* Init Web application */
void web_app_init()
{
  // Setup SPI
  pinMode(SS_PIN, OUTPUT);
  SPI.begin();

  // Get unique board id
  pico_unique_board_id_t board_id;
  pico_get_unique_board_id(&board_id);
  uint8_t* id = board_id.id;

  // Set logging function to a serial print
  mg_log_set_fn([](char ch, void*) { Serial.print(ch); }, NULL);
  mg_mgr_init(&mgr);

  // Start TCP/IP stack
  MG_INFO(("Starting TCP/IP stack..."));
  mg_tcpip_init(&mgr, &mif);

  // Start a 5 sec timer, print status message periodically
  mg_timer_add(
    &mgr, 5000, MG_TIMER_REPEAT,
    [](void*) {
      MG_INFO(("ethernet: %s", mg_tcpip_driver_w5500.up(&mif) ? "up" : "down"));
    },
    NULL);

  MG_INFO(("MAC: %M. Waiting for IP...", mg_print_mac, mif.mac));
  while (mif.state != MG_TCPIP_STATE_READY) {
    mg_mgr_poll(&mgr, 0);
  }

  // Update board connection data
  sprintf(macAddress, "%02x:%02x:%02x:%02x:%02x:%02x",
    mif.mac[0], mif.mac[1], mif.mac[2], mif.mac[3], mif.mac[4], mif.mac[5]);
  
  uint8_t* ip = (uint8_t*)&mif.ip;
  sprintf(ipAddress, "%d.%d.%d.%d", ip[0], ip[1], ip[2], ip[3]);
  
  uint8_t* gw = (uint8_t*)&mif.gw;
  sprintf(gateway, "%d.%d.%d.%d", gw[0], gw[1], gw[2], gw[3]);
  
  uint8_t* mask = (uint8_t*)&mif.mask;
  sprintf(subnetMask, "%d.%d.%d.%d", mask[0], mask[1], mask[2], mask[3]);

  MG_INFO(("Initialising app..."));
  web_init(&mgr);
}

void web_app_run()
{
  mg_mgr_poll(&mgr, 1);
}
