# ใช้ Node เวอร์ชันที่ต้องการ
FROM node:18-alpine

# กำหนด working directory ใน container
WORKDIR /app

# คัดลอก package.json และ package-lock.json เพื่อ install dependencies
COPY package*.json ./

# ติดตั้ง dependencies (รวม dev dependencies ด้วย)
RUN npm install

# คัดลอก source code ทั้งหมด
COPY . .

# expose port ที่แอปจะรัน
EXPOSE 3000

# ค่า default command คือ รัน production
CMD ["node", "src/worker.js"]
