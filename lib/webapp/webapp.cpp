/*
 * Copyright (c) 2023 CONTROLLINO GmbH.
 *
 * SPDX-License-Identifier: MIT
 */

#include <SPI.h>
#include "webapp.h"

/**
 * \file webapp.cpp
 *
 * Based on mongoose device-dashboard example
 *
 * \author Pedro Marquez @pmmarquez, CONTROLLINO Firmware Team
 */

/* Unique board id */
uint8_t* id;

// Time management
static uint64_t s_boot_timestamp = 0;  // Updated by SNTP

// This is for newlib and TLS (mbedTLS)
uint64_t mg_now(void) {
  return mg_millis() + s_boot_timestamp;
}

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

// Http handlers
static const char* s_json_header =
"Content-Type: application/json\r\n"
"Cache-Control: no-cache\r\n";

static void handle_firmware_upload(struct mg_connection* c,
  struct mg_http_message* hm) {
  char name[64], offset[20], total[20];
  struct mg_str data = hm->body;
  long ofs = -1, tot = -1;
  name[0] = offset[0] = '\0';
  mg_http_get_var(&hm->query, "name", name, sizeof(name));
  mg_http_get_var(&hm->query, "offset", offset, sizeof(offset));
  mg_http_get_var(&hm->query, "total", total, sizeof(total));
  MG_INFO(("File %s, offset %s, len %lu", name, offset, data.len));
  if ((ofs = mg_json_get_long(mg_str(offset), "$", -1)) < 0 ||
    (tot = mg_json_get_long(mg_str(total), "$", -1)) < 0) {
    mg_http_reply(c, 500, "", "offset and total not set\n");
  }
  else if (ofs == 0 && mg_ota_begin((size_t)tot) == false) {
    mg_http_reply(c, 500, "", "mg_ota_begin(%ld) failed\n", tot);
  }
  else if (data.len > 0 && mg_ota_write(data.ptr, data.len) == false) {
    mg_http_reply(c, 500, "", "mg_ota_write(%lu) @%ld failed\n", data.len, ofs);
    mg_ota_end();
  }
  else if (data.len == 0 && mg_ota_end() == false) {
    mg_http_reply(c, 500, "", "mg_ota_end() failed\n", tot);
  }
  else {
    mg_http_reply(c, 200, s_json_header, "true\n");
    if (data.len == 0) {
      // Successful mg_ota_end()
      MG_INFO(("firmware.bin uploaded crc32:%u size:%u", mg_ota_crc32(MG_FIRMWARE_CURRENT), mg_ota_size(MG_FIRMWARE_CURRENT)));
    }
  }
}

static void handle_firmware_commit(struct mg_connection* c) {
  mg_http_reply(c, 200, s_json_header, "%s\n",
    mg_ota_commit() ? "true" : "false");
}

static void handle_firmware_rollback(struct mg_connection* c) {
  mg_http_reply(c, 200, s_json_header, "%s\n",
    mg_ota_rollback() ? "true" : "false");
}

static size_t print_status(void (*out)(char, void*), void* ptr, va_list* ap) {
  int fw = va_arg(*ap, int);
  return mg_xprintf(out, ptr, "{%m:%d,%m:%c%lx%c,%m:%u,%m:%u}\n",
    MG_ESC("status"), mg_ota_status(fw), MG_ESC("crc32"), '"',
    mg_ota_crc32(fw), '"', MG_ESC("size"), mg_ota_size(fw),
    MG_ESC("timestamp"), mg_ota_timestamp(fw));
}

static void handle_firmware_status(struct mg_connection* c) {
  mg_http_reply(c, 200, s_json_header, "[%M,%M]\n", print_status,
    MG_FIRMWARE_CURRENT, print_status, MG_FIRMWARE_PREVIOUS);
}

static void handle_device_reset(struct mg_connection* c) {
  mg_http_reply(c, 200, s_json_header, "true\n");
  mg_timer_add(c->mgr, 500, 0, (void (*)(void*)) mg_device_reset, NULL);
}

extern size_t print_network_settings(void (*out)(char, void*), void* ptr, va_list* ap);

static void handle_network_settings(struct mg_connection* c) {
  mg_http_reply(c, 200, s_json_header, "%M\n", print_network_settings);
}

extern size_t print_outputs_settings(void (*out)(char, void*), void* ptr, va_list* ap);
extern void set_outputs_settings(struct mg_str* body);

static void handle_outputs_settings_get(struct mg_connection* c) {
  mg_http_reply(c, 200, s_json_header, "%M\n", print_outputs_settings);
}

static void handle_outputs_settings_set(struct mg_connection* c, struct mg_str* body) {
  set_outputs_settings(body);
  mg_http_reply(c, 200, s_json_header, "ok\n");
}

extern void set_output(struct mg_str* body);

static void handle_output_set(struct mg_connection* c, struct mg_str* body) {
  set_output(body);
  mg_http_reply(c, 200, s_json_header, "ok\n");
}

extern size_t print_inputs_settings(void (*out)(char, void*), void* ptr, va_list* ap);
extern void set_inputs_settings(struct mg_str* body);

