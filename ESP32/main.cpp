/* 
#include <arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "WiFi_Mesh-900486";
const char* password = "XbuZ44tA";

const String botToken = "7583295257:AAFUs6a2xhveno2gJlNrwc8mmZYDdMqRXH0";
const String chatID = "-4721788049";  

const int boton = 0; 

bool enviado = false;

void setup() {
  Serial.begin(115200);
  pinMode(boton, INPUT_PULLUP);

  WiFi.begin(ssid, password);
  Serial.print("Conectando a WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" conectado!");
}

void loop() {
  if (digitalRead(boton) == LOW && !enviado) {
    Serial.println("Botón presionado, enviando mensaje...");

    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;

      String mensaje = "Kero Pasta";
      String url = "https://api.telegram.org/bot" + botToken +
                   "/sendMessage?chat_id=" + chatID + "&text=" + mensaje;

      http.begin(url);
      int httpResponseCode = http.GET();

      if (httpResponseCode > 0) {
        Serial.println("Mensaje enviado con éxito.");
      } else {
        Serial.println("Error enviando mensaje.");
      }

      http.end();
      enviado = true;
    }
  }

  if (digitalRead(boton) == HIGH) {
    enviado = false; 
  }

  delay(100);
}

 */

