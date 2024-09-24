/*
 * Copyright (c) 2023 CONTROLLINO GmbH.
 *
 * SPDX-License-Identifier: MIT
 */

#include <SPI.h>
#include <ArduinoJson.h>
#include <webapp.h>

/* Mongoose event manager */
struct mg_mgr mgr;

/* Ethernet W5500 SPI interface */
struct mg_tcpip_spi spi = {
    NULL,                                               // SPI data
    [](void*) { digitalWrite(PIN_SPI_SS_ETHERNET_LIB, LOW); },          // begin transation
    [](void*) { digitalWrite(PIN_SPI_SS_ETHERNET_LIB, HIGH); },         // end transaction
    [](void*, uint8_t c) { return SPI.transfer(c); },  // execute transaction
};

/* TCP/IP Network interface */
struct mg_tcpip_if mif = {
  .mac = { 2, 0, 0, 0, 0, 0 },
  .ip = mg_htonl(MG_U32(10, 22, 1, 184)),
  .mask = mg_htonl(MG_U32(255, 255, 255, 0)),
  .gw = mg_htonl(MG_U32(10, 22, 1, 254)),
  .driver = &mg_tcpip_driver_w5500,
  .driver_data = &spi
};


#ifdef CONTROLLINO_MICRO_RS485
#include <ArduinoRS485.h>
#endif

#ifdef CONTROLLINO_MICRO_CAN
#include <CAN.h>
#endif

// #define LED_BLINK // Comment this line to disable LED blink
#ifdef LED_BLINK
#define LED_BLINK_INTERVAL 1000 // ms
uint32_t ledBlinkTimer = 0;
void ledBlink() {
  if (millis() - ledBlinkTimer > LED_BLINK_INTERVAL) {
    ledBlinkTimer = millis();
    digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
  }
}
#endif

// Serial configs
String serialRx = "";
String serialTx = "";
typedef enum { LF, CR, CRLF } serialTerm;
serialTerm serialTerminator = LF;

#ifdef CONTROLLINO_MICRO_RS485
// Init
void microRS485Init() {
  Serial2.setTX(PIN_SERIAL2_TX);
  Serial2.setRX(PIN_SERIAL2_RX);
  RS485.begin(115200);
  RS485.receive();
}

// Rx
void microRS485Rx() {
  if (RS485.available()) {
    if (serialTerminator == LF) {
      serialRx += RS485.readStringUntil('\n');
    }
    else if (serialTerminator == CR) {
      serialRx += RS485.readStringUntil('\r');
    }
    else if (serialTerminator == CRLF) {
      char lastc = '\n';
      while (RS485.available())
      {
        char c = RS485.read();
        if (c == '\n' && lastc == '\r') {
          // Remove last \r
          serialRx.remove(serialRx.length() - 1);
          break;
        }
        serialRx += c;
        lastc = c;
      }
    }
  }
}

// Tx
void microRS485Tx() {
  if (serialTx.length() > 0) {
    RS485.noReceive();
    RS485.beginTransmission();
    RS485.print(serialTx);
    RS485.endTransmission();
    RS485.receive();
    serialTx = "";
  }
}
#endif

#ifdef CONTROLLINO_MICRO_CAN
#define CAN_ID 0x15
// Init
void microCANInit() {
  SPI1.setRX(PIN_SPI1_MISO);
  SPI1.setTX(PIN_SPI1_MOSI);
  SPI1.setSCK(PIN_SPI1_SCK);
  if (!CAN.begin(500E3)) {
    Serial.println("Starting CAN failed!");
    while (1);
  }
}

// Rx
// Format 0xID/RTR or 0xID/DATA
void microCANRx() {
  int packetSize = CAN.parsePacket();
  long packetId = CAN.packetId();
  if (packetSize || packetId != -1) {
    if (!CAN.packetRtr()) {
      if (CAN.available()) {
        if (serialTerminator == LF) {
          serialRx += CAN.readStringUntil('\n');
        }
        else if (serialTerminator == CR) {
          serialRx +=  CAN.readStringUntil('\r');
        }
        else if (serialTerminator == CRLF) {
          char lastc = '\n';
          while (CAN.available())
          {
            char c = CAN.read();
            if (c == '\n' && lastc == '\r') {
              // Remove last \r
              serialRx.remove(serialRx.length() - 1);
              break;
            }
            serialRx += c;
            lastc = c;
          }
        }
      }
    }
  }
}

