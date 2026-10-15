# TMS Mobile - React Native (Expo)

Cross-platform Ticket Management System (TMS) built with React Native and Expo. It shares the same dark enterprise UI/UX, role-based workflows, and REST backend API as the web platform.

---

## 🚀 Quick Start

### 1. Ensure the Backend is Running
The mobile application communicates with the TMS Node.js backend:
```bash
cd Backend
npm start
```
The backend runs on `http://localhost:5000` (or your LAN IP `http://192.168.209.24:5000`).

---

### 2. Run the Mobile App

Navigate to the `mobile` folder:
```bash
cd mobile
```

#### Option A: Run in Web Browser
```bash
npm run web
```
Opens in your default browser at `http://localhost:8081`.

#### Option B: Run on Mobile Phone (Expo Go)
```bash
npm start
```
1. Install the **Expo Go** app on your iPhone or Android phone (from the App Store or Google Play).
2. Scan the QR code displayed in the terminal.
3. The app will bundle and open directly on your mobile device!

#### Option C: Run on Android Emulator
```bash
npm run android
```

---

## 🔑 Login Credentials

### 👑 SuperAdmin (Full Access to Master Screens & Reports)
- **Email:** `admin@tms.com`
- **Password:** `Admin@123`

### 👤 Staff Account (Complaints & Status Updates)
- **Email:** `vasan@gmail.com`
- **Password:** `vasan123`