static void handle_inputs_settings_get(struct mg_connection* c) {
  mg_http_reply(c, 200, s_json_header, "%M\n", print_inputs_settings);
}

static void handle_inputs_settings_set(struct mg_connection* c, struct mg_str* body) {
  set_inputs_settings(body);
  mg_http_reply(c, 200, s_json_header, "ok\n");
}

extern void set_terminal_settings(struct mg_str* body);

static void handle_terminal_settings_set(struct mg_connection* c, struct mg_str* body) {
  set_terminal_settings(body);
  mg_http_reply(c, 200, s_json_header, "ok\n");
}

extern void terminal_tx(struct mg_str* body);

static void handle_terminal_tx(struct mg_connection* c, struct mg_str* body) {
  terminal_tx(body);
  mg_http_reply(c, 200, s_json_header, "ok\n");
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
      c->data[0] = 'W';
      MG_INFO(("WS connected %lu", c->id));
    }
    else if (mg_http_match_uri(hm, "/api/firmware/upload")) {
      handle_firmware_upload(c, hm);
    }
    else if (mg_http_match_uri(hm, "/api/firmware/commit")) {
      handle_firmware_commit(c);
    }
    else if (mg_http_match_uri(hm, "/api/firmware/rollback")) {
      handle_firmware_rollback(c);
    }
    else if (mg_http_match_uri(hm, "/api/firmware/status")) {
      handle_firmware_status(c);
    }
    else if (mg_http_match_uri(hm, "/api/device/reset")) {
      handle_device_reset(c);
    }
    else if (mg_http_match_uri(hm, "/api/network/settings")) {
      handle_network_settings(c);
    }
    else if (mg_http_match_uri(hm, "/api/outputs/settings")) {
      if (mg_strcmp(hm->method, mg_str_s("POST")) == 0) {
        handle_outputs_settings_set(c, &(hm->body));
      }
      else {
        handle_outputs_settings_get(c);
      }
    }
    else if (mg_http_match_uri(hm, "/api/outputs")) {
      if (mg_strcmp(hm->method, mg_str_s("POST")) == 0) {
        handle_output_set(c, &(hm->body));
      }
    }
    else if (mg_http_match_uri(hm, "/api/inputs/settings")) {
      if (mg_strcmp(hm->method, mg_str_s("POST")) == 0) {
        handle_inputs_settings_set(c, &(hm->body));
      }
      else {
        handle_inputs_settings_get(c);
      }
    }
    else if (mg_http_match_uri(hm, "/api/terminal/settings")) {
      if (mg_strcmp(hm->method, mg_str_s("POST")) == 0) {
        handle_terminal_settings_set(c, &(hm->body));
      }
    }
    else if (mg_http_match_uri(hm, "/api/terminal")) {
      if (mg_strcmp(hm->method, mg_str_s("POST")) == 0) {
        handle_terminal_tx(c, &(hm->body));
      }
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
    MG_INFO(("WS recv %lu %.*s", c->id, (int)wm->data.len, wm->data.ptr));
    
    // Heartbeat echo it back!
    if (wm->data.ptr[0] == 'h') {
      mg_ws_send(c, wm->data.ptr, wm->data.len, WEBSOCKET_OP_TEXT);
    }
  }
  (void)fn_data;
}

// OTA init function
extern "C" void mg_ota_boot(void);

/* Init Web application */
void webAppInit(struct mg_mgr* mgr, mg_tcpip_if* mif)
{
  // Bootstrap OTA
  mg_ota_boot();

  // Get unique board id and set MAC address
  pico_unique_board_id_t board_id;
  pico_get_unique_board_id(&board_id);
  id = board_id.id;
  mif->mac[0] = 0x02;
  mif->mac[1] = id[3];
  mif->mac[2] = id[4];
  mif->mac[3] = id[5];
  mif->mac[4] = id[6];
  mif->mac[5] = id[7];

  // Set logging function to a serial print
  mg_log_set_fn([](char ch, void*) { Serial.print(ch); }, NULL);
  mg_mgr_init(mgr);

  // Start TCP/IP stack
  MG_INFO(("Starting TCP/IP stack..."));
  mg_tcpip_init(mgr, mif);

  MG_INFO(("MAC: %M. Waiting for IP...", mg_print_mac, mif->mac));
  while (mif->state != MG_TCPIP_STATE_READY) {
    mg_mgr_poll(mgr, 0);
  }

  // Serve HTTP on HTTP_URL
  mg_http_listen(mgr, HTTP_URL, handle_http, NULL);
  MG_INFO(("HTTP listener on %s", HTTP_URL));
  MG_INFO(("WS listen on %s/ws", HTTP_URL));

  // Start SNTP client
  mg_timer_add(mgr, 3600 * 1000, MG_TIMER_RUN_NOW | MG_TIMER_REPEAT, timer_sntp_fn, &mgr);
}

void webAppRun(struct mg_mgr* mgr)
{
  mg_mgr_poll(mgr, 1);
}