// Tx
void microCANTx() {
  if (serialTx.length() > 0) {
    CAN.flush();
    CAN.beginPacket(CAN_ID);
    CAN.print(serialTx);
    CAN.endPacket();
    serialTx = "";
  }
}
#endif

// Board outputs
int outputs[8] = {
  CONTROLLINO_MICRO_DO0, // 5
  CONTROLLINO_MICRO_DO1, // 6
  CONTROLLINO_MICRO_DO2, // 7	
  CONTROLLINO_MICRO_DO3, // 20
  CONTROLLINO_MICRO_DO4, // 21
  CONTROLLINO_MICRO_DO5, // 22
  CONTROLLINO_MICRO_DO6, // 23
  CONTROLLINO_MICRO_DO7  // 24
};

// Inputs pins
int inputs[10] = {
  CONTROLLINO_MICRO_AI0, // 50
  CONTROLLINO_MICRO_AI1, // 51
  CONTROLLINO_MICRO_AI2, // 52
  CONTROLLINO_MICRO_AI3, // 53
  CONTROLLINO_MICRO_AI4, // 54
  CONTROLLINO_MICRO_AI5, // 55
  CONTROLLINO_MICRO_DI0, // 26
  CONTROLLINO_MICRO_DI1, // 27
  CONTROLLINO_MICRO_DI2, // 28
  CONTROLLINO_MICRO_DI3  // 29
};

// Define helpers for analog input conversion
#define RES_23_BITS 8388607.0F
#define RES_12_BITS 4095.0F
#define V_23_BITS   27.395F // 23 bits 0-27.395V
#define V_12_BITS   25.798F // 12 bits 0-25.798V

// Websocket handlers
void handleRxWs(const char* data, size_t len) {
  // Parse JSON
  DynamicJsonDocument rxjson(256);
  DeserializationError error = deserializeJson(rxjson, data, len);
  if (error) {
    Serial.printf("deserializeJson() failed: %s\r\n", error.c_str());
    return;
  }

  // Parse data
  String id = rxjson["id"];

  // Outputs
  for (int i = 0; i < 8; i++) {
    if (id == "switchs-" + String(i)) {
      int value = rxjson["value"];
      digitalWrite(outputs[i], value ? HIGH : LOW);
      break;
    }
    else if (id == "sliders-" + String(i)) {
      int value = rxjson["value"];
      analogWrite(outputs[i], map(value, 0, 100, 0, 255));
      break;
    }
    else if (id == "current_limit-" + String(i)) {
      float value = rxjson["value"];
      setOutCurrentLim(outputs[i], (uint16_t)(value * 1000.0F));
      break;
    }
  }

  // Inputs
  for (int i = 0; i < 10; i++) {
    if (id == "digital_threshold-" + String(i)) {
      float value = rxjson["value"];
      if (i < 6) { // Analog inputs 0-5
        setDigitalThreshold(inputs[i], (uint32_t)(value * RES_23_BITS / V_23_BITS));
      }
      else { // Digital inputs 6-9
        setDigitalThreshold(inputs[i], (uint32_t)(value * RES_12_BITS / V_12_BITS));
      }
      break;
    }
  }

  // Serial
  if (id == "serial") {
    serialTx = rxjson["value"].as<String>();
    if (serialTerminator == LF) {
      serialTx += "\n";
    }
    else if (serialTerminator == CR) {
      serialTx += "\r";
    }
    else if (serialTerminator == CRLF) {
      serialTx += "\r\n";
    }
  }
  else if (id == "terminator") {
    String value = rxjson["value"];
    if (value == "LF") {
      serialTerminator = LF;
    }
    else if (value == "CR") {
      serialTerminator = CR;
    }
    else if (value == "CRLF") {
      serialTerminator = CRLF;
    }
  }
}

