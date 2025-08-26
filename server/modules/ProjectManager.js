const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const winston = require('winston');

const execAsync = promisify(exec);

class ProjectManager {
  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.simple(),
      transports: [new winston.transports.Console()]
    });

    // أنواع المشاريع المدعومة
    this.projectTypes = {
      'nextjs': {
        command: 'bun create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes',
        description: 'Next.js with TypeScript, Tailwind CSS, and App Router',
        dependencies: ['@types/node', '@types/react', '@types/react-dom'],
        devDependencies: ['eslint', 'eslint-config-next', 'prettier']
      },
      'react': {
        command: 'bun create vite@latest . --template react-ts --yes',
        description: 'React with TypeScript and Vite',
        dependencies: ['react', 'react-dom'],
        devDependencies: ['@types/react', '@types/react-dom', '@vitejs/plugin-react']
      },
      'vue': {
        command: 'bun create vue@latest . --typescript --router --pinia --eslint --yes',
        description: 'Vue 3 with TypeScript, Router, and Pinia',
        dependencies: ['vue', 'vue-router', 'pinia'],
        devDependencies: ['@vitejs/plugin-vue', 'eslint', 'typescript']
      },
      'svelte': {
        command: 'bun create svelte@latest . --typescript --eslint --prettier --yes',
        description: 'Svelte with TypeScript and ESLint',
        dependencies: ['svelte'],
        devDependencies: ['@sveltejs/kit', 'typescript', 'eslint']
      },
      'vanilla': {
        command: 'bun create vite@latest . --template vanilla-ts --yes',
        description: 'Vanilla TypeScript with Vite',
        dependencies: [],
        devDependencies: ['typescript', 'vite']
      }
    };
  }

  async initializeProject(projectPath, projectType = 'nextjs') {
    try {
      this.logger.info(`Initializing ${projectType} project at ${projectPath}`);

      // التأكد من وجود المجلد
      await fs.ensureDir(projectPath);

      // تغيير إلى مجلد المشروع
      process.chdir(projectPath);

      // إنشاء المشروع
      const projectConfig = this.projectTypes[projectType];
      if (!projectConfig) {
        throw new Error(`Unsupported project type: ${projectType}`);
      }

      // تنفيذ أمر إنشاء المشروع
      await this.executeCommand(projectConfig.command);

      // تثبيت التبعيات الإضافية
      await this.installAdditionalDependencies(projectConfig);

      // إنشاء ملفات النظام
      await this.createSystemFiles(projectPath);

      // تخصيص المشروع
      await this.customizeProject(projectPath, projectType);

      this.logger.info(`Project ${projectType} initialized successfully`);
      
      return {
        success: true,
        projectType,
        projectPath,
        description: projectConfig.description
      };
    } catch (error) {
      this.logger.error('Error initializing project:', error);
      throw error;
    }
  }

  async executeCommand(command) {
    try {
      this.logger.info(`Executing command: ${command}`);
      
      const { stdout, stderr } = await execAsync(command, {
        timeout: 300000, // 5 minutes timeout
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
      });

      if (stderr) {
        this.logger.warn(`Command stderr: ${stderr}`);
      }

      this.logger.info(`Command completed successfully`);
      return { stdout, stderr };
    } catch (error) {
      this.logger.error(`Command failed: ${error.message}`);
      throw error;
    }
  }

  async installAdditionalDependencies(projectConfig) {
    try {
      // تثبيت التبعيات الإضافية إذا كانت موجودة
      if (projectConfig.dependencies && projectConfig.dependencies.length > 0) {
        const depsCommand = `bun add ${projectConfig.dependencies.join(' ')}`;
        await this.executeCommand(depsCommand);
      }

      if (projectConfig.devDependencies && projectConfig.devDependencies.length > 0) {
        const devDepsCommand = `bun add -d ${projectConfig.devDependencies.join(' ')}`;
        await this.executeCommand(devDepsCommand);
      }
    } catch (error) {
      this.logger.warn('Error installing additional dependencies:', error);
      // لا نريد أن نفشل المشروع بسبب التبعيات الإضافية
    }
  }

  async createSystemFiles(projectPath) {
    try {
      // إنشاء مجلد .same
      const sameDir = path.join(projectPath, '.same');
      await fs.ensureDir(sameDir);

      // إنشاء ملفات النظام
      const systemFiles = {
        'todos.md': this.generateTodosContent(),
        'wiki.md': this.generateWikiContent(),
        'history.md': this.generateHistoryContent(),
        'logs.md': this.generateLogsContent(),
        'settings.json': this.generateSettingsContent()
      };

      for (const [filename, content] of Object.entries(systemFiles)) {
        await fs.writeFile(path.join(sameDir, filename), content, 'utf8');
      }

      this.logger.info('System files created successfully');
    } catch (error) {
      this.logger.error('Error creating system files:', error);
      throw error;
    }
  }

  generateTodosContent() {
    return `# مهام المشروع

## المهام المنجزة
- [x] إنشاء المشروع
- [x] تهيئة البيئة الأساسية

## المهام المعلقة
- [ ] إضافة المكونات الأساسية
- [ ] تخصيص التصميم
- [ ] إضافة الصفحات المطلوبة
- [ ] اختبار التطبيق

## ملاحظات
- تم إنشاء المشروع بنجاح
- جاهز للبدء في التطوير

---
*آخر تحديث: ${new Date().toLocaleString('ar-SA')}*
`;
  }

  generateWikiContent() {
    return `# دليل المشروع

## معلومات المشروع
- **نوع المشروع:** [سيتم تحديده تلقائياً]
- **تاريخ الإنشاء:** ${new Date().toLocaleString('ar-SA')}
- **الحالة:** قيد التطوير

## التعليمات
### تشغيل المشروع
\`\`\`bash
bun dev
\`\`\`

### بناء المشروع
\`\`\`bash
bun build
\`\`\`

### فحص الكود
\`\`\`bash
bun lint
\`\`\`

## هيكل المشروع
- \`src/\` - كود المصدر
- \`public/\` - الملفات العامة
- \`.same/\` - ملفات النظام

---
*تم إنشاؤه تلقائياً بواسطة AI Coding Assistant*
`;
  }

  generateHistoryContent() {
    return `# سجل التعديلات

## ${new Date().toLocaleString('ar-SA')}
- **إجراء:** إنشاء المشروع
- **الوصف:** تم إنشاء مشروع جديد بنجاح
- **الحالة:** مكتمل

---
*سجل التعديلات سيتم تحديثه تلقائياً*
`;
  }

  generateLogsContent() {
    return `# سجل التنفيذ

## ${new Date().toLocaleString('ar-SA')}
- **إجراء:** تهيئة المشروع
- **الحالة:** نجح
- **الوقت:** ${new Date().toISOString()}

---
*سجل التنفيذ سيتم تحديثه تلقائياً*
`;
  }

  generateSettingsContent() {
    return JSON.stringify({
      language: 'ar',
      projectType: 'nextjs',
      integrations: {},
      preferences: {
        theme: 'light',
        autoSave: true,
        livePreview: true
      },
      createdAt: new Date().toISOString()
    }, null, 2);
  }

  async customizeProject(projectPath, projectType) {
    try {
      switch (projectType) {
        case 'nextjs':
          await this.customizeNextJS(projectPath);
          break;
        case 'react':
          await this.customizeReact(projectPath);
          break;
        case 'vue':
          await this.customizeVue(projectPath);
          break;
        case 'svelte':
          await this.customizeSvelte(projectPath);
          break;
        case 'vanilla':
          await this.customizeVanilla(projectPath);
          break;
      }
    } catch (error) {
      this.logger.warn('Error customizing project:', error);
    }
  }

  async customizeNextJS(projectPath) {
    try {
      // تخصيص ملف layout.tsx
      const layoutPath = path.join(projectPath, 'src/app/layout.tsx');
      if (await fs.pathExists(layoutPath)) {
        const layoutContent = `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'تطبيقي الجديد',
  description: 'تم إنشاؤه بواسطة AI Coding Assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>{children}</body>
    </html>
  )
}`;
        await fs.writeFile(layoutPath, layoutContent, 'utf8');
      }

      // تخصيص الصفحة الرئيسية
      const pagePath = path.join(projectPath, 'src/app/page.tsx');
      if (await fs.pathExists(pagePath)) {
        const pageContent = `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          مرحباً بك في تطبيقك الجديد! 🚀
        </h1>
        <p className="text-center text-lg">
          تم إنشاء هذا المشروع بواسطة AI Coding Assistant
        </p>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            ابدأ في تطوير تطبيقك الآن!
          </p>
        </div>
      </div>
    </main>
  )
}`;
        await fs.writeFile(pagePath, pageContent, 'utf8');
      }
    } catch (error) {
      this.logger.error('Error customizing Next.js project:', error);
    }
  }

  async customizeReact(projectPath) {
    try {
      // تخصيص App.tsx
      const appPath = path.join(projectPath, 'src/App.tsx');
      if (await fs.pathExists(appPath)) {
        const appContent = `import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>مرحباً بك في تطبيقك الجديد! 🚀</h1>
        <p>تم إنشاء هذا المشروع بواسطة AI Coding Assistant</p>
        <p>ابدأ في تطوير تطبيقك الآن!</p>
      </header>
    </div>
  )
}

export default App`;
        await fs.writeFile(appPath, appContent, 'utf8');
      }
    } catch (error) {
      this.logger.error('Error customizing React project:', error);
    }
  }

  async customizeVue(projectPath) {
    try {
      // تخصيص App.vue
      const appPath = path.join(projectPath, 'src/App.vue');
      if (await fs.pathExists(appPath)) {
        const appContent = `<template>
  <div id="app">
    <header>
      <h1>مرحباً بك في تطبيقك الجديد! 🚀</h1>
      <p>تم إنشاء هذا المشروع بواسطة AI Coding Assistant</p>
      <p>ابدأ في تطوير تطبيقك الآن!</p>
    </header>
  </div>
</template>

<script setup lang="ts">
// Vue 3 Composition API
</script>

<style>
#app {
  text-align: center;
  padding: 2rem;
}
</style>`;
        await fs.writeFile(appPath, appContent, 'utf8');
      }
    } catch (error) {
      this.logger.error('Error customizing Vue project:', error);
    }
  }

  async customizeSvelte(projectPath) {
    try {
      // تخصيص App.svelte
      const appPath = path.join(projectPath, 'src/App.svelte');
      if (await fs.pathExists(appPath)) {
        const appContent = `<main>
  <h1>مرحباً بك في تطبيقك الجديد! 🚀</h1>
  <p>تم إنشاء هذا المشروع بواسطة AI Coding Assistant</p>
  <p>ابدأ في تطوير تطبيقك الآن!</p>
</main>

<style>
  main {
    text-align: center;
    padding: 2rem;
  }
</style>`;
        await fs.writeFile(appPath, appContent, 'utf8');
      }
    } catch (error) {
      this.logger.error('Error customizing Svelte project:', error);
    }
  }

  async customizeVanilla(projectPath) {
    try {
      // تخصيص index.html
      const htmlPath = path.join(projectPath, 'index.html');
      if (await fs.pathExists(htmlPath)) {
        const htmlContent = `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>تطبيقي الجديد</title>
  </head>
  <body>
    <div id="app">
      <h1>مرحباً بك في تطبيقك الجديد! 🚀</h1>
      <p>تم إنشاء هذا المشروع بواسطة AI Coding Assistant</p>
      <p>ابدأ في تطوير تطبيقك الآن!</p>
    </div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>`;
        await fs.writeFile(htmlPath, htmlContent, 'utf8');
      }
    } catch (error) {
      this.logger.error('Error customizing Vanilla project:', error);
    }
  }

  async getProjectInfo(projectPath) {
    try {
      const packageJsonPath = path.join(projectPath, 'package.json');
      
      if (!await fs.pathExists(packageJsonPath)) {
        return null;
      }

      const packageJson = await fs.readJson(packageJsonPath);
      const settingsPath = path.join(projectPath, '.same', 'settings.json');
      
      let settings = {};
      if (await fs.pathExists(settingsPath)) {
        settings = await fs.readJson(settingsPath);
      }

      return {
        name: packageJson.name,
        version: packageJson.version,
        description: packageJson.description,
        dependencies: packageJson.dependencies || {},
        devDependencies: packageJson.devDependencies || {},
        scripts: packageJson.scripts || {},
        settings
      };
    } catch (error) {
      this.logger.error('Error getting project info:', error);
      return null;
    }
  }

  async updateProjectSettings(projectPath, newSettings) {
    try {
      const settingsPath = path.join(projectPath, '.same', 'settings.json');
      
      let currentSettings = {};
      if (await fs.pathExists(settingsPath)) {
        currentSettings = await fs.readJson(settingsPath);
      }

      const updatedSettings = {
        ...currentSettings,
        ...newSettings,
        lastUpdated: new Date().toISOString()
      };

      await fs.writeJson(settingsPath, updatedSettings, { spaces: 2 });
      
      this.logger.info('Project settings updated successfully');
      return updatedSettings;
    } catch (error) {
      this.logger.error('Error updating project settings:', error);
      throw error;
    }
  }

  async getSupportedProjectTypes() {
    return Object.keys(this.projectTypes).map(type => ({
      type,
      description: this.projectTypes[type].description
    }));
  }
}

module.exports = ProjectManager;