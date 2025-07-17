# ใช้ Node 18 alpine เป็น base image
FROM node:18-alpine

# กำหนด working directory ใน container
WORKDIR /app

# คัดลอก package.json และ package-lock.json เพื่อติดตั้ง dependencies
COPY package*.json ./

# ติดตั้ง dependencies รวม dev dependencies (ถ้าต้องการแยก production, dev ต้องใช้ npm ci --only=production แทน)
RUN npm install

# คัดลอก source code ทั้งหมด
COPY . .

# expose port แอปจะรัน (ให้ docker รู้)
EXPOSE 3000

# คำสั่งเริ่มต้น (production mode)
CMD ["node", "src/start.js"]
