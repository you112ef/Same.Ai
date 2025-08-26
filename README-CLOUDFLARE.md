# نشر التطبيق على Cloudflare Pages

## المتطلبات المسبقة

1. حساب Cloudflare نشط
2. مشروع GitHub مع الكود
3. Cloudflare API Token
4. Cloudflare Account ID

## الخطوات

### 1. الحصول على Cloudflare API Token

1. اذهب إلى [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. اذهب إلى "My Profile" > "API Tokens"
3. انقر على "Create Token"
4. اختر "Custom token"
5. امنح الصلاحيات التالية:
   - Zone:Zone:Read
   - Zone:Zone:Edit
   - Account:Account:Read
   - User:User:Read
6. انسخ الـ Token

### 2. الحصول على Account ID

1. في Cloudflare Dashboard، انظر إلى الجانب الأيمن
2. ستجد Account ID في "Account Home"

### 3. إعداد GitHub Secrets

1. اذهب إلى مشروع GitHub
2. اذهب إلى Settings > Secrets and variables > Actions
3. أضف الـ secrets التالية:
   - `CLOUDFLARE_API_TOKEN`: API Token من الخطوة 1
   - `CLOUDFLARE_ACCOUNT_ID`: Account ID من الخطوة 2

### 4. النشر التلقائي

بمجرد إعداد الـ secrets، سيتم النشر تلقائياً عند:
- Push إلى branch `main` أو `master`
- إنشاء Pull Request

### 5. النشر اليدوي

```bash
# تثبيت Wrangler CLI
npm install -g wrangler

# تسجيل الدخول
wrangler login

# النشر
wrangler pages publish client/dist --project-name=ai-coding-assistant
```

## تكوين التطبيق

### ملفات التكوين المطلوبة

- `wrangler.toml`: تكوين Wrangler
- `_redirects`: قواعد التوجيه
- `_headers`: headers الأمان
- `.github/workflows/deploy-cloudflare.yml`: workflow النشر

### إعدادات البناء

```bash
# بناء التطبيق
npm run build:client

# المجلد الناتج
client/dist/
```

## استكشاف الأخطاء

### مشاكل شائعة

1. **خطأ في API Token**: تأكد من صحة الـ token وصلاحياته
2. **خطأ في Account ID**: تأكد من صحة Account ID
3. **فشل في البناء**: تحقق من سجلات GitHub Actions

### فحص الحالة

```bash
# فحص حالة النشر
wrangler pages deployment list --project-name=ai-coding-assistant

# فحص سجلات النشر
wrangler pages deployment tail --project-name=ai-coding-assistant
```

## الميزات

- ✅ نشر تلقائي من GitHub
- ✅ تحسين الأداء مع Cloudflare CDN
- ✅ أمان محسن مع headers مخصصة
- ✅ إعادة توجيه SPA
- ✅ تحسين التخزين المؤقت

## الدعم

للمساعدة، راجع:
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [GitHub Actions](https://docs.github.com/en/actions)