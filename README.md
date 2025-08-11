# Same.Ai - منصة الذكاء الاصطناعي الموحدة

Same.Ai هي منصة ذكاء اصطناعي موحدة تتيح للمستخدمين التفاعل مع عدة نماذج ذكاء اصطناعي متقدمة في مكان واحد، بما في ذلك GPT-4، Claude 3، Gemini Pro، وLlama.

## 🌟 الميزات الرئيسية

### 🤖 نماذج الذكاء الاصطناعي المتعددة
- **OpenAI**: GPT-4, GPT-3.5 Turbo
- **Anthropic**: Claude 3 Opus, Sonnet, Haiku
- **Google**: Gemini Pro, Gemini Ultra
- **Meta**: Llama 2, Llama 3

### 💬 واجهة محادثة متطورة
- محادثات فورية مع دعم الـ streaming
- تبديل النماذج أثناء المحادثة
- حفظ وإدارة المحادثات
- دعم كامل للغة العربية (RTL)

### 📁 إدارة الملفات
- رفع وتحليل المستندات
- دعم أنواع ملفات متعددة (PDF, Word, Excel, صور)
- تحليل ذكي للمحتوى

### 🎨 واجهة مستخدم حديثة
- تصميم responsive يدعم جميع الشاشات
- وضع داكن/فاتح
- دعم RTL للعربية
- مكونات UI متطورة مع ShadCN

### ⚡ الأداء والأمان
- مصادقة JWT آمنة
- Rate limiting وحماية من الهجمات
- Redis للتخزين المؤقت
- Socket.IO للتواصل الفوري

## 🏗️ البنية التقنية

### Frontend
- **إطار العمل**: Next.js 14 + React 19 + TypeScript
- **التصميم**: TailwindCSS V4 + ShadCN UI
- **إدارة الحالة**: React Query + Zustand
- **التواصل**: Socket.IO Client + Axios

### Backend
- **الخادم**: Node.js + Express + TypeScript
- **قاعدة البيانات**: PostgreSQL + Prisma ORM
- **التخزين المؤقت**: Redis
- **الذكاء الاصطناعي**: OpenAI SDK, Anthropic SDK, Google AI SDK
- **التواصل الفوري**: Socket.IO

### DevOps
- **Containerization**: Docker + Docker Compose
- **Web Server**: Nginx
- **Environment**: Multi-stage Dockerfiles

## 📦 التثبيت والتشغيل

### المتطلبات
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Docker & Docker Compose (اختياري)

### 1. استنساخ المشروع
```bash
git clone https://github.com/you112ef/Same.Ai.git
cd Same.Ai
```

### 2. إعداد متغيرات البيئة

#### Backend
```bash
cd backend
cp .env.example .env
# قم بتعديل متغيرات البيئة في .env
```

#### Frontend
```bash
cd frontend
cp .env.example .env.local
# قم بتعديل متغيرات البيئة في .env.local
```

### 3. تشغيل باستخدام Docker (الأسهل)
```bash
# من المجلد الرئيسي
docker-compose up -d
```

### 4. تشغيل محلي

#### Backend
```bash
cd backend
npm install
npx prisma migrate dev
npx prisma generate
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔧 التكوين

### قواعد البيانات
```bash
# إنشاء قاعدة البيانات
npx prisma migrate dev

# ملء البيانات التجريبية
npm run db:seed

# فتح Prisma Studio
npm run db:studio
```

### مفاتيح الذكاء الاصطناعي
قم بإضافة مفاتيح API في ملف `.env`:
```env
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
GOOGLE_AI_API_KEY=your-google-ai-key
```

## 📱 الاستخدام

### إنشاء حساب
1. انتقل إلى `/auth/register`
2. أدخل بياناتك الشخصية
3. قم بتأكيد كلمة المرور

### بدء محادثة
1. من لوحة التحكم، اضغط "محادثة جديدة"
2. اختر نموذج الذكاء الاصطناعي المناسب
3. ابدأ المحادثة!

### تحليل المستندات
1. ارفع ملف من صفحة "الملفات"
2. اختر "تحليل بالذكاء الاصطناعي"
3. احصل على ملخص وتحليل فوري

## 🔧 تطوير المشروع

### البنية
```
Same.Ai/
├── frontend/          # تطبيق Next.js
├── backend/           # خادم Express
├── shared/            # أنواع مشتركة
├── docs/              # التوثيق
├── docker-compose.yml # إعداد Docker
└── README.md
```

### Scripts مفيدة
```bash
# Frontend
npm run dev          # تشغيل التطوير
npm run build        # بناء الإنتاج
npm run lint         # فحص الكود

