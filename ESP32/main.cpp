/* 
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>

const char* ssid = "WiFi_Mesh-900486";
const char* password = "XbuZ44tA";
const int boton = 0;

AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

int contador = 0;
bool presionado = false;

void notifyClients() {
  ws.textAll("{\"contador\": " + String(contador) + "}");
}

void handleWebSocketMessage(void *arg, uint8_t *data, size_t len) {
  AwsFrameInfo *info = (AwsFrameInfo*)arg;
  if (info->final && info->index == 0 && info->len == len && info->opcode == WS_TEXT) {
    data[len] = 0;
    String msg = (char*)data;
    if (msg == "reset") {
      contador = 0;
      notifyClients();
    }
  }
}

void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type,
             void *arg, uint8_t *data, size_t len) {
  switch (type) {
    case WS_EVT_CONNECT:
      Serial.printf("Cliente #%u conectado desde %s\n", client->id(), client->remoteIP().toString().c_str());
      client->text("{\"contador\": " + String(contador) + "}"); 
      break;
    case WS_EVT_DATA:
      handleWebSocketMessage(arg, data, len);
      break;
    default:
      break;
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(boton, INPUT_PULLUP);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi conectado");
  Serial.println(WiFi.localIP());

  ws.onEvent(onEvent);
  server.addHandler(&ws);
  server.begin();
}

void loop() {
  ws.cleanupClients();

  if (digitalRead(boton) == LOW && !presionado) {
    contador++;
    notifyClients();
    presionado = true;
  }

  if (digitalRead(boton) == HIGH) {
    presionado = false;
  }

  delay(50);
}

 */

