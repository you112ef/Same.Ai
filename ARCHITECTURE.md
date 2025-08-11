# Same.Ai - معمارية النظام

## نظرة عامة على المعمارية

Same.Ai يتبع معمارية **Full-Stack Modern Web Application** مع فصل كامل بين Frontend و Backend، مما يضمن قابلية التوسع والصيانة.

## مخطط المعمارية العام

```
[المستخدم] 
    ↓
[Frontend - Next.js/React]
    ↓
[API Gateway - Express.js]
    ↓
[Business Logic Layer]
    ↓ ↙ ↘
[Database - PostgreSQL] [Cache - Redis] [AI Services APIs]
```

## التفاصيل التقنية

### 1. Frontend Architecture (العميل)

**التقنيات:**
- Next.js 14 مع App Router
- React 18 مع TypeScript
- TailwindCSS + ShadCN UI
- Zustand لإدارة الحالة
- React Query للبيانات
- Socket.io Client للتحديثات المباشرة

**هيكل المجلدات:**
```
frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/            # مجموعة طرق المصادقة
│   ├── dashboard/         # الصفحة الرئيسية
│   ├── chat/              # صفحات المحادثة
│   └── layout.tsx         # التخطيط الأساسي
├── components/
│   ├── ui/                # مكونات ShadCN
│   ├── chat/              # مكونات المحادثة
│   ├── shared/            # مكونات مشتركة
│   └── forms/             # النماذج
├── hooks/                 # React Hooks مخصصة
├── lib/                   # المكتبات والأدوات
├── store/                 # Zustand stores
├── types/                 # تعريفات TypeScript
└── utils/                 # دوال مساعدة
```

**المكونات الرئيسية:**
- `ChatInterface`: واجهة المحادثة الرئيسية
- `ModelSelector`: اختيار نموذج الذكاء الاصطناعي
- `MessageList`: قائمة الرسائل
- `FileUploader`: رفع الملفات
- `CodeEditor`: محرر الكود المدمج

### 2. Backend Architecture (الخادم)

**التقنيات:**
- Node.js مع Express.js
- TypeScript للأمان
- Prisma ORM
- PostgreSQL للبيانات الرئيسية
- Redis للتخزين المؤقت
- Socket.io للاتصال المباشر
- JWT للمصادقة

**هيكل المجلدات:**
```
backend/
├── src/
│   ├── controllers/       # معالجات الطلبات
│   ├── middleware/        # الوسطاء
│   ├── routes/           # مسارات API
│   ├── services/         # منطق العمل
│   ├── models/           # نماذج البيانات
│   ├── utils/            # أدوات مساعدة
│   ├── types/            # تعريفات TypeScript
│   └── app.ts            # تطبيق Express الرئيسي
├── prisma/
│   ├── schema.prisma     # مخطط قاعدة البيانات
│   └── migrations/       # ملفات الهجرة
└── tests/                # الاختبارات
```

### 3. Database Schema (قاعدة البيانات)

**الجداول الرئيسية:**

```sql
-- المستخدمون
Users {
  id: String (PK)
  email: String (Unique)
  name: String
  avatar?: String
  role: UserRole (USER, ADMIN)
  createdAt: DateTime
  updatedAt: DateTime
}

-- المحادثات
Conversations {
  id: String (PK)
  title: String
  userId: String (FK -> Users.id)
  model: AIModel (GPT4, CLAUDE, GEMINI, etc.)
  createdAt: DateTime
  updatedAt: DateTime
}

-- الرسائل
Messages {
  id: String (PK)
  conversationId: String (FK -> Conversations.id)
  content: Text
  role: MessageRole (USER, ASSISTANT, SYSTEM)
  model?: AIModel
  tokens?: Int
  createdAt: DateTime
}

-- الملفات
Files {
  id: String (PK)
  name: String
  type: String
  size: Int
  url: String
  userId: String (FK -> Users.id)
  createdAt: DateTime
}

-- ربط الملفات بالمحادثات
ConversationFiles {
  id: String (PK)
  conversationId: String (FK -> Conversations.id)
  fileId: String (FK -> Files.id)
  createdAt: DateTime
}

-- إعدادات المستخدم
UserSettings {
  id: String (PK)
  userId: String (FK -> Users.id) (Unique)
  defaultModel: AIModel
  theme: Theme (LIGHT, DARK, SYSTEM)
  language: String
  preferences: Json
}

-- الفرق (للاستخدام المستقبلي)
Teams {
  id: String (PK)
  name: String
  description?: Text
  ownerId: String (FK -> Users.id)
  createdAt: DateTime
}

-- أعضاء الفرق
TeamMembers {
  id: String (PK)
  teamId: String (FK -> Teams.id)
  userId: String (FK -> Users.id)
  role: TeamRole (OWNER, ADMIN, MEMBER)
  joinedAt: DateTime
}
```

### 4. API Design (تصميم API)

