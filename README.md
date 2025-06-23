# 🧑‍💼 HR Management System

A full-stack HR Management Web Application built with **Angular 16** and **Laravel 8 (PHP 8)**. The system allows companies to manage employee information, leave requests, role-based access, attendance via biometric devices, and more — all through a modern web interface and secure JWT-based authentication.

---

## 🚀 Features

- 👤 Employee CRUD management
- 🗓️ Leave request & approval workflow
- 🕒 **Biometric Attendance Integration** using ZKTeco SpeedFace V3L
- 🔐 Role-based access control
- 📄 Management of training, contracts, and disciplinary actions
- ✅ JWT Authentication (using `tymon/jwt-auth`)
- 🌐 RESTful API structure

---

## 🛠️ Tech Stack

| Layer       | Technology                                      |
|-------------|-------------------------------------------------|
| Frontend    | Angular 16                                      |
| Backend     | Laravel 8                                       |
| Language    | PHP 8                                           |
| Auth        | tymon/jwt-auth                                  |
| Attendance  | ZKTeco SpeedFace V3L + [jmrashed/zkteco-laravel](https://github.com/jmrashed/zkteco-laravel) |
| Database    | MySQL                                           |
| API Type    | REST API                                        |

---

## 📁 Project Structure

```bash
PFE/
├── pfe_project/      # Laravel 8 backend API
└── pfe-frontend/     # Angular 16 frontend


⚙️ Installation Guide
Prerequisites
PHP 8 installed

Composer installed

Node.js & npm installed

MySQL installed and running

Angular CLI installed globally (npm install -g @angular/cli)

1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/yourusername/hr-management-system.git
cd hr-management-system
2. Backend Setup (Laravel 8)
bash
Copy
Edit
cd pfe_project
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan jwt:secret
php artisan serve
Create a MySQL database and update .env with correct DB credentials.

The backend server will start at http://localhost:8000.

3. Frontend Setup (Angular 16)
bash
Copy
Edit
cd ../pfe-frontend
npm install
ng serve
The frontend will be served at http://localhost:4200.

4. Biometric Attendance Setup
This project integrates the ZKTeco SpeedFace V3L biometric device using the jmrashed/zkteco-laravel package.

Make sure the biometric device is accessible on your local network.

Add these to your pfe_project/.env:

env
Copy
Edit
ZKTECO_DEVICE_IP=192.168.1.201
ZKTECO_DEVICE_PORT=4370
You can test attendance functionality with mock data if the device is unavailable.

👤 Author
Mohsen Nabli
LinkedIn
GitHub
