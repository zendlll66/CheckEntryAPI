# CheckEntry

### Directory
```plaintext
project-root/
├── docker-compose.yml
├── knexfile.js
├── package.json
├── node/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── db/
│   │   └── app.js
│   ├── Dockerfile
│   └── package.json
├── worker/
│   ├── src/
│   │   ├── worker.js
│   │   └── utils/
│   ├── Dockerfile
│   └── package.json
├── redis/
└── rabbitmq/

```
```markdown
- `node/` — โฟลเดอร์สำหรับ Node API Server (Express, Knex, etc.)
- `worker/` — โฟลเดอร์สำหรับ background worker ที่ใช้ RabbitMQ + Redis
- `redis/` — สำหรับ config หรือสคริปต์จัดการ Redis (ถ้ามี)
- `rabbitmq/` — สำหรับ config หรือสคริปต์จัดการ RabbitMQ (ถ้ามี)
```

---
### คำสั่ง Docker
Build และรัน
```bash 
docker compose up --scale node=3 --scale worker=2 --build -d 
```

Build สำหรับ Dev
```
docker-compose -f docker-compose.yml -f docker-compose.override.yml up --scale node=2 --scale worker=2 --build -d 
```

ดู log ทั้งหมดพร้อมกัน (ทุก container ที่ชื่อ node_*)
```bash 
docker-compose logs node
```
หรือถ้าอยากดูแบบ ต่อเนื่อง (real-time)
```bash 
docker-compose logs -f node
```

ดู log ของ node ตัวใดตัวหนึ่งแยกกัน (เช่น node_1)
```bash 
docker logs yourproject_node_1
```
หรือ
```bash 
docker-compose logs node_1
```
หมายเหตุ: ชื่อ container แบบเต็มดูได้โดย
```bash 
docker ps
```

ดู log พร้อมกรองข้อความ (ใช้ grep)
```bash 
docker-compose logs node | grep "Connected"
```

ตัวอย่างคำสั่งสำหรับ workflow
# ดู log ต่อเนื่องของ node_2
```bash 
docker logs -f yourproject_node_2

---
### คำสั่ง knex
ติดตั้ง knex CLI
```bash 
npm install -g knex
```

รัน migration (เมื่อมีไฟล์ migration ใน ./migrations)
```bash 
knex migrate:latest --env development
```

รัน seed (เมื่อมีไฟล์ seed ใน ./seeds)
```bash 
knex seed:run --env development
```

ตัวอย่างสร้าง table ไหม
```bash 
npx knex migrate:make create_users_table

```

```bash 
npx knex migrate:latest
```

# คำสั่งดู Cache ใน Redis
```bash 
docker exec -it redis redis-cli


https://developers.google.com/oauthplayground/
Firebase Cloud Messaging API v1
https://www.googleapis.com/auth/firebase.messaging
กดขอ Authorize APIS

