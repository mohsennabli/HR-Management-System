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
