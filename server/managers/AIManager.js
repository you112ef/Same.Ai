const { OpenAI } = require('openai');

class AIManager {
  constructor(session) {
    this.session = session;
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    // System prompts based on language
    this.systemPrompts = {
      ar: `أنت مساعد برمجة ذكي متخصص في تطوير تطبيقات الويب. 
      مهمتك هي مساعدة المستخدمين في إنشاء وتطوير مشاريع ويب حديثة.
      
      يجب عليك:
      - الرد دائماً باللغة العربية
      - فهم طلبات المستخدم وتحليلها بدقة
      - اقتراح أفضل التقنيات وأطر العمل
      - تقديم حلول عملية وقابلة للتنفيذ
      - شرح الخطوات بوضوح
      - اقتراح التحسينات والتطويرات المستقبلية
      
      أنواع المشاريع المدعومة:
      - Next.js (React + TypeScript + Tailwind)
      - React (TypeScript)
      - Vite (React + TypeScript)
      - Vanilla (HTML + CSS + JavaScript)
      
      عند معالجة الطلبات، قم بتحديد:
      1. نوع الإجراء المطلوب (create_project, edit_file, run_command, create_snapshot)
      2. المعاملات المطلوبة
      3. رسالة واضحة للمستخدم
      4. اقتراحات للخطوات التالية`,
      
      en: `You are an intelligent coding assistant specialized in web development.
      Your task is to help users create and develop modern web applications.
      
      You must:
      - Always respond in English
      - Understand and analyze user requests accurately
      - Suggest the best technologies and frameworks
      - Provide practical and implementable solutions
      - Explain steps clearly
      - Suggest improvements and future developments
      
      Supported project types:
      - Next.js (React + TypeScript + Tailwind)
      - React (TypeScript)
      - Vite (React + TypeScript)
      - Vanilla (HTML + CSS + JavaScript)
      
      When processing requests, determine:
      1. Required action type (create_project, edit_file, run_command, create_snapshot)
      2. Required parameters
      3. Clear message for the user
      4. Suggestions for next steps`
    };
  }
  
