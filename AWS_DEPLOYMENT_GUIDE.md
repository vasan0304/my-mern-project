# Complete AWS Deployment Guide for Ticket Management System (TMS)

This guide provides end-to-end instructions to deploy the **TMS (Ticket Management System)** application on **AWS EC2 (Free Tier)** with **Nginx Reverse Proxy**, **PM2**, and the **Modernized Jobie UI**.

---

## 🏗️ Architecture on AWS

```
[ Web / Mobile Browser ]
         |
    (HTTP Port 80 / HTTPS Port 443)
         |
  [ AWS EC2 Instance (Ubuntu 22.04 LTS Free Tier) ]
  ├── [ Nginx Reverse Proxy (Port 80) ]
  │    ├── Static Web App (Modern Jobie UI) -> /
  │    ├── API Requests -> http://127.0.0.1:5050/api/
  │    └── Uploaded Complaint Files -> http://127.0.0.1:5050/uploads/
  └── [ Node.js Express Backend (Port 5050 managed by PM2) ]
         |
         v
  [ MongoDB Atlas Cloud DB (Recommended) OR Local MongoDB on EC2 ]
```

---

## 📋 Step 1: Database Setup (MongoDB Atlas - Free Tier)

MongoDB Atlas is the easiest and most reliable free cloud database:

1. Sign in or register at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Click **Create** -> choose **M0 Free Tier** (Shared).
3. **Database Access**: Create a user:
   - Username: `tms_admin`
   - Password: `<create_a_strong_password>`
4. **Network Access**: Click **Add IP Address** -> Select **Allow Access From Anywhere (`0.0.0.0/0`)** -> Confirm.
5. In **Database Deployments**, click **Connect** -> **Drivers** -> Copy connection string:
   ```text
   mongodb+srv://tms_admin:<password>@cluster0.xxxxx.mongodb.net/tms?retryWrites=true&w=majority
   ```
*(Alternative: You can also install MongoDB directly on the Ubuntu EC2 instance if you prefer not to use Atlas).*

---

## ☁️ Step 2: Launch AWS EC2 Instance (Free Tier)

1. Log into your [AWS EC2 Console](https://console.aws.amazon.com/ec2/).
2. Click **Launch Instance**.
3. **Name**: `TMS-Server`
4. **Application and OS Images (AMI)**: **Ubuntu Server 22.04 LTS (HVM), SSD Volume Type** (64-bit x86).
5. **Instance Type**: **`t2.micro`** (or `t3.micro` if in newer regions) — marked *Free tier eligible*.
6. **Key Pair (login)**:
   - Click **Create new key pair**.
   - Key pair name: `tms-key`
   - Key pair type: `RSA`
   - Private key file format: `.pem` (for OpenSSH / PowerShell / macOS / Linux).
   - Click **Create key pair** and save the downloaded `tms-key.pem` file in your Downloads or project folder.
7. **Network Settings (Security Group)**:
   - Check **Allow SSH traffic from** -> **Anywhere (0.0.0.0/0)** (Port 22).
   - Check **Allow HTTP traffic from the internet** (Port 80).
   - Check **Allow HTTPS traffic from the internet** (Port 443).
8. **Configure Storage**: Default 8 GiB or up to 30 GiB General Purpose SSD (gp3) (Free tier allows up to 30 GiB).
9. Click **Launch Instance**.

Wait 1–2 minutes until the instance state shows **Running**. Copy the **Public IPv4 address** (e.g., `54.210.xx.xx`).

---

## 💻 Step 3: Push Local Code to GitHub

From your local computer terminal (PowerShell in `C:\Users\Keerthivasan\Documents\TMS`):

```powershell
# 1. Check git status
git status

# 2. Stage all files (excluding sensitive .env and cache thanks to .gitignore)
git add .

# 3. Commit changes
git commit -m "feat: Prepare TMS for AWS EC2 deployment with Jobie UI on port 5050"

# 4. Push to your GitHub repository
git push origin main
```

---

## 🚀 Step 4: Connect to EC2 & Run Automated Setup

### 1. Connect via SSH from Windows PowerShell:
Navigate to the directory where your `tms-key.pem` file is located:
```powershell
# In PowerShell:
ssh -i "path\to\tms-key.pem" ubuntu@<YOUR_EC2_PUBLIC_IP>
```
*(Replace `<YOUR_EC2_PUBLIC_IP>` with your EC2 public IP).*

### 2. Clone Your Project on EC2:
Once logged into Ubuntu:
```bash
# Clone the repository
git clone https://github.com/vasan0304/my-mern-project.git TMS
cd TMS
```

### 3. Configure Production Environment Variables:
```bash
cd Backend
nano .env
```
Paste your production configuration:
```env
PORT=5050
NODE_ENV=production
MONGO_URI=mongodb+srv://tms_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/tms?retryWrites=true&w=majority
JWT_SECRET=super_secret_production_key_tms_2026
JWT_EXPIRES_IN=7d
```
Save and exit: Press `Ctrl + O`, `Enter`, then `Ctrl + X`.

### 4. Run the Automated Setup Script:
```bash
cd ~/TMS
chmod +x deploy/ec2-setup.sh
./deploy/ec2-setup.sh
```

**What this script automatically does:**
1. Updates Ubuntu packages.
2. Installs Node.js 20 LTS, Git, Nginx, and PM2.
3. Installs backend dependencies and starts the backend service under PM2 on port 5050 (with auto-restart on boot).
4. Installs dependencies and builds the modernized Jobie web application into `mobile/dist/`.
5. Configures Nginx on port 80 to serve the web application and reverse-proxy `/api/` and `/uploads/` to port 5050.

---

## 👥 Step 5: Initialize SuperAdmin User

Once the script completes, create your first Admin user directly using `curl` on the server:

```bash
curl -X POST http://localhost:5050/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "Admin",
    "phoneNumber": "9999999999",
    "email": "admin@tms.com",
    "password": "Admin@123",
    "roleName": "SuperAdmin"
  }'
```

---

## 🌐 Step 6: Access TMS in Your Browser!

Open your browser and visit:
```text
http://<YOUR_EC2_PUBLIC_IP>
```
Log in with:
- **Email:** `admin@tms.com`
- **Password:** `Admin@123`

You will see the complete Jobie-styled TMS dashboard live on AWS!

---

## 🛠️ Handy EC2 Management Commands

- **Check Backend status**:
  ```bash
  pm2 status
  ```
- **View Live Backend logs**:
  ```bash
  pm2 logs tms-backend
  ```
- **Restart Backend**:
  ```bash
  pm2 restart tms-backend
  ```
- **Check Nginx status**:
  ```bash
  sudo systemctl status nginx
  ```
- **Update with latest code in future**:
  ```bash
  cd ~/TMS
  git pull origin main
  cd mobile && npx expo export --platform web
  cd ../Backend && npm install && pm2 restart tms-backend
  ```
