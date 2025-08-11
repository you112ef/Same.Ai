# ⚡ تفعيل النشر التلقائي على Vercel

## 🎯 ما ستحققه:
- نشر تلقائي عند كل `git push` للـ main branch
- نشر تجريبي للـ Pull Requests
- إشعارات فورية عند نجاح/فشل النشر
- إدارة فروع متعددة

---

## 1️⃣ النشر التلقائي الأساسي (مُفعل تلقائياً)

### Vercel يُفعل تلقائياً:
```bash
✅ Production Deployments - عند push لـ main
✅ Preview Deployments - للـ Pull Requests  
✅ Branch Deployments - للفروع الأخرى
```

### للتأكد من التفعيل:
1. **اذهب إلى Vercel Dashboard**
2. **اختر مشروع Same.Ai**
3. **Settings > Git**
4. **تأكد من هذه الإعدادات:**
   ```
   Connected Git Repository: ✅ your-username/Same.Ai
   Production Branch: main
   Auto-merge on Deploy: ✅ (اختياري)
   ```

---

## 2️⃣ إعداد Webhooks للإشعارات

### GitHub Webhooks:
```bash
# في GitHub Repository Settings > Webhooks
# Vercel سيضيف webhook تلقائياً:

URL: https://api.vercel.com/v1/integrations/github/webhooks/...
Events: push, pull_request, deployment_status
```

### اختبار النشر التلقائي:
```bash
# اعمل أي تغيير بسيط:
echo "// Auto-deploy test" >> frontend/README.md

# ادفع التغيير:
git add .
git commit -m "🧪 Test auto-deployment"
git push origin main

# راقب النشر في Vercel Dashboard
```

---

## 3️⃣ إعداد متقدم - GitHub Actions + Vercel

### إنشاء Workflow ملف:
```yaml
# .github/workflows/vercel-deploy.yml
name: 🚀 Vercel Auto Deploy

on:
  push:
    branches: [main]
    paths: ['frontend/**']
  pull_request:
    branches: [main]
    paths: ['frontend/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: 📦 Checkout
        uses: actions/checkout@v4

      - name: 🚀 Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
          vercel-args: ${{ github.event_name == 'push' && '--prod' || '--no-prod' }}
```

### إعداد Secrets:
```bash
# في GitHub Repository Settings > Secrets and variables > Actions

# احصل على هذه القيم من Vercel:
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id  
VERCEL_PROJECT_ID=your-project-id
```

---

## 4️⃣ إعداد Deploy Hooks

### إنشاء Deploy Hook في Vercel:
1. **Settings > Git > Deploy Hooks**
2. **اضغط "Create Hook"**
3. **اختر Branch: main**
4. **انسخ URL مثل:**
   ```
   https://api.vercel.com/v1/integrations/deploy/xxx/yyy
   ```

### استخدام Deploy Hook:
```bash
# للنشر اليدوي من أي مكان:
curl -X POST https://api.vercel.com/v1/integrations/deploy/xxx/yyy

# أو في script:
#!/bin/bash
curl -X POST "$VERCEL_DEPLOY_HOOK" \
  -H "Content-Type: application/json" \
  -d '{"ref": "main"}'
```

---

## 5️⃣ إدارة البيئات المختلفة

### Production Environment:
```bash
# Branch: main
# Environment Variables:
NEXT_PUBLIC_API_URL=https://your-production-backend.railway.app
NODE_ENV=production
```

### Preview Environment:
```bash
# Branches: feature/*, develop
# Environment Variables:
NEXT_PUBLIC_API_URL=https://your-staging-backend.railway.app
NODE_ENV=development
```

### إعداد Environment-specific Variables:
```bash
# في Vercel Settings > Environment Variables:

# Production (main branch):
NEXT_PUBLIC_API_URL = https://prod-backend.railway.app

# Preview (other branches):  
NEXT_PUBLIC_API_URL = https://staging-backend.railway.app
```

---

## 6️⃣ إشعارات النشر

### Slack Integration:
```bash
# في Vercel Settings > Integrations
# أضف Slack integration للحصول على إشعارات:

✅ Deployment Started
✅ Deployment Completed  
✅ Deployment Failed
```

### Discord Webhook:
```bash
# أو استخدم Discord webhook:
# في GitHub Repository Settings > Webhooks

Payload URL: YOUR_DISCORD_WEBHOOK_URL
Content type: application/json
Events: Deployment status
```

---

## 7️⃣ مراقبة وتتبع النشر

### Vercel Dashboard:
```bash
# راقب في:
📊 Dashboard > Deployments
📈 Analytics > Performance  
🔍 Functions > Logs
⚠️  Security > Audit Log
```

### Command Line Interface:
```bash
# تثبيت Vercel CLI:
npm i -g vercel

# تسجيل الدخول:
vercel login

# مراقبة النشر:
vercel --prod
vercel logs
vercel domains
```

---

## 8️⃣ التحكم في النشر

### إيقاف النشر التلقائي مؤقتاً:
```bash
# في Vercel Settings > Git:
☐ Auto-deploy from Git (قم بإلغاء التحديد)
```

### النشر اليدوي:
```bash
# من Vercel Dashboard:
1. اذهب إلى Deployments
2. اضغط "Redeploy" على آخر deployment
3. اختر "Use existing Build Cache" أو "Rebuild"
```

### Rollback لنسخة سابقة:
```bash
# في Deployments:
1. اختر deployment ناجح سابق
2. اضغط "⋯" > "Promote to Production"
```

---

## 🔧 استكشاف مشاكل النشر التلقائي

### النشر لا يحدث تلقائياً:
```bash
# تحقق من:
1. Git connection في Vercel Settings
2. Webhook في GitHub Settings  
3. Branch name صحيح (main)
4. No build errors
```

### Build يفشل تلقائياً:
```bash
# في Build Logs:
1. تحقق من Environment Variables
2. تأكد من dependencies في package.json
3. راجع next.config.js errors
```

### Deploy بطيء:
```bash
# تحسين الأداء:
1. تفعيل Build Cache
2. تحديد only changed files
3. تصغير dependencies
```

---

## ✅ اختبار النشر التلقائي

### اختبار سريع:
```bash
# 1. غيّر شيء بسيط:
echo "Updated: $(date)" >> frontend/public/test.txt

# 2. ادفع التغيير:  
git add .
git commit -m "🧪 Auto-deploy test - $(date)"
git push origin main

# 3. راقب في Vercel:
# سيبدأ النشر خلال 10-30 ثانية
# يكتمل خلال 1-3 دقائق
```

### علامات النجاح:
```bash
✅ GitHub shows deployment status
✅ Vercel Dashboard shows new deployment
✅ Website updates with changes
✅ No errors in build logs
```

---

## 🎉 تهانينا!

الآن تطبيقك:
- ✅ **ينشر تلقائياً** عند كل git push
- ✅ **يُختبر تلقائياً** في Pull Requests  
- ✅ **يُراقب باستمرار** للأخطاء
- ✅ **يدعم rollback** السريع

**النشر التلقائي مُفعل وجاهز! 🚀**