#include <Arduino.h>
#include <ArduinoJson.h>
#include "net.h"

// Board connection data
char macAddress[18];
char ipAddress[16];
char gateway[16];
char subnetMask[16];

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
extern void handle_tx_ws(const char* data, size_t len);
extern void handle_rx_ws(const char* data, size_t len) {
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
}

// Update data over websocket
extern void update_data_ws(void) {
  // Update data
  DynamicJsonDocument txJson(1024);
  JsonArray data = txJson.to<JsonArray>();
  data[0]["serial"] = "";
  data[1]["tmcu"] = readBoardTemperature();
  data[1]["vsply"] = (float)readVoltageSuply() / 1000.0F;
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
  handle_tx_ws((const char *)&wsWriter, docSize);
}

void setup() {
  // Initialize serial port
  Serial.begin(115200);
  while (!Serial);
  delay(2000);

  // Init inputs
  for (int i = 0; i < 10; i++) {
    pinMode(inputs[i], INPUT);
  }

  // Init outputs
  for (int i = 0; i < 8; i++) {
    pinMode(outputs[i], OUTPUT);
  }

  // Initialize app server
  web_app_init();
}

void loop() {
  web_app_run();
}