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

// Board connection data
char macAddress[18];
char ipAddress[16];
char gateway[16];
char subnetMask[16];

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

    // Update data
    DynamicJsonDocument txJson(1024);
    JsonArray data = txJson.to<JsonArray>();
    data[0]["serial"] = serialRx.c_str();
    data[1]["tmcu"] = analogReadTemp(3.3F);
    data[1]["vsply"] = readVoltageSuply() / 1000.0F;
    data[1]["tsens"] = readBoardTemperature();
    data[2]["ip"] = ipAddress;
    data[2]["gateway"] = gateway;
    data[2]["subnet"] = subnetMask;
    data[2]["mac"] = macAddress;

    // Digital values 
    data[3]["do"].createNestedArray();
    for (int i = 0; i < 8; i++) {
      data[3]["do"][i] = digitalRead(outputs[i]) ? true : false;
    }
    data[3]["di"].createNestedArray();
    for (int i = 0; i < 10; i++) {
      data[3]["di"][i] = digitalRead(inputs[i]) ? true : false;
    }

    // Analog values
    data[3]["ai"].createNestedArray();
    for (int i = 0; i < 10; i++) {
      if (i < 6) {
        // Analog inputs 0-5
        data[3]["ai"][i] = ((float)analogRead(inputs[i]) / RES_23_BITS) * V_23_BITS;
      }
      else {
        // Digital inputs 6-9
        data[3]["ai"][i] = ((float)analogRead(inputs[i]) / RES_12_BITS) * V_12_BITS;
      }
    }

    // Send data
    size_t docSize = measureJson(data);
    char wsWriter[docSize];
    serializeJson(data, &wsWriter, docSize);
    mg_ws_printf(c, WEBSOCKET_OP_TEXT, "%s", wsWriter);

    // Clear rx serial buffer
    serialRx = "";
  }
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

  // Update board connection data
  sprintf(macAddress, "%02x:%02x:%02x:%02x:%02x:%02x",
    mif.mac[0], mif.mac[1], mif.mac[2], mif.mac[3], mif.mac[4], mif.mac[5]);

  uint8_t* ip = (uint8_t*)&mif.ip;
  sprintf(ipAddress, "%d.%d.%d.%d", ip[0], ip[1], ip[2], ip[3]);

  uint8_t* gw = (uint8_t*)&mif.gw;
  sprintf(gateway, "%d.%d.%d.%d", gw[0], gw[1], gw[2], gw[3]);

  uint8_t* mask = (uint8_t*)&mif.mask;
  sprintf(subnetMask, "%d.%d.%d.%d", mask[0], mask[1], mask[2], mask[3]);
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