  async processMessage(message) {
    try {
      // Detect language
      const language = this.detectLanguage(message);
      this.session.language = language;
      
      // Get system prompt
      const systemPrompt = this.systemPrompts[language];
      
      // Create conversation context
      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ];
      
      // Add session context if available
      if (this.session.history && this.session.history.length > 0) {
        const recentHistory = this.session.history.slice(-5); // Last 5 messages
        messages.unshift(...recentHistory);
      }
      
      // Call OpenAI API
      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7
      });
  
      const aiResponse = completion.choices[0].message.content;
      
      // Parse response for actions
      const actions = this.parseActions(aiResponse, language);
      
      // Update session history
      this.updateSessionHistory(message, aiResponse);
      
      return {
        message: aiResponse,
        actions: actions,
        language: language
      };
      
    } catch (error) {
      console.error('Error processing message with AI:', error);
      
      // Fallback response
      const fallbackResponse = this.session.language === 'ar' 
        ? 'عذراً، حدث خطأ في معالجة رسالتك. يرجى المحاولة مرة أخرى.'
        : 'Sorry, an error occurred while processing your message. Please try again.';
      
      return {
        message: fallbackResponse,
        actions: [],
        language: this.session.language || 'ar'
      };
    }
  }
  
  detectLanguage(text) {
    // Simple language detection based on Arabic characters
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return arabicRegex.test(text) ? 'ar' : 'en';
  }
  
  parseActions(response, language) {
    const actions = [];
    
    try {
      // Look for action patterns in the response
      if (response.includes('create_project') || response.includes('إنشاء مشروع')) {
        const projectType = this.extractProjectType(response, language);
        actions.push({
          type: 'create_project',
          params: { projectType: projectType || 'nextjs' }
        });
      }
      
      if (response.includes('edit_file') || response.includes('تعديل ملف')) {
        const fileInfo = this.extractFileInfo(response, language);
        if (fileInfo) {
          actions.push({
            type: 'edit_file',
            params: fileInfo
          });
        }
      }
      
      if (response.includes('run_command') || response.includes('تنفيذ أمر')) {
        const command = this.extractCommand(response, language);
        if (command) {
          actions.push({
            type: 'run_command',
            params: { command }
          });
        }
      }
      
      if (response.includes('create_snapshot') || response.includes('إنشاء نسخة')) {
        const description = this.extractSnapshotDescription(response, language);
        actions.push({
          type: 'create_snapshot',
          params: { description: description || 'نسخة تلقائية' }
        });
      }
      
    } catch (error) {
      console.error('Error parsing actions:', error);
    }
    
    return actions;
  }
  
  extractProjectType(response, language) {
    const projectTypes = ['nextjs', 'react', 'vite', 'vanilla'];
    
    for (const type of projectTypes) {
      if (response.toLowerCase().includes(type)) {
        return type;
      }
    }
    
    // Default based on language
    return language === 'ar' ? 'nextjs' : 'nextjs';
  }
  
  extractFileInfo(response, language) {
    // Extract file path and content from response
    const fileMatch = response.match(/```(\w+):([^\n]+)\n([\s\S]*?)```/);
    
    if (fileMatch) {
      return {
        filePath: fileMatch[2],
        content: fileMatch[3],
        options: { replace: true }
      };
    }
    
    return null;
  }
  
  extractCommand(response, language) {
    // Extract command from response
    const commandMatch = response.match(/```bash\n([^\n]+)\n```/);
    return commandMatch ? commandMatch[1] : null;
  }
  
  extractSnapshotDescription(response, language) {
    // Extract snapshot description from response
    if (language === 'ar') {
      const match = response.match(/نسخة[:\s]+([^.\n]+)/);
      return match ? match[1].trim() : null;
    } else {
      const match = response.match(/snapshot[:\s]+([^.\n]+)/i);
      return match ? match[1].trim() : null;
    }
  }
  
  updateSessionHistory(userMessage, aiResponse) {
    if (!this.session.history) {
      this.session.history = [];
    }
    
    // Add user message
    this.session.history.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    });
    
    // Add AI response
    this.session.history.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 20 messages
    if (this.session.history.length > 20) {
      this.session.history = this.session.history.slice(-20);
    }
  }
  
  async generateCodeSuggestion(context, language) {
    try {
      const prompt = language === 'ar' 
        ? `بناءً على السياق التالي، اقترح تحسينات أو إضافات للكود:
        
        ${context}
        
        قدم اقتراحات عملية وقابلة للتنفيذ.`
        : `Based on the following context, suggest code improvements or additions:
        
        ${context}
        
        Provide practical and implementable suggestions.`;
      
      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          { role: 'system', content: this.systemPrompts[language] },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.5
      });
      
      return completion.choices[0].message.content;
      
    } catch (error) {
      console.error('Error generating code suggestion:', error);
      return null;
    }
  }
  
  async analyzeCode(code, language) {
    try {
      const prompt = language === 'ar'
        ? `حلل الكود التالي وقدم اقتراحات للتحسين:
        
        \`\`\`
        ${code}
        \`\`\`
        
        ابحث عن:
        - الأخطاء المحتملة
        - طرق التحسين
        - أفضل الممارسات
        - اقتراحات للأمان`
        : `Analyze the following code and provide improvement suggestions:
        
        \`\`\`
        ${code}
        \`\`\`
        
        Look for:
        - Potential errors
        - Optimization opportunities
        - Best practices
        - Security suggestions`;
      
      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          { role: 'system', content: this.systemPrompts[language] },
          { role: 'user', content: prompt }
        ],
        max_tokens: 800,
        temperature: 0.3
      });
      
      return completion.choices[0].message.content;
      
    } catch (error) {
      console.error('Error analyzing code:', error);
      return null;
    }
  }
  
  async generateNextSteps(projectContext, language) {
    try {
      const prompt = language === 'ar'
        ? `بناءً على حالة المشروع الحالية، اقترح الخطوات التالية:
        
        ${projectContext}
        
        اقترح:
        - المهام العاجلة
        - التحسينات الممكنة
        - الميزات الجديدة
        - خطوات النشر`
        : `Based on the current project state, suggest next steps:
        
        ${projectContext}
        
        Suggest:
        - Urgent tasks
        - Possible improvements
        - New features
        - Deployment steps`;
      
      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          { role: 'system', content: this.systemPrompts[language] },
          { role: 'user', content: prompt }
        ],
        max_tokens: 600,
        temperature: 0.6
      });
      
      return completion.choices[0].message.content;
      
    } catch (error) {
      console.error('Error generating next steps:', error);
      return null;
    }
  }
}

module.exports = AIManager;