# Backend
npm run dev          # تشغيل التطوير
npm run build        # بناء TypeScript
npm run db:migrate   # تحديث قاعدة البيانات
npm run test         # تشغيل الاختبارات
```

## 🧪 الاختبار

```bash
# اختبار Backend
cd backend
npm test

# اختبار Frontend
cd frontend
npm test
```

## 🚀 النشر

### إنتاج باستخدام Docker
```bash
# بناء الصور
docker-compose -f docker-compose.prod.yml build

# تشغيل الإنتاج
docker-compose -f docker-compose.prod.yml up -d
```

### إعداد Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://backend:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /socket.io {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## 🔒 الأمان

### أفضل الممارسات المُطبقة
- تشفير كلمات المرور باستخدام bcrypt
- JWT tokens آمنة مع refresh tokens
- Rate limiting للحماية من الهجمات
- تنقية المدخلات ومنع SQL Injection
- CORS محدد بدقة
- Helmet.js للحماية من الهجمات الشائعة

### مراقبة الأمان
- تسجيل جميع طلبات API
- مراقبة محاولات الاختراق
- تنبيهات عند تجاوز حدود الاستخدام

## 📊 مراقبة الأداء

### المتاح حالياً
- تتبع استخدام الرموز (tokens)
- إحصائيات المحادثات والرسائل
- مراقبة استخدام النماذج

### خطط مستقبلية
- تحليلات متقدمة للاستخدام
- تقارير الأداء
- تنبيهات التكاليف

## 🤝 المساهمة

### كيفية المساهمة
1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى Branch (`git push origin feature/amazing-feature`)
5. فتح Pull Request

### معايير الكود
- استخدام TypeScript بدقة
- اتباع ESLint rules
- كتابة اختبارات للميزات الجديدة
- توثيق الكود والـ API

## 📝 الرخصة

هذا المشروع محمي برخصة MIT. راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 🆘 الدعم والمساعدة

### المشاكل الشائعة
1. **خطأ في الاتصال بقاعدة البيانات**
   - تأكد من تشغيل PostgreSQL
   - تحقق من DATABASE_URL في .env

2. **مشاكل مفاتيح API**
   - تأكد من صحة مفاتيح الذكاء الاصطناعي
   - تحقق من حدود الاستخدام في حساباتك

3. **مشاكل الأداء**
   - تأكد من تشغيل Redis للتخزين المؤقت
   - راقب استخدام الذاكرة

### التواصل
- GitHub Issues: للإبلاغ عن المشاكل
- Email: support@same-ai.com
- Discord: [رابط خادم Discord]

## 🎯 الخطط المستقبلية

### الإصدار القادم (v2.0)
- [ ] دعم المزيد من نماذج الذكاء الاصطناعي
- [ ] ميزة فرق العمل والتعاون
- [ ] تطبيق موبايل (React Native)
- [ ] تحليلات متقدمة
- [ ] API عام للمطورين

### الميزات طويلة المدى
- [ ] تدريب نماذج مخصصة
- [ ] دمج مع أدوات خارجية
- [ ] ذكاء اصطناعي للصوت والصورة
- [ ] منصة marketplace للإضافات

---

## 📞 فريق التطوير

تم تطوير Same.Ai بواسطة فريق متخصص في تقنيات الذكاء الاصطناعي والتطوير الحديث.

**تقدير خاص للتقنيات المستخدمة:**
- OpenAI لنماذج GPT المتطورة
- Anthropic لنماذج Claude الذكية
- Google لنماذج Gemini المتعددة الوسائط
- Meta لنماذج Llama مفتوحة المصدر

---

*بني بـ ❤️ لمجتمع الذكاء الاصطناعي العربي*