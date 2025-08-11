# 🚂 دليل نشر Backend على Railway

## 🎯 ما ستحققه:
- نشر Backend مجاناً على Railway (500 ساعة/شهر)
- ربط مع GitHub للنشر التلقائي
- إعداد قواعد البيانات والمتغيرات
- اختبار API endpoints

---

## 1️⃣ إنشاء حساب Railway

### خطوة 1: التسجيل
1. **اذهب إلى [railway.app](https://railway.app)**
2. **اضغط "Login"**
3. **اختر "Continue with GitHub"**
4. **امنح الصلاحيات المطلوبة**

### خطوة 2: التحقق من الحساب
- تحقق من بريدك الإلكتروني
- أكد الحساب إذا طُلب منك

---

## 2️⃣ إعداد قواعد البيانات أولاً

### إعداد PostgreSQL (Supabase):
1. **اذهب إلى [supabase.com](https://supabase.com)**
2. **اضغط "New Project"**
3. **املأ البيانات:**
   ```
   Name: same-ai-database
   Password: [كلمة مرور قوية - احفظها!]
   Region: اختر الأقرب لك
   ```
4. **انتظر 2-3 دقائق للإعداد**
5. **اذهب إلى Settings > Database**
6. **انسخ Connection string:**
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.abcdefgh.supabase.co:5432/postgres
   ```

### إعداد Redis (Upstash):
1. **اذهب إلى [upstash.com](https://upstash.com)**
2. **سجل دخولك بـ GitHub**
3. **اضغط "Create Database"**
4. **املأ البيانات:**
   ```
   Name: same-ai-redis
   Region: نفس منطقة Supabase
   Type: Free
   ```
5. **انسخ Connection string:**
   ```
   redis://default:[TOKEN]@[HOST]:6379
   ```

---

## 3️⃣ إنشاء مشروع Railway

### خطوة 1: New Project
1. **في Railway Dashboard، اضغط "New Project"**
2. **اختر "Deploy from GitHub repo"**
3. **ابحث عن `Same.Ai` واختره**

### خطوة 2: تكوين المشروع
```bash
# في صفحة Deploy:
Repository: Same.Ai
Root Directory: backend    # مهم جداً!
Branch: main

# Railway سيكتشف تلقائياً:
- Package.json في مجلد backend
- Start command: npm start
- Build command: npm run build
```

### خطوة 3: إعداد أولي
- **اضغط "Deploy Now"**
- **سيفشل النشر (طبيعي) لأن متغيرات البيئة غير موجودة**

---

## 4️⃣ إعداد متغيرات البيئة

### في Railway Dashboard > Variables:
```bash
# البيئة الأساسية
NODE_ENV=production
PORT=5000

# قاعدة البيانات (من Supabase)
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres

# Redis (من Upstash)
REDIS_URL=redis://default:YOUR_TOKEN@xxx.upstash.io:6379

# أمان JWT (أنشئ مفاتيح قوية)
JWT_SECRET=same-ai-super-secret-jwt-key-change-this-in-production-2024
JWT_REFRESH_SECRET=same-ai-refresh-secret-key-change-this-too-2024
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# CORS (سنحدثه بعد الحصول على رابط Frontend)
FRONTEND_URL=https://your-vercel-app.vercel.app
CORS_ORIGIN=https://your-vercel-app.vercel.app

# معلومات إضافية
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=12
```

### مفاتيح AI (احصل عليها من الخطوة التالية):
```bash
# OpenAI
OPENAI_API_KEY=sk-your-openai-key-here

# Anthropic  
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here

# Google AI
GOOGLE_AI_API_KEY=your-google-ai-key-here

# Replicate (اختياري)
REPLICATE_API_TOKEN=r8_your-replicate-token-here
```

---

## 5️⃣ إعداد Database Schema

### تشغيل Prisma Migration:
```bash
# في Railway Terminal (اضغط على القائمة > Terminal):
npm install
npx prisma generate
npx prisma db push

# أو محلياً:
cd backend
DATABASE_URL="your-supabase-url" npx prisma db push
DATABASE_URL="your-supabase-url" npx prisma generate
```

### إضافة بيانات تجريبية (اختياري):
```bash
# في Railway Terminal:
npm run db:seed

# أو محلياً:
DATABASE_URL="your-supabase-url" npm run db:seed
```

---

## 6️⃣ إعادة النشر مع المتغيرات

### خطوة 1: إعادة Deploy
1. **في Railway Dashboard**
2. **اضغط "Deploy" أو انتظر النشر التلقائي**
3. **راقب Logs للتأكد من النجاح**

### خطوة 2: الحصول على رابط Backend
```bash
# بعد النشر الناجح، ستحصل على رابط مثل:
https://same-ai-backend-production.railway.app

# أو:
https://backend-production-1234.up.railway.app
```

### خطوة 3: اختبار Backend
```bash
# اختبر Health Check:
curl https://your-railway-url.railway.app/health

# يجب أن تحصل على:
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

---

## 7️⃣ الحصول على مفاتيح AI

### OpenAI (GPT-4, GPT-3.5):
1. **اذهب إلى [platform.openai.com](https://platform.openai.com)**
2. **سجل حساب جديد** (تحصل على $5 مجاناً)
3. **API Keys > Create new secret key**
4. **انسخ المفتاح:** `sk-proj-...`

### Anthropic (Claude 3):
1. **اذهب إلى [console.anthropic.com](https://console.anthropic.com)**
2. **سجل حساب جديد** (رصيد مجاني)
3. **Account Settings > API Keys**
4. **انسخ المفتاح:** `sk-ant-...`

### Google AI (Gemini):
1. **اذهب إلى [makersuite.google.com](https://makersuite.google.com)**
2. **سجل دخولك بحساب Google**
3. **Get API Key > Create API Key**
4. **انسخ المفتاح:** `AIzaSy...`

### أضف المفاتيح في Railway:
```bash
# في Railway Variables:
OPENAI_API_KEY=sk-proj-your-actual-key
ANTHROPIC_API_KEY=sk-ant-your-actual-key  
GOOGLE_AI_API_KEY=AIzaSy-your-actual-key
```

---

## 8️⃣ ربط مع Frontend (Vercel)

### تحديث CORS في Railway:
```bash
# في Railway Variables، حدث:
FRONTEND_URL=https://your-actual-vercel-app.vercel.app
CORS_ORIGIN=https://your-actual-vercel-app.vercel.app
```

### تحديث API URL في Vercel:
```bash
# في Vercel Project > Settings > Environment Variables:
NEXT_PUBLIC_API_URL=https://your-railway-url.railway.app
```

### إعادة نشر كلاهما:
```bash
# Railway: سيعيد النشر تلقائياً عند تغيير Variables
# Vercel: في Dashboard > Deployments > Redeploy
```

---

## 9️⃣ اختبار التطبيق الكامل

### اختبار Backend APIs:
```bash
# Health Check
curl https://your-railway-url.railway.app/health

# Register endpoint
curl -X POST https://your-railway-url.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123!"}'

# AI Models endpoint
curl https://your-railway-url.railway.app/api/ai/models
```

### اختبار Frontend Integration:
1. **افتح التطبيق على Vercel**
2. **سجل حساب جديد**
3. **سجل دخولك**
4. **ابدأ محادثة جديدة**
5. **اختبر رفع ملف**

---

## 🔧 استكشاف الأخطاء

### Build فشل:
```bash
# تحقق من Build Logs في Railway:
1. Missing dependencies → npm install  
2. TypeScript errors → npm run build محلياً
3. Environment variables → تأكد من DATABASE_URL
```

### Database Connection خطأ:
```bash
# تحقق من:
1. DATABASE_URL صحيح من Supabase
2. كلمة المرور صحيحة
3. Prisma schema مُطبق: npx prisma db push
```

### CORS خطأ:
```bash
# تأكد من:
1. CORS_ORIGIN = رابط Vercel الدقيق
2. FRONTEND_URL = نفس رابط Vercel
3. لا توجد مسافات إضافية في URL
```

### AI APIs لا تعمل:
```bash
# تحقق من:
1. مفاتيح API صحيحة وفعالة
2. رصيد كافي في الحسابات
3. Network access في البلد
```

---

## 📊 مراقبة الأداء

### Railway Metrics:
```bash
# راقب في Railway Dashboard:
📈 CPU Usage
💾 Memory Usage  
🌐 Network Traffic
📝 Application Logs
```

### تحسين الاستخدام:
```bash
# لتوفير الساعات المجانية:
1. تأكد من إيقاف Background jobs غير الضرورية
2. استخدم Redis للتخزين المؤقت
3. قلل من استدعاءات Database غير الضرورية
```

---

## 🎉 تهانينا!

إذا وصلت إلى هنا، فقد نجحت في:

✅ **نشر Backend على Railway**
✅ **ربط قاعدة البيانات مع Supabase**  
✅ **إعداد Redis للتخزين المؤقت**
✅ **الحصول على مفاتيح AI مجانية**
✅ **ربط Frontend مع Backend**
✅ **اختبار التطبيق الكامل**

**التطبيق الآن يعمل بالكامل مجاناً على الإنترنت! 🚀**

---

## 📱 الروابط النهائية

```bash
🌐 Frontend: https://your-vercel-app.vercel.app
⚙️ Backend: https://your-railway-app.railway.app  
📊 Database: Supabase Dashboard
🗄️ Redis: Upstash Dashboard
📈 Monitoring: Railway Dashboard
```

**التكلفة: $0/شهر** 💰