// Websocket update
static void ws_fn(void* param) {
  struct mg_mgr* _mgr = (struct mg_mgr*)param;
  struct mg_connection* c;
  for (c = _mgr->conns; c != NULL; c = c->next) {
    if (c->data[0] != 'W') continue;

    // Send data
    mg_ws_printf(c, WEBSOCKET_OP_TEXT,
      "{%m:%.05f,%m:%.05f,%m:%.05f,%m:%c%s%c,%m:[%u,%u,%u,%u,%u,%u,%u,%u]}",
      MG_ESC("vsupply"), readVoltageSuply() / 1000.0F,
      MG_ESC("tmcu"), analogReadTemp(3.3F),
      MG_ESC("tsens"), readBoardTemperature(),
      MG_ESC("rx"), '"', serialRx.c_str(), '"',
      MG_ESC("do"),
      digitalRead(outputs[0]),
      digitalRead(outputs[1]),
      digitalRead(outputs[2]),
      digitalRead(outputs[3]),
      digitalRead(outputs[4]),
      digitalRead(outputs[5]),
      digitalRead(outputs[6]),
      digitalRead(outputs[7])
    );
    mg_ws_printf(c, WEBSOCKET_OP_TEXT,
      "{%m:[%u,%u,%u,%u,%u,%u,%u,%u,%u,%u],%m:[%.05f,%.05f,%.05f,%.05f,%.05f,%.05f,%.05f,%.05f,%.05f,%.05f]}",
      MG_ESC("di"),
      digitalRead(inputs[0]),
      digitalRead(inputs[1]),
      digitalRead(inputs[2]),
      digitalRead(inputs[3]),
      digitalRead(inputs[4]),
      digitalRead(inputs[5]),
      digitalRead(inputs[6]),
      digitalRead(inputs[7]),
      digitalRead(inputs[8]),
      digitalRead(inputs[9]),
      MG_ESC("ai"),
      (float)analogRead(inputs[0])* V_23_BITS / RES_23_BITS,
      (float)analogRead(inputs[1])* V_23_BITS / RES_23_BITS,
      (float)analogRead(inputs[2])* V_23_BITS / RES_23_BITS,
      (float)analogRead(inputs[3])* V_23_BITS / RES_23_BITS,
      (float)analogRead(inputs[4])* V_23_BITS / RES_23_BITS,
      (float)analogRead(inputs[5])* V_23_BITS / RES_23_BITS,
      (float)analogRead(inputs[6])* V_12_BITS / RES_12_BITS,
      (float)analogRead(inputs[7])* V_12_BITS / RES_12_BITS,
      (float)analogRead(inputs[8])* V_12_BITS / RES_12_BITS,
      (float)analogRead(inputs[9])* V_12_BITS / RES_12_BITS
    );

    // Clear rx serial buffer
    serialRx = "";
  }
}

// Http handlers
size_t print_network_settings(void (*out)(char, void*), void* ptr, va_list* ap) {
  uint8_t* ip = (uint8_t*)&mif.ip;
  uint8_t* gw = (uint8_t*)&mif.gw;
  uint8_t* mask = (uint8_t*)&mif.mask;
  return mg_xprintf(out, ptr,
    "{%m:%c%d.%d.%d.%d%c,%m:%c%d.%d.%d.%d%c,%m:%c%d.%d.%d.%d%c,%m:%c%02x:%02x:%02x:%02x:%02x:%02x%c}\n",
    MG_ESC("ip"), '"', ip[0], ip[1], ip[2], ip[3], '"', MG_ESC("gw"), '"',
    gw[0], gw[1], gw[2], gw[3], '"', MG_ESC("mask"), '"', mask[0], mask[1], mask[2], mask[3], '"',
    MG_ESC("mac"), '"', mif.mac[0], mif.mac[1], mif.mac[2], mif.mac[3], mif.mac[4], mif.mac[5], '"');
}

size_t print_inputs_settings(void (*out)(char, void*), void* ptr, va_list* ap) {
  uint32_t tr0 = getDigitalThreshold(inputs[0]);
  uint32_t tr1 = getDigitalThreshold(inputs[1]);
  uint32_t tr2 = getDigitalThreshold(inputs[2]);
  uint32_t tr3 = getDigitalThreshold(inputs[3]);
  uint32_t tr4 = getDigitalThreshold(inputs[4]);
  uint32_t tr5 = getDigitalThreshold(inputs[5]);
  uint32_t tr6 = getDigitalThreshold(inputs[6]);
  uint32_t tr7 = getDigitalThreshold(inputs[7]);
  uint32_t tr8 = getDigitalThreshold(inputs[8]);
  uint32_t tr9 = getDigitalThreshold(inputs[9]);
  return mg_xprintf(out, ptr,
    "{%m:[%.05f,%.05f,%.05f,%.05f,%.05f,%.05f,%.05f,%.05f,%.05f,%.05f]}\n",
    MG_ESC("thresholds"),
    tr0 == ~0U ? V_23_BITS : (float)tr0 * V_23_BITS / RES_23_BITS,
    tr1 == ~0U ? V_23_BITS : (float)tr1 * V_23_BITS / RES_23_BITS,
    tr2 == ~0U ? V_23_BITS : (float)tr2 * V_23_BITS / RES_23_BITS,
    tr3 == ~0U ? V_23_BITS : (float)tr3 * V_23_BITS / RES_23_BITS,
    tr4 == ~0U ? V_23_BITS : (float)tr4 * V_23_BITS / RES_23_BITS,
    tr5 == ~0U ? V_23_BITS : (float)tr5 * V_23_BITS / RES_23_BITS,
    tr6 == ~0U ? V_12_BITS : (float)tr6 * V_12_BITS / RES_12_BITS,
    tr7 == ~0U ? V_12_BITS : (float)tr7 * V_12_BITS / RES_12_BITS,
    tr8 == ~0U ? V_12_BITS : (float)tr8 * V_12_BITS / RES_12_BITS,
    tr9 == ~0U ? V_12_BITS : (float)tr9 * V_12_BITS / RES_12_BITS);
}

