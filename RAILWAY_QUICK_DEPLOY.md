# 🚂 نشر Backend على Railway - دليل مختصر

## 🎯 ما تحتاجه:
- حساب Railway مربوط بـ GitHub
- قواعد البيانات جاهزة (Supabase + Upstash)
- مفاتيح AI جاهزة

---

## 1️⃣ إنشاء قواعد البيانات أولاً

### PostgreSQL (Supabase):
```bash
1. اذهب إلى: https://supabase.com
2. New Project → same-ai-database
3. كلمة مرور قوية واحفظها!
4. Settings > Database > Copy connection string
```

### Redis (Upstash):
```bash
1. اذهب إلى: https://upstash.com  
2. Create Database → same-ai-redis
3. Copy Redis URL
```

---

## 2️⃣ نشر على Railway

### إنشاء المشروع:
```bash
1. اذهب إلى: https://railway.app
2. New Project > Deploy from GitHub repo
3. اختر: Same.Ai
4. ⚠️ مهم: Root Directory = backend
5. Deploy Now (سيفشل - طبيعي)
```

### إضافة متغيرات البيئة:
```bash
# في Railway > Variables:

# الأساسية
NODE_ENV=production
PORT=5000

# قواعد البيانات (من الخطوة 1)
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres
REDIS_URL=redis://default:YOUR_TOKEN@xxx.upstash.io:6379

# الأمان
JWT_SECRET=same-ai-super-secret-jwt-key-2024-change-this
JWT_REFRESH_SECRET=same-ai-refresh-secret-key-2024-change-this
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# CORS (استخدم رابط Vercel الجديد)
FRONTEND_URL=https://your-vercel-app.vercel.app
CORS_ORIGIN=https://your-vercel-app.vercel.app

# معلومات إضافية
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=12
```

---

## 3️⃣ مفاتيح AI (احصل عليها مجاناً)

### OpenAI:
```bash
1. https://platform.openai.com
2. API Keys > Create new secret key
3. انسخ: sk-proj-...
```

### Anthropic:
```bash
1. https://console.anthropic.com
2. API Keys > Create Key  
3. انسخ: sk-ant-...
```

### Google AI:
```bash
1. https://makersuite.google.com
2. Get API Key > Create API Key
3. انسخ: AIzaSy...
```

### أضفها في Railway:
```bash
OPENAI_API_KEY=sk-proj-your-key-here
ANTHROPIC_API_KEY=sk-ant-your-key-here
GOOGLE_AI_API_KEY=AIzaSy-your-key-here
```

---

## 4️⃣ تطبيق Database Schema

### في Railway Terminal:
```bash
npm install
npx prisma generate  
npx prisma db push
```

### أو محلياً:
```bash
cd backend
DATABASE_URL="your-supabase-url" npx prisma db push
```

---

## 5️⃣ إعادة النشر والاختبار

### إعادة Deploy:
```bash
# في Railway Dashboard:
1. انتظر إعادة النشر التلقائي
2. راقب Logs للتأكد من النجاح
3. احصل على رابط Backend
```

### اختبار سريع:
```bash
# اختبر Health Check:
curl https://your-railway-url.railway.app/health

# يجب أن تحصل على:
{"status": "OK", "timestamp": "..."}
```

---

## 6️⃣ ربط مع Frontend

### تحديث Vercel:
```bash
# في Vercel > Settings > Environment Variables:
NEXT_PUBLIC_API_URL=https://your-railway-url.railway.app
```

### تحديث Railway:
```bash
# في Railway > Variables:
FRONTEND_URL=https://your-vercel-app.vercel.app
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

### إعادة نشر كلاهما:
```bash
# Railway: تلقائياً
# Vercel: Deployments > Redeploy
```

---

## 🎉 اختبار نهائي

```bash
1. افتح التطبيق على Vercel
2. سجل حساب جديد
3. ابدأ محادثة مع AI
4. اختبر رفع ملف

✅ إذا عمل كل شيء = نجح النشر!
```

---

## 📞 إذا واجهت مشاكل:

### Build فشل:
- تأكد من Root Directory = backend
- تحقق من DATABASE_URL صحيح

### CORS خطأ:
- تأكد من CORS_ORIGIN = رابط Vercel الدقيق
- لا توجد مسافات إضافية

### AI لا يعمل:
- تحقق من مفاتيح API صحيحة
- تأكد من وجود رصيد في الحسابات