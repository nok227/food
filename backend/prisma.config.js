import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    // ใช้ DATABASE_URL เป็นหลักในการทำงานทั่วไป (พอร์ต 6543)
    url: process.env.DATABASE_URL,    
    // ใส่เพิ่มบรรทัดนี้ เพื่อบอก Prisma ว่าถ้าจะ db push / migrate ให้สลับมาใช้ท่อนี้แทน (พอร์ต 5432)
    directUrl: process.env.DIRECT_URL 
  },
});