void set_inputs_settings(struct mg_str* body) {
  double index, value;
  if (mg_json_get_num(*body, "$.threshold.index", &index)) {
    mg_json_get_num(*body, "$.threshold.value", &value);
  }
  else {
    return;
  }
  if (index < 6) { // Analog inputs 0-5
    setDigitalThreshold(inputs[(int)index], (uint32_t)(value * RES_23_BITS / V_23_BITS));
  }
  else { // Digital inputs 6-9
    setDigitalThreshold(inputs[(int)index], (uint32_t)(value * RES_12_BITS / V_12_BITS));
  }
}

size_t print_outputs_settings(void (*out)(char, void*), void* ptr, va_list* ap) {
  return mg_xprintf(out, ptr,
    "{%m:[%.02f,%.02f,%.02f,%.02f,%.02f,%.02f,%.02f,%.02f]}\n",
    MG_ESC("limits"),
    (float)getOutCurrentLim(outputs[0]) / 1000.0F,
    (float)getOutCurrentLim(outputs[1]) / 1000.0F,
    (float)getOutCurrentLim(outputs[2]) / 1000.0F,
    (float)getOutCurrentLim(outputs[3]) / 1000.0F,
    (float)getOutCurrentLim(outputs[4]) / 1000.0F,
    (float)getOutCurrentLim(outputs[5]) / 1000.0F,
    (float)getOutCurrentLim(outputs[6]) / 1000.0F,
    (float)getOutCurrentLim(outputs[7]) / 1000.0F
  );
}

void set_outputs_settings(struct mg_str* body) {
  double index, value;
  if (mg_json_get_num(*body, "$.limit.index", &index)) {
    mg_json_get_num(*body, "$.limit.value", &value);
  }
  else {
    return;
  }
  setOutCurrentLim(outputs[(int)index], (uint16_t)(value * 1000.0F));
}

void setup() {
  // Initialize serial port
  Serial.begin(115200);
  while (!Serial);
  delay(2000);

  // Setup SPI
  pinMode(PIN_SPI_SS_ETHERNET_LIB, OUTPUT);
  digitalWrite(PIN_SPI_SS_ETHERNET_LIB, HIGH);
  SPI.begin();

#ifdef LED_BLINK
  pinMode(LED_BUILTIN, OUTPUT);
#endif

  // Init inputs
  for (int i = 0; i < 10; i++) {
    pinMode(inputs[i], INPUT);
  }

  // Init outputs
  for (int i = 0; i < 8; i++) {
    pinMode(outputs[i], OUTPUT);
  }

  // Init Serial
#ifdef CONTROLLINO_MICRO_RS485
  microRS485Init();
#endif
#ifdef CONTROLLINO_MICRO_CAN
  microCANInit();
#endif

  // Initialize app server
  webAppInit(&mgr, &mif);

  // Start a 5 sec timer, print status message periodically
  mg_timer_add(
    &mgr, 5000, MG_TIMER_REPEAT,
    [](void*) { MG_INFO(("ethernet: %s", mg_tcpip_driver_w5500.up(&mif) ? "up" : "down"));}
    , NULL
  );

  // WS timer
  mg_timer_add(&mgr, 1000, MG_TIMER_REPEAT, ws_fn, &mgr);
}

void loop() {
  webAppRun(&mgr);

  // Read/Write serial data
#ifdef CONTROLLINO_MICRO_RS485
  microRS485Rx();
  microRS485Tx();
#endif
#ifdef CONTROLLINO_MICRO_CAN
  microCANRx();
  microCANTx();
#endif

#ifdef LED_BLINK
  ledBlink();
#endif
}
