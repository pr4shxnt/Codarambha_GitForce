# 🚍 TransitPAY – Revolutionize Your Digital Commute

[![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen)](https://nodejs.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.7x-blue)](https://reactnative.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**TransitPAY** is a digital fare collection ecosystem designed to modernize Nepal’s public transportation system.  
It combines **NFC-based tap-in/tap-out technology**, **mobile wallet integration**, **real-time analytics**, and **reward systems** — ensuring transparency, inclusivity, and efficiency for passengers and operators.

---

## 🏗️ Project Architecture

```
TransitPAY/
├── Backend/         → Express + MongoDB API
├── frontend/        → Next.js website (marketing & registration)
├── application/     → React Native mobile app (passenger interface)
├── Hardwares/       → NodeMCU firmware for NFC terminals
└── .gitignore
```

---

## ✨ Core Features

- **Tap-In / Tap-Out NFC Fare System**  
  NFC cards or smartphones log entry and exit for distance-based fare calculation.

- **Automatic Fare Deduction**  
  Real-time fare computation using geolocation and route mapping.

- **Wallet Integration**  
  Supports popular wallets like eSewa, Khalti, and IME Pay.

- **Reward & Loyalty System**  
  Earn cashback or free rides after multiple trips.

- **Analytics Dashboard**  
  Operators and city planners get insights on ridership, routes, and revenue.

- **Inclusive Access**  
  Physical NFC cards for non-smartphone users, and ID-linked discounts for students, seniors, and differently-abled individuals.

---

## ⚙️ Tech Stack

| Layer                | Technologies                                                      |
| -------------------- | ----------------------------------------------------------------- |
| **Backend**          | Node.js, Express, MongoDB, Cloudinary, Firebase                   |
| **Mobile App**       | React Native, Redux, Tailwind (via NativeWind), NFC (HCE & PN532) |
| **Frontend (Web)**   | Next.js 14, TypeScript, ShadCN UI, Tailwind CSS                   |
| **Hardware**         | NodeMCU (ESP8266), PN532 NFC, NEO6M GPS                           |
| **Cloud & Services** | Firebase, Cloudinary, Digital Wallet APIs                         |
| **Auth & Security**  | JWT, Role-Based Access Control, Signature Verification            |

---

## 🧩 Folder Overview

### 📦 Backend (`/Backend`)

Handles API, authentication, and data logic.  
Key folders:

- `controllers/` – Business logic for users, wallets, trips, etc.
- `middlewares/` – Auth, RBAC, Cloudinary, signature verification.
- `models/` – Mongoose schemas.
- `routes/` – REST endpoints.
- `services/` – Database, Firebase, and utility services.

**Run Backend**

```bash
cd Backend
cp .env.example .env
npm install
npm run dev
```

---

### 📱 Application (`/application`)

React Native app for passengers and operators — includes tap-to-pay UI, wallet, and history view.  
Supports both **Android & iOS**.

**Run App**

```bash
cd application
npm install
npm run android
```

> Requires Android Studio or Xcode setup for device simulation.

---

### 🌐 Frontend (`/frontend`)

Next.js website for user onboarding, card requests, and information.

**Run Frontend**

```bash
cd frontend
npm install
npm run dev
```

---

### 🔌 Hardware (`/Hardwares`)

Contains firmware for **NodeMCU + PN532** NFC terminal.  
Used for validating cards, logging trips, and sending trip data to backend.

**Components**

- `main/main.ino` – Core firmware logic.
- `Hardware_info.md` – Setup instructions and pin connections.

---

## 🔒 Environment Variables

Create a `.env` file in `/Backend`:

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
FIREBASE_CONFIG=...
```

---

## 🚀 Deployment

| Layer         | Platform      |
| ------------- | ------------- |
| Backend       | Vercel        |
| Frontend      | Vercel        |
| Mobile App    | Play Store    |
| Database      | MongoDB Atlas |
| Cloud Storage | Cloudinary    |

---

## 🧾 Cost Breakdown (Prototype Phase)

| Component             | Approx Cost (NPR) |
| --------------------- | ----------------: |
| Hardware (per unit)   |             1,500 |
| Cloud Infrastructure  |   350,000 / month |
| API & Utilities       |   500,000 / month |
| Team Wages            |         5,000,000 |
| **Total (Prototype)** |    **≈ 8.8M NPR** |

---

## 📅 Roadmap

| Phase | Goal                                        |
| ----- | ------------------------------------------- |
| 1️⃣    | MVP with NFC tap-to-pay & fare calculation  |
| 2️⃣    | Wallet integration (IME Pay, eSewa, Khalti) |
| 3️⃣    | Test rollout                                |

---

## 👨‍💻 Contributors

| Name                  | Role                                 |
| --------------------- | ------------------------------------ |
| **Prashant Adhikari** | Lead Developer / Architect           |
| Team Git Force        | Backend, App, and Hardware Engineers |

---

## 📜 License

This project is licensed under the **MIT License** — feel free to modify and build upon it.

---

## 🧠 Inspiration

> TransitPAY was born to bring **transparency, inclusivity, and digital innovation**  
> to Nepal’s public transport — making daily commuting **fair, fast, and fraud-free**.

---

### ⭐ If you find this project useful, don’t forget to star the repo!
