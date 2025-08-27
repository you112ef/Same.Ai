const OpenAI = require('openai');
const path = require('path');
const fs = require('fs-extra');

class AIManager {
  constructor(session) {
    this.session = session;
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    this.conversationHistory = [];
    this.maxHistoryLength = 50;
    this.systemPrompt = this.getSystemPrompt();
  }

  /**
   * Get system prompt based on project type and language
   */
  getSystemPrompt() {
    const { language = 'en', projectType = 'react' } = this.session;
    
    const languagePrompts = {
      ar: 'أنت مساعد برمجة ذكي متخصص في تطوير تطبيقات الويب. استجب باللغة العربية.',
      en: 'You are an intelligent coding assistant specialized in web development. Respond in English.',
      fr: 'Vous êtes un assistant de programmation intelligent spécialisé dans le développement web. Répondez en français.',
      es: 'Eres un asistente de programación inteligente especializado en desarrollo web. Responde en español.',
      de: 'Sie sind ein intelligenter Programmierassistent, der auf Webentwicklung spezialisiert ist. Antworten Sie auf Deutsch.'
    };

    const projectPrompts = {
      nextjs: 'You are an expert in Next.js development with TypeScript, React, and modern web technologies.',
      react: 'You are an expert in React development with TypeScript and modern web technologies.',
      vue: 'You are an expert in Vue.js development with TypeScript and modern web technologies.',
      angular: 'You are an expert in Angular development with TypeScript and modern web technologies.',
      vanilla: 'You are an expert in vanilla JavaScript, HTML, and CSS development.',
      nodejs: 'You are an expert in Node.js backend development with Express and modern APIs.',
      python: 'You are an expert in Python development with FastAPI, Django, and modern web frameworks.'
    };

    const basePrompt = `You are an AI coding assistant that helps developers create, modify, and improve code. 
    You can generate code, review existing code, suggest improvements, fix bugs, and provide explanations.
    
    Always follow these guidelines:
    1. Generate clean, well-documented, and production-ready code
    2. Follow best practices and modern coding standards
    3. Include proper error handling and validation
    4. Write comprehensive tests when appropriate
    5. Consider performance, security, and accessibility
    6. Provide clear explanations for your suggestions
    7. Use modern ES6+ syntax and features
    8. Follow the project's existing code style and patterns
    
    Current project type: ${projectType}
    Language preference: ${language}`;

    return `${basePrompt}\n\n${languagePrompts[language] || languagePrompts.en}\n\n${projectPrompts[projectType] || projectPrompts.react}`;
  }

