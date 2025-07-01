/* 
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>

// WiFi
const char* ssid = "WiFi_Mesh-900486(2.4)";
const char* password = "XbuZ44tA";

// Pines de sensores
const int sensor10 = 12;
const int sensor50 = 14;
const int sensor100G = 26;
const int sensor100C = 27;
const int sensor500 = 25;

// Variables globales
AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

volatile long totalPesos = 0;

volatile int count10 = 0;
volatile int count50 = 0;
volatile int count100G = 0;
volatile int count100C = 0;
volatile int count500 = 0;

int last10 = HIGH;
int last50 = HIGH;
int last100G = HIGH;
int last100C = HIGH;
int last500 = HIGH;

// Enviar totalPesos a todos los clientes
void notifyClients() {
  ws.textAll("{\"totalPesos\": " + String(totalPesos) + "}");
}

// Mostrar total y notificar por WebSocket
void mostrarTotal() {
  Serial.print("TOTAL ACUMULADO: $");
  Serial.println(totalPesos);
  notifyClients();
}

// Procesar mensajes entrantes por WebSocket
void handleWebSocketMessage(void *arg, uint8_t *data, size_t len) {
  AwsFrameInfo *info = (AwsFrameInfo*)arg;
  if (info->final && info->index == 0 && info->len == len && info->opcode == WS_TEXT) {
    data[len] = 0;
    String msg = (char*)data;
    if (msg == "reset") {
      totalPesos = 0;
      mostrarTotal(); // también envía por WebSocket
    }
  }
}

// Manejo de eventos WebSocket
void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type,
             void *arg, uint8_t *data, size_t len) {
  switch (type) {
    case WS_EVT_CONNECT:
      Serial.printf("Cliente #%u conectado desde %s\n", client->id(), client->remoteIP().toString().c_str());
      client->text("{\"totalPesos\": " + String(totalPesos) + "}");
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

  // Configurar pines
  pinMode(sensor10, INPUT);
  pinMode(sensor50, INPUT);
  pinMode(sensor100G, INPUT);
  pinMode(sensor100C, INPUT);
  pinMode(sensor500, INPUT);

  // Conectar a WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi conectado");
  Serial.println(WiFi.localIP());

  // WebSocket
  ws.onEvent(onEvent);
  server.addHandler(&ws);
  server.begin();
}

void loop() {
  ws.cleanupClients();

  // Leer sensores
  int state10 = digitalRead(sensor10);
  int state50 = digitalRead(sensor50);
  int state100G = digitalRead(sensor100G);
  int state100C = digitalRead(sensor100C);
  int state500 = digitalRead(sensor500);

  if (last10 == HIGH && state10 == LOW) {
    count10++;
    totalPesos += 10;
    Serial.println("Moneda de $10 detectada");
    mostrarTotal();
  }

  if (last50 == HIGH && state50 == LOW) {
    count50++;
    totalPesos += 50;
    Serial.println("Moneda de $50 detectada");
    mostrarTotal();
  }

  if (last100G == HIGH && state100G == LOW) {
    count100G++;
    totalPesos += 100;
    Serial.println("Moneda de $100 (grande) detectada");
    mostrarTotal();
  }

  if (last100C == HIGH && state100C == LOW) {
    count100C++;
    totalPesos += 100;
    Serial.println("Moneda de $100 (chica) detectada");
    mostrarTotal();
  }

  if (last500 == HIGH && state500 == LOW) {
    count500++;
    totalPesos += 500;
    Serial.println("Moneda de $500 detectada");
    mostrarTotal();
  }

  // Guardar estado anterior
  last10 = state10;
  last50 = state50;
  last100G = state100G;
  last100C = state100C;
  last500 = state500;

  delay(50); // Antirrebote
}

 */

