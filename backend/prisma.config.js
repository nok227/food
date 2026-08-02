import "dotenv/config";
import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    // 🟢 บังคับใช้ DIRECT_URL เป็นหลักสำหรับการจัดการ Schema (db push / migrate)
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
});