  /**
   * Process user message and generate response
   */
  async processMessage(message, context = {}) {
    try {
      // Add user message to history
      this.addToHistory('user', message);
      
      // Prepare conversation context
      const conversationContext = await this.prepareConversationContext(context);
      
      // Generate AI response
      const response = await this.generateResponse(message, conversationContext);
      
      // Add AI response to history
      this.addToHistory('assistant', response.content);
      
      // Process any actions from the response
      const actions = await this.processActions(response.actions || []);
      
      return {
        success: true,
        content: response.content,
        actions: actions,
        metadata: {
          model: response.model,
          tokens: response.usage?.total_tokens,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error to history
      this.addToHistory('system', `Error: ${error.message}`);
      
      return {
        success: false,
        error: error.message,
        content: this.getErrorMessage(error, this.session.language)
      };
    }
  }

  /**
   * Prepare conversation context with relevant information
   */
  async prepareConversationContext(context) {
    const contextInfo = {
      session: {
        language: this.session.language,
        projectType: this.session.projectType,
        createdAt: this.session.createdAt
      },
      conversation: {
        historyLength: this.conversationHistory.length,
        recentMessages: this.conversationHistory.slice(-5)
      }
    };

    // Add file context if available
    if (context.filePath) {
      try {
        const fileContent = await this.readFileContent(context.filePath);
        contextInfo.currentFile = {
          path: context.filePath,
          content: fileContent.substring(0, 2000), // Limit content length
          language: this.detectLanguage(context.filePath)
        };
      } catch (error) {
        console.warn('Could not read file for context:', error.message);
      }
    }

    // Add project structure if available
    if (context.projectStructure) {
      contextInfo.projectStructure = context.projectStructure;
    }

    return contextInfo;
  }

  /**
   * Generate AI response using OpenAI API
   */
  async generateResponse(message, context) {
    try {
      const messages = [
        { role: 'system', content: this.systemPrompt },
        ...this.conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content: message }
      ];

      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: messages,
        max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 2000,
        temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7,
        top_p: parseFloat(process.env.OPENAI_TOP_P) || 0.9,
        frequency_penalty: parseFloat(process.env.OPENAI_FREQUENCY_PENALTY) || 0.0,
        presence_penalty: parseFloat(process.env.OPENAI_PRESENCE_PENALTY) || 0.0
      });

      const response = completion.choices[0].message.content;
      
      // Parse response for actions
      const actions = this.parseActions(response);
      
      return {
        content: response,
        actions: actions,
        model: completion.model,
        usage: completion.usage
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      
      if (error.code === 'insufficient_quota') {
        throw new Error('API quota exceeded. Please check your OpenAI account.');
      } else if (error.code === 'rate_limit_exceeded') {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (error.code === 'invalid_api_key') {
        throw new Error('Invalid API key. Please check your OpenAI configuration.');
      } else {
        throw new Error(`AI service error: ${error.message}`);
      }
    }
  }

  /**
   * Parse response for executable actions
   */
  parseActions(response) {
    const actions = [];
    
    // Look for action patterns in the response
    const actionPatterns = [
      {
        regex: /```(?:create|generate|make)\s+(\w+)\s+file[:\s]+([^\n]+)```/gi,
        type: 'create_file',
        extract: (match) => ({
          fileName: match[1],
          description: match[2].trim()
        })
      },
      {
        regex: /```(?:edit|modify|update)\s+(\w+)\s+file[:\s]+([^\n]+)```/gi,
        type: 'edit_file',
        extract: (match) => ({
          fileName: match[1],
          description: match[2].trim()
        })
      },
      {
        regex: /```(?:run|execute)\s+command[:\s]+([^\n]+)```/gi,
        type: 'run_command',
        extract: (match) => ({
          command: match[1].trim()
        })
      },
      {
        regex: /```(?:create|make)\s+snapshot[:\s]+([^\n]+)```/gi,
        type: 'create_snapshot',
        extract: (match) => ({
          description: match[1].trim()
        })
      }
    ];

    for (const pattern of actionPatterns) {
      let match;
      while ((match = pattern.regex.exec(response)) !== null) {
        try {
          const action = {
            type: pattern.type,
            params: pattern.extract(match),
            confidence: 0.8
          };
          actions.push(action);
        } catch (error) {
          console.warn('Error parsing action:', error);
        }
      }
    }

    return actions;
  }

  /**
   * Process actions from AI response
   */
  async processActions(actions) {
    const results = [];
    
    for (const action of actions) {
      try {
        const result = await this.executeAction(action);
        results.push({
          action: action,
          result: result,
          success: true
        });
      } catch (error) {
        console.error('Error executing action:', error);
        results.push({
          action: action,
          error: error.message,
          success: false
        });
      }
    }
    
    return results;
  }

  /**
   * Execute a specific action
   */
  async executeAction(action) {
    switch (action.type) {
      case 'create_file':
        return await this.createFile(action.params);
      case 'edit_file':
        return await this.editFile(action.params);
      case 'run_command':
        return await this.runCommand(action.params);
      case 'create_snapshot':
        return await this.createSnapshot(action.params);
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  /**
   * Create a new file
   */
  async createFile(params) {
    try {
      const { fileName, description } = params;
      
      // Generate file content based on description
      const content = await this.generateFileContent(fileName, description);
      
      // Determine file path and extension
      const filePath = this.determineFilePath(fileName);
      
      // Create file
      await fs.ensureDir(path.dirname(filePath));
      await fs.writeFile(filePath, content, 'utf8');
      
      return {
        success: true,
        filePath: filePath,
        fileName: fileName,
        content: content
      };
    } catch (error) {
      console.error('Error creating file:', error);
      throw error;
    }
  }

  /**
   * Edit an existing file
   */
  async editFile(params) {
    try {
      const { fileName, description } = params;
      
      // Read existing file content
      const filePath = this.determineFilePath(fileName);
      const existingContent = await fs.readFile(filePath, 'utf8');
      
      // Generate updated content
      const updatedContent = await this.generateUpdatedContent(
        existingContent,
        description
      );
      
      // Write updated content
      await fs.writeFile(filePath, updatedContent, 'utf8');
      
      return {
        success: true,
        filePath: filePath,
        fileName: fileName,
        updatedContent: updatedContent
      };
    } catch (error) {
      console.error('Error editing file:', error);
      throw error;
    }
  }

  /**
   * Run a command
   */
  async runCommand(params) {
    try {
      const { command } = params;
      
      // Validate command for security
      if (!this.isCommandSafe(command)) {
        throw new Error('Command not allowed for security reasons');
      }
      
      // Execute command
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);
      
      const { stdout, stderr } = await execAsync(command, {
        cwd: this.session.projectPath,
        timeout: 30000
      });
      
      return {
        success: true,
        command: command,
        stdout: stdout,
        stderr: stderr
      };
    } catch (error) {
      console.error('Error running command:', error);
      throw error;
    }
  }

  /**
   * Create a snapshot
   */
  async createSnapshot(params) {
    try {
      const { description } = params;
      
      // This would typically call the VersionManager
      // For now, we'll just return success
      return {
        success: true,
        description: description,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating snapshot:', error);
      throw error;
    }
  }

  /**
   * Generate file content based on description
   */
  async generateFileContent(fileName, description) {
    try {
      const prompt = `Generate complete code for a file named "${fileName}" with the following requirements: ${description}
      
      Requirements:
      1. Generate complete, runnable code
      2. Include proper imports and dependencies
      3. Follow best practices for the file type
      4. Include helpful comments
      5. Handle edge cases and errors appropriately
      
      Return only the code, no explanations.`;
      
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a code generator. Return only the code, no explanations.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1500,
        temperature: 0.3
      });
      
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error generating file content:', error);
      // Fallback to basic template
      return this.getBasicFileTemplate(fileName);
    }
  }

  /**
   * Generate updated content for existing file
   */
  async generateUpdatedContent(existingContent, description) {
    try {
      const prompt = `Update the following code based on this requirement: ${description}
      
      Existing code:
      ${existingContent}
      
      Requirements:
      1. Keep the existing structure and style
      2. Make only the necessary changes
      3. Preserve existing functionality
      4. Follow the same coding patterns
      
      Return the complete updated code.`;
      
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a code updater. Return the complete updated code.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.3
      });
      
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error generating updated content:', error);
      return existingContent; // Return original content if update fails
    }
  }

  /**
   * Get basic file template
   */
  getBasicFileTemplate(fileName) {
    const extension = path.extname(fileName).toLowerCase();
    
    const templates = {
      '.js': `// ${fileName}
// Generated by AI Coding Assistant

console.log('Hello from ${fileName}');

// Add your code here
`,
      '.ts': `// ${fileName}
// Generated by AI Coding Assistant

console.log('Hello from ${fileName}');

// Add your code here
`,
      '.tsx': `import React from 'react';

// ${fileName}
// Generated by AI Coding Assistant

const ${path.basename(fileName, '.tsx')}: React.FC = () => {
  return (
    <div>
      <h1>Hello from ${fileName}</h1>
      {/* Add your component code here */}
    </div>
  );
};

export default ${path.basename(fileName, '.tsx')};
`,
      '.css': `/* ${fileName} */
/* Generated by AI Coding Assistant */

/* Add your styles here */
`,
      '.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fileName}</title>
</head>
<body>
    <h1>Hello from ${fileName}</h1>
    <!-- Add your HTML content here -->
</body>
</html>`
    };
    
    return templates[extension] || `# ${fileName}\n\nGenerated by AI Coding Assistant\n\nAdd your content here.`;
  }

  /**
   * Determine file path based on file name
   */
  determineFilePath(fileName) {
    const extension = path.extname(fileName).toLowerCase();
    const baseName = path.basename(fileName, extension);
    
    // Determine appropriate directory based on file type
    let directory = 'src';
    
    if (extension === '.css' || extension === '.scss') {
      directory = 'src/styles';
    } else if (extension === '.tsx' || extension === '.jsx') {
      directory = 'src/components';
    } else if (extension === '.ts' || extension === '.js') {
      if (baseName.includes('hook') || baseName.includes('Hook')) {
        directory = 'src/hooks';
      } else if (baseName.includes('util') || baseName.includes('Util')) {
        directory = 'src/utils';
      } else {
        directory = 'src';
      }
    } else if (extension === '.html') {
      directory = 'public';
    }
    
    return path.join(this.session.projectPath, directory, fileName);
  }

  /**
   * Detect programming language from file path
   */
  detectLanguage(filePath) {
    const extension = path.extname(filePath).toLowerCase();
    
    const languageMap = {
      '.js': 'javascript',
      '.ts': 'typescript',
      '.jsx': 'javascript',
      '.tsx': 'typescript',
      '.css': 'css',
      '.scss': 'scss',
      '.html': 'html',
      '.json': 'json',
      '.md': 'markdown',
      '.py': 'python',
      '.java': 'java',
      '.cpp': 'cpp',
      '.c': 'c',
      '.go': 'go',
      '.rs': 'rust',
      '.php': 'php',
      '.rb': 'ruby'
    };
    
    return languageMap[extension] || 'text';
  }

  /**
   * Read file content for context
   */
  async readFileContent(filePath) {
    try {
      const fullPath = path.join(this.session.projectPath, filePath);
      return await fs.readFile(fullPath, 'utf8');
    } catch (error) {
      console.warn('Could not read file:', error.message);
      return '';
    }
  }

  /**
   * Check if command is safe to execute
   */
  isCommandSafe(command) {
    const dangerousCommands = [
      'rm -rf',
      'sudo',
      'chmod 777',
      'dd if=',
      'mkfs',
      'fdisk',
      'format',
      'del /s',
      'format c:'
    ];
    
    const lowerCommand = command.toLowerCase();
    return !dangerousCommands.some(dangerous => lowerCommand.includes(dangerous));
  }

  /**
   * Add message to conversation history
   */
  addToHistory(role, content) {
    this.conversationHistory.push({
      role: role,
      content: content,
      timestamp: new Date().toISOString()
    });
    
    // Limit history length
    if (this.conversationHistory.length > this.maxHistoryLength) {
      this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength);
    }
  }

  /**
   * Get conversation history
   */
  getConversationHistory() {
    return this.conversationHistory;
  }

  /**
   * Clear conversation history
   */
  clearConversationHistory() {
    this.conversationHistory = [];
  }

  /**
   * Get error message in appropriate language
   */
  getErrorMessage(error, language = 'en') {
    const errorMessages = {
      ar: {
        'API quota exceeded': 'تم استنفاذ حصة API. يرجى التحقق من حساب OpenAI الخاص بك.',
        'Rate limit exceeded': 'تم تجاوز حد المعدل. يرجى الانتظار لحظة والمحاولة مرة أخرى.',
        'Invalid API key': 'مفتاح API غير صالح. يرجى التحقق من إعدادات OpenAI الخاصة بك.',
        'AI service error': 'خطأ في خدمة الذكاء الاصطناعي'
      },
      en: {
        'API quota exceeded': 'API quota exceeded. Please check your OpenAI account.',
        'Rate limit exceeded': 'Rate limit exceeded. Please wait a moment and try again.',
        'Invalid API key': 'Invalid API key. Please check your OpenAI configuration.',
        'AI service error': 'AI service error'
      }
    };
    
    const messages = errorMessages[language] || errorMessages.en;
    
    for (const [key, value] of Object.entries(messages)) {
      if (error.message.includes(key)) {
        return value;
      }
    }
    
    return messages['AI service error'] + ': ' + error.message;
  }

  /**
   * Get AI model information
   */
  getModelInfo() {
    return {
      model: process.env.OPENAI_MODEL || 'gpt-4',
      maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 2000,
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7,
      topP: parseFloat(process.env.OPENAI_TOP_P) || 0.9
    };
  }

  /**
   * Update AI model settings
   */
  updateModelSettings(settings) {
    if (settings.model) {
      process.env.OPENAI_MODEL = settings.model;
    }
    if (settings.maxTokens) {
      process.env.OPENAI_MAX_TOKENS = settings.maxTokens.toString();
    }
    if (settings.temperature) {
      process.env.OPENAI_TEMPERATURE = settings.temperature.toString();
    }
    if (settings.topP) {
      process.env.OPENAI_TOP_P = settings.topP.toString();
    }
  }
}

module.exports = AIManager;