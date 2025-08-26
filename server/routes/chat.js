const express = require('express');
const router = express.Router();
const winston = require('winston');
const fs = require('fs-extra');
const path = require('path');

// إنشاء logger للمسار
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

// مسار إرسال رسالة للمساعد الذكي
router.post('/message', async (req, res) => {
  try {
    const { message, sessionId, language = 'ar' } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({
        error: 'Message and sessionId are required'
      });
    }

    // التحقق من وجود الجلسة
    const session = req.app.locals.activeSessions?.get(sessionId);
    if (!session) {
      return res.status(404).json({
        error: 'Session not found'
      });
    }

    logger.info(`Processing message for session ${sessionId}: ${message.substring(0, 50)}...`);

    // معالجة الرسالة عبر خدمة الذكاء الاصطناعي
    const aiService = req.app.locals.aiService;
    const response = await aiService.analyzeMessage(message, language);

    // تنفيذ الإجراءات المطلوبة
    const results = await req.app.locals.executeActions(session, response.actions);

    // توليد الرد
    const aiResponse = await aiService.generateResponse(message, results, language);

    // حفظ في سجل الجلسة
    await req.app.locals.saveToSessionHistory(sessionId, message, aiResponse, results);

    res.json({
      success: true,
      response: aiResponse,
      sessionId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error processing chat message:', error);
    res.status(500).json({
      error: 'Failed to process message',
      details: error.message
    });
  }
});

// مسار الحصول على سجل المحادثة
router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // التحقق من وجود الجلسة
    const session = req.app.locals.activeSessions?.get(sessionId);
    if (!session) {
      return res.status(404).json({
        error: 'Session not found'
      });
    }

    // قراءة سجل المحادثة من ملف التاريخ
    const historyPath = path.join(session.projectPath, '.same', 'history.md');
    
    if (!await fs.pathExists(historyPath)) {
      return res.json({
        history: [],
        total: 0
      });
    }

    const historyContent = await fs.readFile(historyPath, 'utf8');
    const historyEntries = this.parseHistoryContent(historyContent);
    
    // تطبيق الحدود والإزاحة
    const paginatedHistory = historyEntries
      .slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    res.json({
      history: paginatedHistory,
      total: historyEntries.length,
      hasMore: parseInt(offset) + parseInt(limit) < historyEntries.length
    });

  } catch (error) {
    logger.error('Error getting chat history:', error);
    res.status(500).json({
      error: 'Failed to get chat history',
      details: error.message
    });
  }
});

// مسار مسح سجل المحادثة
router.delete('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    // التحقق من وجود الجلسة
    const session = req.app.locals.activeSessions?.get(sessionId);
    if (!session) {
      return res.status(404).json({
        error: 'Session not found'
      });
    }

    // مسح ملف التاريخ
    const historyPath = path.join(session.projectPath, '.same', 'history.md');
    
    if (await fs.pathExists(historyPath)) {
      await fs.writeFile(historyPath, '# سجل التعديلات\n\n', 'utf8');
    }

    res.json({
      success: true,
      message: 'Chat history cleared'
    });

  } catch (error) {
    logger.error('Error clearing chat history:', error);
    res.status(500).json({
      error: 'Failed to clear chat history',
      details: error.message
    });
  }
});

// مسار الحصول على اقتراحات ذكية
router.get('/suggestions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    // التحقق من وجود الجلسة
    const session = req.app.locals.activeSessions?.get(sessionId);
    if (!session) {
      return res.status(404).json({
        error: 'Session not found'
      });
    }

    // قراءة المهام الحالية
    const todosPath = path.join(session.projectPath, '.same', 'todos.md');
    let suggestions = [];

    if (await fs.pathExists(todosPath)) {
      const todosContent = await fs.readFile(todosPath, 'utf8');
      suggestions = this.extractSuggestionsFromTodos(todosContent);
    }

    // إضافة اقتراحات عامة
    const generalSuggestions = [
      'إضافة صفحة جديدة',
      'تخصيص التصميم',
      'إضافة مكونات جديدة',
      'فحص الكود للأخطاء',
      'نشر المشروع'
    ];

    suggestions = [...suggestions, ...generalSuggestions];

    res.json({
      suggestions: suggestions.slice(0, 10), // حد أقصى 10 اقتراحات
      sessionId
    });

  } catch (error) {
    logger.error('Error getting suggestions:', error);
    res.status(500).json({
      error: 'Failed to get suggestions',
      details: error.message
    });
  }
});

// مسار تحليل اللغة تلقائياً
router.post('/detect-language', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'Text is required'
      });
    }

    const aiService = req.app.locals.aiService;
    const language = await aiService.detectLanguage(text);

    res.json({
      language,
      confidence: 0.95, // في التطبيق الحقيقي سيتم حساب الثقة
      text: text.substring(0, 100) // إرجاع جزء من النص للتحقق
    });

  } catch (error) {
    logger.error('Error detecting language:', error);
    res.status(500).json({
      error: 'Failed to detect language',
      details: error.message
    });
  }
});

// مسار الحصول على إحصائيات المحادثة
router.get('/stats/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    // التحقق من وجود الجلسة
    const session = req.app.locals.activeSessions?.get(sessionId);
    if (!session) {
      return res.status(404).json({
        error: 'Session not found'
      });
    }

    // قراءة سجل المحادثة
    const historyPath = path.join(session.projectPath, '.same', 'history.md');
    let stats = {
      totalMessages: 0,
      userMessages: 0,
      aiResponses: 0,
      averageResponseTime: 0,
      sessionDuration: Date.now() - session.createdAt.getTime()
    };

    if (await fs.pathExists(historyPath)) {
      const historyContent = await fs.readFile(historyPath, 'utf8');
      const historyEntries = this.parseHistoryContent(historyContent);
      
      stats.totalMessages = historyEntries.length;
      stats.userMessages = historyEntries.filter(entry => entry.type === 'user').length;
      stats.aiResponses = historyEntries.filter(entry => entry.type === 'ai').length;
    }

    res.json({
      sessionId,
      stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error getting chat stats:', error);
    res.status(500).json({
      error: 'Failed to get chat stats',
      details: error.message
    });
  }
});

// دالة مساعدة لتحليل محتوى التاريخ
parseHistoryContent(content) {
  const entries = [];
  const sections = content.split('## ').slice(1); // تجاهل القسم الأول الفارغ

  for (const section of sections) {
    const lines = section.split('\n');
    const timestamp = lines[0].trim();
    
    let userMessage = '';
    let aiResponse = '';
    let actions = '';

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.includes('**User:**')) {
        userMessage = line.replace('**User:**', '').trim();
      } else if (line.includes('**AI Response:**')) {
        aiResponse = line.replace('**AI Response:**', '').trim();
      } else if (line.includes('**Actions:**')) {
        actions = line.replace('**Actions:**', '').trim();
      }
    }

    if (userMessage || aiResponse) {
      entries.push({
        timestamp,
        userMessage,
        aiResponse,
        actions,
        type: userMessage ? 'user' : 'ai'
      });
    }
  }

  return entries;
}

// دالة مساعدة لاستخراج الاقتراحات من المهام
extractSuggestionsFromTodos(content) {
  const suggestions = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    if (line.includes('- [ ]') && !line.includes('##')) {
      const suggestion = line.replace('- [ ]', '').trim();
      if (suggestion) {
        suggestions.push(suggestion);
      }
    }
  }
  
  return suggestions;
}

module.exports = router;