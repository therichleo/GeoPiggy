# EduPiggy – Smart Piggy Bank with Real-Time Money Tracking and Mobile App

**Academic Project – 2025**

This repository contains the source code and technical overview of **EduPiggy** (formerly known as GeoPiggy), a smart piggy bank that combines hardware and software to provide a fun and educational savings experience. Designed to help users, especially children, learn about money management, EduPiggy tracks savings in real time through sensors and communicates with a mobile/web app using WebSockets.

---

## 📦 Features

EduPiggy includes both hardware and software components. The piggy bank is capable of:

* **Detecting and counting inserted money** using sensors:

  * Weight sensors
  * Coin detectors
  * Infrared (IR) sensors

* **Communicating live updates** to a mobile/web app, displaying:

  * Total amount saved
  * History of deposits
  * Personalized savings goals

* **Providing an educational experience** by integrating learning concepts such as math and geography in future updates.

---

## 🔧 Technical Description

EduPiggy integrates a **ReactJS** front-end and an **ESP32 microcontroller** programmed using the Arduino IDE. Real-time data transmission is enabled through **WebSockets** over Wi-Fi.

### Technology Stack

| Component       | Technology                |
| --------------- | ------------------------- |
| Frontend        | ReactJS / React Native    |
| Microcontroller | ESP32 (Arduino IDE)       |
| Sensors         | Weight, IR                |
| Communication   | WebSockets (ESP32 ↔ App)  |
| Connectivity    | Wi-Fi (AP or Client Mode) |

---

## 📱 Mobile/Web Application

The application was built using **React Native**, which allowed for a clean, simple, and user-friendly interface. The use of **WebSocket protocol** ensured **instant** communication between the sensors and the application. When the infrared sensor detects an inserted coin or bill, a JSON response is immediately sent to the app, updating the savings data in real time.

---

## 🛠 Development Experience

This project was quite challenging and taught us a lot about teamwork and hardware-software integration. One of the major hurdles was poor organization within the team, which caused delays. While my main responsibility was to develop the application, the **3D-printed enclosure** for the piggy bank became a bottleneck—especially during the final presentation, when the physical component failed to function properly.

Despite these setbacks, the app was our saving grace. Thanks to its real-time capabilities and smooth interface, we were still able to successfully demonstrate the core functionality of the project.

---

## ✨ From GeoPiggy to EduPiggy

During the development process, we decided to rebrand the project from **GeoPiggy** to **EduPiggy** to better reflect its educational purpose. The new identity aligns with our broader goal: **teaching through technology**, as we have a very fun way of teaching both math and geography.

---

## 📚 Future Improvements

* Add gamified educational modules (math quizzes, location-based savings challenges)
* Enhance sensor accuracy and robustness
* Improve 3D-printed enclosure design
* Integrate cloud storage and user accounts

---

## 🤝 Acknowledgements

Special thanks to our academic mentors and classmates who supported this project. While the journey was tough, it was a valuable learning experience that showcased the potential of combining hardware and modern app development for educational purposes.
