# Smart Piggy Bank with Money Tracking and Mobile App
Academic project in development (2025). This repository contains the source code for a smart piggy bank that combines hardware with web and mobile software to monitor savings in real time.
Technical Description
This project integrates a ReactJS application with an ESP32 microcontroller programmed via the Arduino IDE, enabling real-time communication through WebSockets over Wi-Fi.
The piggy bank is capable of:
-Detecting and counting inserted money using sensors such as:
1.Weight sensors
2.Coin detectors
3.Infrared sensors
-Communicating the current status to a web/mobile app, allowing users to view:
1.The total amount saved
2.A history of deposits
3.Savings goals
-Technologies Used
1.Frontend: ReactJS
2.Communication: WebSocket (React client ↔ ESP32)
3.Microcontroller: ESP32 (Arduino IDE)
4.Sensors: Weight, IR, coin detector
5.Connectivity: Wi-Fi (AP mode or client mode)
