import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,    // ดึงค่าจาก .env มารวมไว้ที่นี่แทน
    directUrl: process.env.DIRECT_URL // (ถ้ามี)
  },
});