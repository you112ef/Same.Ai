const OpenAI = require('openai');
const axios = require('axios');
const path = require('path');
const fs = require('fs-extra');
const winston = require('winston');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.simple(),
      transports: [new winston.transports.Console()]
    });

    // Supported project types and their startup commands
    this.projectTypes = {
      'nextjs': {
        command: 'bun create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes',
        description: 'Next.js with TypeScript, Tailwind CSS, and App Router'
      },
      'react': {
        command: 'bun create vite@latest . --template react-ts --yes',
        description: 'React with TypeScript and Vite'
      },
      'vue': {
        command: 'bun create vue@latest . --typescript --router --pinia --eslint --yes',
        description: 'Vue 3 with TypeScript, Router, and Pinia'
      },
      'svelte': {
        command: 'bun create svelte@latest . --typescript --eslint --prettier --yes',
        description: 'Svelte with TypeScript and ESLint'
      },
      'vanilla': {
        command: 'bun create vite@latest . --template vanilla-ts --yes',
        description: 'Vanilla TypeScript with Vite'
      }
    };

    // Common actions and their patterns
    this.actionPatterns = {
      startup: [
        'أنشئ مشروع', 'create project', 'start project', 'new project',
        'مشروع جديد', 'بدء مشروع', 'إنشاء تطبيق'
      ],
      edit_file: [
        'عدل', 'edit', 'change', 'modify', 'update', 'تعديل', 'تغيير',
        'أضف', 'add', 'insert', 'إضافة', 'أدرج'
      ],
      read_file: [
        'اقرأ', 'read', 'show', 'display', 'عرض', 'إظهار', 'محتوى',
        'content', 'file content', 'محتويات الملف'
      ],
      run_linter: [
        'فحص', 'check', 'lint', 'validate', 'تصحيح', 'مراجعة',
        'errors', 'أخطاء', 'مشاكل', 'problems'
      ],
      bash: [
        'شغل', 'run', 'execute', 'install', 'تثبيت', 'تشغيل',
        'command', 'أمر', 'terminal', 'طرفية'
      ],
      web_search: [
        'ابحث', 'search', 'find', 'lookup', 'بحث', 'إيجاد',
        'images', 'صور', 'معلومات', 'information'
      ],
      version_save: [
        'احفظ', 'save', 'version', 'snapshot', 'حفظ', 'نسخة',
        'backup', 'نسخة احتياطية', 'إصدار'
      ]
    };
  }

  async analyzeMessage(message, language = 'ar') {
    try {
      const systemPrompt = this.getSystemPrompt(language);
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      const analysis = JSON.parse(response.choices[0].message.content);
      
      this.logger.info(`Message analyzed: ${message.substring(0, 50)}...`);
      this.logger.info(`Actions determined: ${analysis.actions.length}`);
      
      return analysis;
    } catch (error) {
      this.logger.error('Error analyzing message:', error);
      throw new Error('Failed to analyze message');
    }
  }

  getSystemPrompt(language) {
    const isArabic = language === 'ar';
    
    return `You are an AI coding assistant that analyzes user messages and determines what actions to take.

${isArabic ? 'تحليل الرسالة وتحديد الإجراءات المطلوبة:' : 'Analyze the message and determine required actions:'}

1. ${isArabic ? 'تحديد نوع المشروع المطلوب' : 'Determine project type needed'}
2. ${isArabic ? 'تحديد الإجراءات المطلوبة' : 'Determine required actions'}
3. ${isArabic ? 'تحديد الملفات المراد تعديلها' : 'Determine files to modify'}
4. ${isArabic ? 'تحديد الأوامر المراد تنفيذها' : 'Determine commands to execute'}

${isArabic ? 'أنواع المشاريع المدعومة:' : 'Supported project types:'} ${Object.keys(this.projectTypes).join(', ')}

${isArabic ? 'أنواع الإجراءات:' : 'Action types:'} startup, edit_file, read_file, run_linter, bash, web_search, version_save

${isArabic ? 'أرجع النتيجة بصيغة JSON:' : 'Return result as JSON:'}
{
  "projectType": "nextjs|react|vue|svelte|vanilla",
  "actions": [
    {
      "type": "action_type",
      "params": {
        "file": "file_path",
        "content": "new_content",
        "command": "bash_command",
        "query": "search_query"
      },
      "description": "action_description"
    }
  ],
  "language": "${language}",
  "confidence": 0.95
}`;
  }

  async generateResponse(originalMessage, results, language = 'ar') {
    try {
      const isArabic = language === 'ar';
      const systemPrompt = isArabic ? 
        'أنت مساعد برمجة ذكي. اكتب ردًا مفيدًا ومفصلًا باللغة العربية. اشرح ما تم تنفيذه واقترح الخطوات التالية.' :
        'You are a smart coding assistant. Write a helpful and detailed response in English. Explain what was executed and suggest next steps.';

      const resultsSummary = results.map(result => {
        if (result.success) {
          return `${result.action.type}: ${result.action.description} - Success`;
        } else {
          return `${result.action.type}: ${result.action.description} - Failed: ${result.error}`;
        }
      }).join('\n');

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Original message: ${originalMessage}\n\nExecuted actions:\n${resultsSummary}\n\nGenerate a helpful response.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const content = response.choices[0].message.content;
      
      return {
        content,
        actions: results,
        suggestions: await this.generateSuggestions(results, language),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Error generating response:', error);
      return {
        content: language === 'ar' ? 'حدث خطأ في معالجة الرسالة' : 'Error processing message',
        actions: results,
        suggestions: [],
        timestamp: new Date().toISOString()
      };
    }
  }

  async generateSuggestions(results, language = 'ar') {
    const isArabic = language === 'ar';
    const suggestions = [];

    // Analyze results and generate contextual suggestions
    const successfulActions = results.filter(r => r.success);
    const failedActions = results.filter(r => !r.success);

    if (successfulActions.length > 0) {
      const lastAction = successfulActions[successfulActions.length - 1];
      
      switch (lastAction.action.type) {
        case 'startup':
          suggestions.push(
            isArabic ? 'إضافة مكونات واجهة المستخدم' : 'Add UI components',
            isArabic ? 'تخصيص التصميم والألوان' : 'Customize design and colors',
            isArabic ? 'إضافة صفحات جديدة' : 'Add new pages'
          );
          break;
        case 'edit_file':
          suggestions.push(
            isArabic ? 'فحص الكود للأخطاء' : 'Check code for errors',
            isArabic ? 'إضافة المزيد من الميزات' : 'Add more features',
            isArabic ? 'تحسين الأداء' : 'Optimize performance'
          );
          break;
        case 'run_linter':
          if (failedActions.length > 0) {
            suggestions.push(
              isArabic ? 'إصلاح الأخطاء المكتشفة' : 'Fix detected errors',
              isArabic ? 'تحسين جودة الكود' : 'Improve code quality'
            );
          } else {
            suggestions.push(
              isArabic ? 'إضافة اختبارات' : 'Add tests',
              isArabic ? 'تحسين التوثيق' : 'Improve documentation'
            );
          }
          break;
      }
    }

    if (failedActions.length > 0) {
      suggestions.push(
        isArabic ? 'إعادة محاولة تنفيذ الإجراءات الفاشلة' : 'Retry failed actions',
        isArabic ? 'طلب المساعدة من الدعم' : 'Request support help'
      );
    }

    return suggestions;
  }

  async webSearch(query) {
    try {
      // Use a search API (you can replace with your preferred search service)
      const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`;
      
      const response = await axios.get(searchUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'AI-Coding-Assistant/1.0'
        }
      });

      return {
        query,
        results: response.data.AbstractText || 'No results found',
        source: 'DuckDuckGo',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Web search error:', error);
      return {
        query,
        results: 'Search failed',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async detectLanguage(text) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Detect the language of the following text. Return only 'ar' for Arabic or 'en' for English."
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0,
        max_tokens: 10
      });

      const language = response.choices[0].message.content.trim().toLowerCase();
      return language === 'ar' ? 'ar' : 'en';
    } catch (error) {
      this.logger.error('Language detection error:', error);
      return 'en'; // Default to English
    }
  }

  async validateCode(code, language = 'javascript') {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a code validator. Check the following ${language} code for syntax errors, best practices, and potential issues. Return a JSON object with validation results.`
          },
          {
            role: "user",
            content: code
          }
        ],
        temperature: 0.1,
        max_tokens: 500
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      this.logger.error('Code validation error:', error);
      return {
        valid: false,
        errors: ['Validation failed'],
        suggestions: []
      };
    }
  }

  async suggestImprovements(code, context, language = 'ar') {
    try {
      const isArabic = language === 'ar';
      const systemPrompt = isArabic ?
        'اقترح تحسينات للكود التالي. ركز على الأداء، قابلية القراءة، وأفضل الممارسات.' :
        'Suggest improvements for the following code. Focus on performance, readability, and best practices.';

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Context: ${context}\n\nCode:\n${code}`
          }
        ],
        temperature: 0.5,
        max_tokens: 800
      });

      return response.choices[0].message.content;
    } catch (error) {
      this.logger.error('Improvement suggestion error:', error);
      return language === 'ar' ? 'فشل في اقتراح التحسينات' : 'Failed to suggest improvements';
    }
  }

  getProjectTypeFromMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    for (const [type, config] of Object.entries(this.projectTypes)) {
      const keywords = type === 'nextjs' ? ['next', 'nextjs', 'next.js'] :
                      type === 'react' ? ['react'] :
                      type === 'vue' ? ['vue'] :
                      type === 'svelte' ? ['svelte'] :
                      type === 'vanilla' ? ['vanilla', 'html', 'css', 'javascript'] : [];
      
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return type;
      }
    }
    
    return 'nextjs'; // Default
  }

  extractFilePaths(message) {
    const filePattern = /[\w\-./]+\.(js|jsx|ts|tsx|css|html|json|md|txt)/g;
    return message.match(filePattern) || [];
  }

  extractCommands(message) {
    const commandPattern = /(npm|bun|yarn|git|ls|cd|mkdir|rm|cp|mv)\s+[\w\-./\s]+/g;
    return message.match(commandPattern) || [];
  }
}

module.exports = AIService;