# دليل النشر والتشغيل - Same.Ai

## 🚀 تشغيل التطبيق محلياً

### الطريقة السريعة (Docker)

1. **استنساخ المشروع**
```bash
git clone https://github.com/you112ef/Same.Ai.git
cd Same.Ai
```

2. **إعداد متغيرات البيئة**
```bash
# Backend
cd backend
cp .env.example .env

# Frontend  
cd ../frontend
cp .env.example .env.local
```

3. **تشغيل مع Docker**
```bash
# العودة للمجلد الرئيسي
cd ..
docker-compose up -d
```

4. **فتح التطبيق**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Prisma Studio: http://localhost:5555

### الطريقة التقليدية

#### المتطلبات
- Node.js 18+
- PostgreSQL 14+
- Redis 6+

#### خطوات التثبيت

1. **Backend**
```bash
cd backend
npm install
npx prisma migrate dev
npx prisma generate
npm run dev
```

2. **Frontend**
```bash
cd frontend
npm install
npm run dev
```

## 🔧 إعداد مفاتيح الذكاء الاصطناعي

### 1. OpenAI (GPT-4, GPT-3.5)

1. انتقل إلى [OpenAI Platform](https://platform.openai.com/)
2. سجل دخولك أو أنشئ حساب جديد
3. اذهب إلى **API Keys** في الإعدادات
4. اضغط **Create new secret key**
5. انسخ المفتاح وأضفه في `.env`:
```env
OPENAI_API_KEY=sk-your-openai-key-here
```

### 2. Anthropic (Claude 3)

1. انتقل إلى [Anthropic Console](https://console.anthropic.com/)
2. سجل دخولك أو أنشئ حساب جديد
3. اذهب إلى **API Keys**
4. أنشئ مفتاح جديد
5. أضفه في `.env`:
```env
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
```

### 3. Google AI (Gemini)

1. انتقل إلى [Google AI Studio](https://makersuite.google.com/)
2. سجل دخولك بحساب Google
3. اذهب إلى **Get API Key**
4. أنشئ مفتاح جديد
5. أضفه في `.env`:
```env
GOOGLE_AI_API_KEY=your-google-ai-key-here
```

### 4. Replicate (Llama)

1. انتقل إلى [Replicate](https://replicate.com/)
2. سجل دخولك أو أنشئ حساب جديد
3. اذهب إلى **Account** > **API Tokens**
4. أنشئ توكن جديد
5. أضفه في `.env`:
```env
REPLICATE_API_TOKEN=r8_your-replicate-token-here
```

## ☁️ النشر السحابي

### النشر على Vercel + Railway

#### 1. Frontend على Vercel

1. **رفع إلى GitHub أولاً**
```bash
# في مجلد المشروع الرئيسي
git init
git add .
git commit -m "Initial commit: Same.Ai platform"
git remote add origin https://github.com/username/Same.Ai.git
git push -u origin main
```

2. **النشر على Vercel**
- اذهب إلى [Vercel](https://vercel.com/)
- اربط حساب GitHub
- استورد مشروع Same.Ai
- اختر مجلد `frontend`
- أضف متغيرات البيئة:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

#### 2. Backend على Railway

1. **إنشاء مشروع على Railway**
- اذهب إلى [Railway](https://railway.app/)
- أنشئ مشروع جديد
- اختر **Deploy from GitHub repo**
- حدد مجلد `backend`

2. **إضافة قاعدة البيانات**
- أضف PostgreSQL service
- أضف Redis service

3. **متغيرات البيئة**
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=your-production-jwt-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
GOOGLE_AI_API_KEY=your-google-key
REPLICATE_API_TOKEN=your-replicate-token
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### النشر على AWS

#### 1. Frontend على S3 + CloudFront

```bash
# بناء المشروع
cd frontend
npm run build
npm run export

# رفع إلى S3
aws s3 sync out/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

#### 2. Backend على ECS/EC2

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    ports:
      - "5000:5000"
  
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: same_ai
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    
  redis:
    image: redis:7-alpine
```

### النشر على DigitalOcean

#### 1. إنشاء Droplet

```bash
# الاتصال بالسيرفر
ssh root@your-server-ip

# تثبيت المتطلبات
apt update
apt install -y docker.io docker-compose git

# استنساخ المشروع
git clone https://github.com/username/Same.Ai.git
cd Same.Ai

# إعداد متغيرات البيئة
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# تشغيل المشروع
docker-compose -f docker-compose.prod.yml up -d
```

#### 2. إعداد Nginx Proxy

```nginx
# /etc/nginx/sites-available/same-ai
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

## 🔄 GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy Same.Ai

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install Backend Dependencies
        run: |
          cd backend
          npm ci
          
      - name: Install Frontend Dependencies
        run: |
          cd frontend
          npm ci
          
      - name: Run Backend Tests
        run: |
          cd backend
          npm test
          
      - name: Run Frontend Tests
        run: |
          cd frontend
          npm test

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@v1.3.0
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: 'backend'

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          working-directory: ./frontend
```

## 🔒 أمان الإنتاج

### 1. متغيرات البيئة الآمنة

```env
# استخدم مفاتيح قوية في الإنتاج
JWT_SECRET=$(openssl rand -hex 64)
JWT_REFRESH_SECRET=$(openssl rand -hex 64)

# قيود الاتصال
CORS_ORIGIN=https://your-domain.com
RATE_LIMIT_MAX_REQUESTS=50
RATE_LIMIT_WINDOW_MS=900000
```

### 2. إعداد HTTPS

```bash
# تثبيت Certbot
sudo apt install certbot python3-certbot-nginx

# الحصول على شهادة SSL
sudo certbot --nginx -d your-domain.com

# تجديد تلقائي
sudo crontab -e
# أضف: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 مراقبة الإنتاج

### 1. تسجيل الأحداث

```javascript
// backend/src/utils/logger.ts
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
})
```

### 2. مراقبة الأداء

```bash
# استخدام PM2 للإنتاج
npm install -g pm2

# تشغيل البرنامج
pm2 start dist/index.js --name same-ai-backend

# مراقبة
pm2 monitor
pm2 logs same-ai-backend
```

## 🔧 استكشاف الأخطاء

### مشاكل شائعة

1. **خطأ اتصال قاعدة البيانات**
```bash
# تحقق من حالة PostgreSQL
docker-compose ps
docker-compose logs postgres
```

2. **مشاكل مفاتيح API**
```bash
# تأكد من وجود المفاتيح
grep -E "(OPENAI|ANTHROPIC|GOOGLE)" backend/.env
```

3. **مشاكل الذاكرة**
```bash
# زيادة حد الذاكرة
export NODE_OPTIONS="--max-old-space-size=4096"
```

---

## 📞 دعم إضافي

إذا واجهت أي مشاكل:
1. راجع ملف README.md
2. تحقق من logs التطبيق
3. تأكد من إعداد متغيرات البيئة صحيحة
4. تحقق من حالة الخدمات الخارجية (OpenAI, Anthropic, etc.)

**تم إنشاء هذا الدليل لضمان نشر ناجح وآمن لتطبيق Same.Ai 🚀**