# CheckEntry API Documentation

## Authentication API

### Base URL
```
/api/auth
```

---

## 📝 User Registration

### Endpoint
```
POST /api/auth/register
```

### Description
สร้างบัญชีผู้ใช้ใหม่ในระบบ

### Request Body
```json
{
  "email": "user@example.com",
  "phone": "0987654321", 
  "password": "yourpassword"
}
```

### Request Parameters
| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| email     | string | Yes      | อีเมลของผู้ใช้ |
| phone     | string | Yes      | เบอร์โทรศัพท์ |
| password  | string | Yes      | รหัสผ่าน |

### Response

#### ✅ Success (201 Created)
```json
{
  "message": "User created successfully",
  "user": [
    {
      "id": 1,
      "email": "user@example.com",
      "phone": "0987654321",
      "password_hash": "$2b$10$...",
      "firebase_token": null
    }
  ]
}
```

#### ❌ Error (400 Bad Request) - Duplicate User
```json
{
  "error": "การสมัครไม่สำเร็จ: อีเมล และ เบอร์โทรศัพท์ นี้มีอยู่ในระบบแล้ว",
  "duplicateEmail": true,
  "duplicatePhone": true
}
```

#### ❌ Error (500 Internal Server Error)
```json
{
  "error": "Internal server error"
}
```

---

## 🔐 User Login

### Endpoint
```
POST /api/auth/login
```

### Description
เข้าสู่ระบบด้วยเบอร์โทรศัพท์และรหัสผ่าน

### Request Body
```json
{
  "phone": "0987654321",
  "password": "yourpassword",
  "firebase_token": "firebase_fcm_token_here"
}
```

### Request Parameters
| Parameter      | Type   | Required | Description |
|----------------|--------|----------|-------------|
| phone          | string | Yes      | เบอร์โทรศัพท์ที่ลงทะเบียนไว้ |
| password       | string | Yes      | รหัสผ่าน |
| firebase_token | string | Yes      | Firebase FCM Token สำหรับ push notification |

### Response

#### ✅ Success (200 OK)
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "phone": "0987654321",
    "firebase_token": "firebase_fcm_token_here"
  }
}
```

#### ❌ Error (400 Bad Request) - Invalid Phone
```json
{
  "success": false,
  "message": "Invalid phone"
}
```

#### ❌ Error (400 Bad Request) - Invalid Password
```json
{
  "success": false,
  "message": "Invalid password"
}
```

#### ❌ Error (400 Bad Request) - Missing Firebase Token
```json
{
  "success": false,
  "message": "Firebase token is required"
}
```

#### ❌ Error (500 Internal Server Error)
```json
{
  "success": false,
  "message": "error_message =>  catch error"
}
```

---

## 🔍 Token Verification

### Endpoint
```
POST /api/auth/checkauthtoken
```

### Description
ตรวจสอบความถูกต้องของ JWT Token

### Request Body
```json
{
  "token": "your_jwt_token_here"
}
```

### Request Parameters
| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| token     | string | Yes      | JWT Token ที่ต้องการตรวจสอบ |

### Response

#### ✅ Success (200 OK)
```json
{
  "email": "user@example.com",
  "iat": 1640995200,
  "exp": 1640998800
}
```

#### ❌ Error (401 Unauthorized)
```json
{
  "error": "Invalid or expired token"
}
```

---

## 📋 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  firebase_token TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🔧 Implementation Notes

### Password Security
- รหัสผ่านจะถูก hash ด้วย bcrypt ก่อนเก็บในฐานข้อมูล
- Salt rounds = 10 (default)

### Firebase Integration
- ระบบต้องการ Firebase FCM Token สำหรับการส่ง push notifications
- Token จะถูกอัพเดตทุกครั้งที่ login

### Duplicate Check
- ตรวจสอบความซ้ำของ email และ phone number
- แสดงข้อความผิดพลาดเป็นภาษาไทย

### Error Handling
- ใช้ HTTP status codes ตามมาตรฐาน
- ส่งข้อความข้อผิดพลาดที่ชัดเจน
- Log errors ไว้ใน console สำหรับ debugging

---

## 🧪 Example Usage

### Register New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "phone": "0987654321",
    "password": "mypassword123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "0987654321",
    "password": "mypassword123",
    "firebase_token": "your_firebase_token_here"
  }'
```

### Check Token
```bash
curl -X POST http://localhost:3000/api/auth/checkauthtoken \
  -H "Content-Type: application/json" \
  -d '{
    "token": "your_jwt_token_here"
  }'
``` 