**Base URL:** `/api/v1`

#### المصادقة
```
POST /auth/register     # التسجيل
POST /auth/login        # تسجيل الدخول
POST /auth/logout       # تسجيل الخروج
POST /auth/refresh      # تحديث الرمز
GET  /auth/profile      # معلومات المستخدم
PUT  /auth/profile      # تحديث المعلومات
```

#### المحادثات
```
GET    /conversations           # جلب جميع المحادثات
POST   /conversations           # إنشاء محادثة جديدة
GET    /conversations/:id       # جلب محادثة محددة
PUT    /conversations/:id       # تحديث عنوان المحادثة
DELETE /conversations/:id       # حذف المحادثة
```

#### الرسائل
```
GET    /conversations/:id/messages     # جلب رسائل المحادثة
POST   /conversations/:id/messages     # إرسال رسالة جديدة
DELETE /messages/:id                   # حذف رسالة
```

#### الملفات
```
POST   /files/upload    # رفع ملف
GET    /files           # جلب ملفات المستخدم
DELETE /files/:id       # حذف ملف
```

#### الذكاء الاصطناعي
```
POST   /ai/chat              # إرسال رسالة للذكاء الاصطناعي
POST   /ai/analyze-document  # تحليل مستند
POST   /ai/generate-image    # توليد صورة
POST   /ai/code-review       # مراجعة كود
```

### 5. AI Services Integration (تكامل خدمات الذكاء الاصطناعي)

**نماذج مدعومة:**
- OpenAI GPT-4, GPT-3.5
- Anthropic Claude 3
- Google Gemini Pro
- Meta Llama (عبر Replicate)

**هيكل Service:**
```typescript
interface AIService {
  sendMessage(message: string, history: Message[]): Promise<AIResponse>
  analyzeDocument(file: File): Promise<DocumentAnalysis>
  generateImage(prompt: string): Promise<ImageResult>
  reviewCode(code: string, language: string): Promise<CodeReview>
}

// تنفيذ منفصل لكل نموذج
class OpenAIService implements AIService { ... }
class ClaudeService implements AIService { ... }
class GeminiService implements AIService { ... }
```

### 6. Real-time Communication (الاتصال المباشر)

**Socket.io Events:**
```typescript
// Events من العميل للخادم
'join-conversation'     // الانضمام لمحادثة
'send-message'         // إرسال رسالة
'typing-start'         // بداية الكتابة
'typing-stop'          // توقف الكتابة

// Events من الخادم للعميل
'message-received'     // رسالة جديدة
'ai-response-start'    // بداية استجابة AI
'ai-response-chunk'    // جزء من الاستجابة
'ai-response-end'      // انتهاء الاستجابة
'user-typing'          // مستخدم آخر يكتب
```

### 7. Caching Strategy (استراتيجية التخزين المؤقت)

**Redis للتخزين المؤقت:**
- جلسات المستخدمين (24 ساعة)
- استجابات AI المتكررة (1 ساعة)
- معلومات المحادثات النشطة (30 دقيقة)
- معاينات الملفات (6 ساعات)

### 8. Security Measures (الأمان)

**المصادقة والتفويض:**
- JWT tokens مع انتهاء صلاحية
- Refresh tokens مع دوران
- Rate limiting لAPI
- CORS configuration
- Input validation وSanitization

**حماية البيانات:**
- تشفير كلمات المرور بـ bcrypt
- تشفير الملفات الحساسة
- HTTPS only في الإنتاج
- CSP headers

### 9. Deployment Architecture (معمارية النشر)

**Production Setup:**
```
[Load Balancer - Cloudflare]
         ↓
[Frontend - Vercel/Netlify]
         ↓
[API Gateway - AWS ELB]
         ↓
[Backend Servers - AWS EC2/ECS]
         ↓ ↙ ↘
[PostgreSQL - AWS RDS] [Redis - AWS ElastiCache] [File Storage - AWS S3]
```

**Environment Variables:**
```
# Database
DATABASE_URL=
REDIS_URL=

# Authentication
JWT_SECRET=
JWT_REFRESH_SECRET=

# AI Services
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_AI_API_KEY=
REPLICATE_API_TOKEN=

# File Storage
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=

# App Config
NODE_ENV=
PORT=
FRONTEND_URL=
```

## المتطلبات غير الوظيفية

### الأداء
- استجابة API < 200ms
- تحميل الصفحة الأولى < 2s
- استجابة AI < 5s للرسائل القصيرة

### التوسع
- دعم 10,000 مستخدم متزامن
- قابلية التوسع الأفقي للخوادم
- توزيع الحمولة التلقائي

### الموثوقية
- Uptime 99.9%
- نسخ احتياطية يومية
- استرداد البيانات في حالة الطوارئ

هذه المعمارية تضمن بناء تطبيق قابل للتوسع، آمن، وسريع الاستجابة لتلبية احتياجات منصة Same.Ai.