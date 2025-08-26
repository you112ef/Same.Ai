const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

class FileManager {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.projectPath = path.join(process.cwd(), 'projects', sessionId);
    this.systemPath = path.join(this.projectPath, '.same');
  }
  
  async ensureProjectDirectory() {
    try {
      await fs.ensureDir(this.projectPath);
      await fs.ensureDir(this.systemPath);
      return { success: true, projectPath: this.projectPath };
    } catch (error) {
      console.error('Error ensuring project directory:', error);
      throw error;
    }
  }
  
  async createProject(projectType) {
    try {
      await this.ensureProjectDirectory();
      
      switch (projectType) {
        case 'nextjs':
          return await this.createNextJSProject();
        case 'react':
          return await this.createReactProject();
        case 'vite':
          return await this.createViteProject();
        case 'vanilla':
          return await this.createVanillaProject();
        default:
          throw new Error(`نوع المشروع غير مدعوم: ${projectType}`);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }
  
  async createNextJSProject() {
    try {
      const { stdout, stderr } = await execAsync(
        `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes`,
        { cwd: this.projectPath }
      );
      
      if (stderr) {
        console.warn('Next.js creation warnings:', stderr);
      }
      
      // Create system files
      await this.createSystemFiles('nextjs');
      
      return { success: true, projectType: 'nextjs', output: stdout };
    } catch (error) {
      console.error('Error creating Next.js project:', error);
      throw error;
    }
  }
  
  async createReactProject() {
    try {
      const { stdout, stderr } = await execAsync(
        `npx create-react-app . --template typescript --yes`,
        { cwd: this.projectPath }
      );
      
      if (stderr) {
        console.warn('React creation warnings:', stderr);
      }
      
      // Create system files
      await this.createSystemFiles('react');
      
      return { success: true, projectType: 'react', output: stdout };
    } catch (error) {
      console.error('Error creating React project:', error);
      throw error;
    }
  }
  
  async createViteProject() {
    try {
      const { stdout, stderr } = await execAsync(
        `npm create vite@latest . -- --template react-ts --yes`,
        { cwd: this.projectPath }
      );
      
      if (stderr) {
        console.warn('Vite creation warnings:', stderr);
      }
      
      // Install dependencies
      await execAsync('npm install', { cwd: this.projectPath });
      
      // Create system files
      await this.createSystemFiles('vite');
      
      return { success: true, projectType: 'vite', output: stdout };
    } catch (error) {
      console.error('Error creating Vite project:', error);
      throw error;
    }
  }
  
  async createVanillaProject() {
    try {
      // Create basic HTML structure
      const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>مشروع جديد</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="app">
        <h1>مرحباً بك في مشروعك الجديد!</h1>
        <p>ابدأ في تطوير تطبيقك هنا</p>
    </div>
    <script src="script.js"></script>
</body>
</html>`;
      
      const cssContent = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

#app {
    text-align: center;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

p {
    font-size: 1.2rem;
    opacity: 0.9;
}`;
      
      const jsContent = `// ملف JavaScript الرئيسي
console.log('مرحباً بك في مشروعك الجديد!');

// يمكنك إضافة الكود الخاص بك هنا
document.addEventListener('DOMContentLoaded', () => {
    console.log('تم تحميل الصفحة بنجاح!');
});`;
      
      await fs.writeFile(path.join(this.projectPath, 'index.html'), htmlContent);
      await fs.writeFile(path.join(this.projectPath, 'styles.css'), cssContent);
      await fs.writeFile(path.join(this.projectPath, 'script.js'), jsContent);
      
      // Create system files
      await this.createSystemFiles('vanilla');
      
      return { success: true, projectType: 'vanilla' };
    } catch (error) {
      console.error('Error creating vanilla project:', error);
      throw error;
    }
  }
  
  async createSystemFiles(projectType) {
    try {
      const systemFiles = {
        'todos.md': `# مهام المشروع

## المهام المكتملة
- ✅ إنشاء المشروع (${projectType})

## المهام الجارية
- 🔄 إعداد البنية الأساسية

## المهام المستقبلية
- 📝 إضافة المكونات
- 🎨 تخصيص التصميم
- 📱 تحسين الاستجابة
- 🚀 نشر المشروع

---
*تم إنشاؤه تلقائياً بواسطة مساعد البرمجة الذكي*`,
        
        'wiki.md': `# دليل المشروع

## الوصف
مشروع ويب تم إنشاؤه بواسطة مساعد البرمجة الذكي

## التقنيات المستخدمة
- ${projectType}
- HTML/CSS/JavaScript
- TypeScript (إذا كان مدعوماً)

## الهيكل
- \`src/\` - ملفات المصدر
- \`public/\` - الملفات العامة
- \`styles/\` - ملفات التصميم
- \`components/\` - المكونات

## الأوامر المفيدة
\`\`\`bash
# تشغيل المشروع
npm run dev
# أو
npm start

# بناء المشروع
npm run build

# فحص الأخطاء
npm run lint
\`\`\`

---
*تم إنشاؤه تلقائياً بواسطة مساعد البرمجة الذكي*`,
        
        'history.md': `# سجل التغييرات

## الإصدار 1.0.0 - ${new Date().toLocaleDateString('ar-SA')}
- 🎉 إنشاء المشروع بنجاح
- 📁 إعداد البنية الأساسية
- ⚙️ تكوين النظام
- 📝 إنشاء ملفات التوثيق

---
*تم إنشاؤه تلقائياً بواسطة مساعد البرمجة الذكي*`,
        
        'logs.md': `# سجل العمليات

## ${new Date().toLocaleDateString('ar-SA')} - ${new Date().toLocaleTimeString('ar-SA')}
- ✅ تم إنشاء المشروع بنجاح
- 📁 تم إنشاء المجلدات الأساسية
- ⚙️ تم إعداد ملفات النظام
- 📝 تم إنشاء التوثيق

---
*تم إنشاؤه تلقائياً بواسطة مساعد البرمجة الذكي*`,
        
        'settings.json': JSON.stringify({
          language: 'ar',
          projectType: projectType,
          createdAt: new Date().toISOString(),
          version: '1.0.0',
          lastModified: new Date().toISOString()
        }, null, 2)
      };
      
      for (const [filename, content] of Object.entries(systemFiles)) {
        await fs.writeFile(path.join(this.systemPath, filename), content, 'utf8');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error creating system files:', error);
      throw error;
    }
  }
  
  async readFile(filePath) {
    try {
      const fullPath = path.join(this.projectPath, filePath);
      
      if (!await fs.pathExists(fullPath)) {
        throw new Error(`الملف غير موجود: ${filePath}`);
      }
      
      const content = await fs.readFile(fullPath, 'utf8');
      const stats = await fs.stat(fullPath);
      
      return {
        success: true,
        content,
        filePath,
        size: stats.size,
        modified: stats.mtime,
        isDirectory: stats.isDirectory()
      };
    } catch (error) {
      console.error('Error reading file:', error);
      throw error;
    }
  }
  
  async editFile(filePath, content, options = {}) {
    try {
      const fullPath = path.join(this.projectPath, filePath);
      
      // Ensure directory exists
      await fs.ensureDir(path.dirname(fullPath));
      
      let newContent;
      
      if (options.replace) {
        // استبدال كامل
        newContent = content;
      } else if (options.insertAt) {
        // إدراج في موضع محدد
        let currentContent = '';
        if (await fs.pathExists(fullPath)) {
          currentContent = await fs.readFile(fullPath, 'utf8');
        }
        
        const lines = currentContent.split('\n');
        lines.splice(options.insertAt.line, 0, ...content.split('\n'));
        newContent = lines.join('\n');
      } else if (options.append) {
        // إضافة في النهاية
        let currentContent = '';
        if (await fs.pathExists(fullPath)) {
          currentContent = await fs.readFile(fullPath, 'utf8');
        }
        newContent = currentContent + '\n' + content;
      } else {
        // استبدال كامل (افتراضي)
        newContent = content;
      }
      
      // Write file
      await fs.writeFile(fullPath, newContent, 'utf8');
      
      // Update history
      await this.updateHistory(filePath, 'edit', content);
      
      return {
        success: true,
        filePath,
        content: newContent,
        size: newContent.length
      };
    } catch (error) {
      console.error('Error editing file:', error);
      throw error;
    }
  }
  
  async runCommand(command, options = {}) {
    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: this.projectPath,
        timeout: options.timeout || 30000
      });
      
      // Update logs
      await this.updateLogs(command, stdout, stderr);
      
      return { success: true, stdout, stderr };
    } catch (error) {
      console.error('Error running command:', error);
      await this.updateLogs(command, '', error.message);
      throw error;
    }
  }
  
  async getProjectStructure() {
    try {
      const structure = await this.scanDirectory(this.projectPath);
      return { success: true, structure };
    } catch (error) {
      console.error('Error scanning project structure:', error);
      throw error;
    }
  }
  
  async scanDirectory(dirPath, relativePath = '') {
    try {
      const items = await fs.readdir(dirPath);
      const structure = [];
      
      for (const item of items) {
        if (item === '.same' || item === 'node_modules') continue;
        
        const fullPath = path.join(dirPath, item);
        const itemRelativePath = path.join(relativePath, item);
        const stats = await fs.stat(fullPath);
        
        if (stats.isDirectory()) {
          const children = await this.scanDirectory(fullPath, itemRelativePath);
          structure.push({
            type: 'directory',
            name: item,
            path: itemRelativePath,
            children
          });
        } else {
          structure.push({
            type: 'file',
            name: item,
            path: itemRelativePath,
            size: stats.size,
            modified: stats.mtime
          });
        }
      }
      
      return structure;
    } catch (error) {
      console.error('Error scanning directory:', error);
      return [];
    }
  }
  
  async updateHistory(filePath, action, content) {
    try {
      const historyFile = path.join(this.systemPath, 'history.md');
      const timestamp = new Date().toLocaleString('ar-SA');
      
      let history = '';
      try {
        history = await fs.readFile(historyFile, 'utf8');
      } catch (error) {
        history = '# سجل التغييرات\n\n';
      }
      
      const entry = `\n## ${action} - ${timestamp}\n- الملف: \`${filePath}\`\n- الإجراء: ${action}\n- المحتوى: ${content.substring(0, 100)}${content.length > 100 ? '...' : ''}\n`;
      history += entry;
      
      await fs.writeFile(historyFile, history, 'utf8');
    } catch (error) {
      console.error('Error updating history:', error);
    }
  }
  
  async updateLogs(command, stdout, stderr) {
    try {
      const logsFile = path.join(this.systemPath, 'logs.md');
      const timestamp = new Date().toLocaleString('ar-SA');
      
      let logs = '';
      try {
        logs = await fs.readFile(logsFile, 'utf8');
      } catch (error) {
        logs = '# سجل العمليات\n\n';
      }
      
      const entry = `\n## ${timestamp}\n- الأمر: \`${command}\`\n- النتيجة: ${stdout}\n- الأخطاء: ${stderr}\n`;
      logs += entry;
      
      await fs.writeFile(logsFile, logs, 'utf8');
    } catch (error) {
      console.error('Error updating logs:', error);
    }
  }
  
  async cleanupProject() {
    try {
      if (await fs.pathExists(this.projectPath)) {
        await fs.remove(this.projectPath);
        console.log(`Cleaned up project: ${this.sessionId}`);
      }
    } catch (error) {
      console.error('Error cleaning up project:', error);
    }
  }
}

module.exports = FileManager;