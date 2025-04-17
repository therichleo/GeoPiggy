# Smart Piggy Bank with Money Tracking and Mobile App
Academic project in development (2025). This repository contains the source code for a smart piggy bank that combines hardware with web and mobile software to monitor savings in real time.

Technical Description
This project integrates a ReactJS application with an ESP32 microcontroller programmed via the Arduino IDE, enabling real-time communication through WebSockets over Wi-Fi.
The piggy bank is capable of:

-Detecting and counting inserted money using sensors such as:
Weight sensors,Coin detectors,Infrared sensors.

-Communicating the current status to a web/mobile app, allowing users to view:
The total amount saved,A history of deposits,Savings goals.

-Technologies Used
Frontend: ReactJS,Communication: WebSocket (React client ↔ ESP32),Microcontroller: ESP32 (Arduino IDE),Sensors: Weight, IR, coin detector,Connectivity: Wi-Fi (AP mode or client mode).
