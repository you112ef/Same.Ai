const winston = require('winston');
const crypto = require('crypto');
const path = require('path'); // Added missing import for path

class SecurityManager {
  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.simple(),
      transports: [new winston.transports.Console()]
    });

    // قائمة الأوامر المحظورة
    this.forbiddenCommands = [
      'rm -rf /',
      'dd if=',
      'mkfs',
      'fdisk',
      'mount',
      'umount',
      'chmod 777',
      'chown root',
      'sudo',
      'su',
      'passwd',
      'useradd',
      'userdel',
      'groupadd',
      'groupdel',
      'init',
      'shutdown',
      'reboot',
      'halt',
      'poweroff'
    ];

    // أنماط URL المحظورة
    this.forbiddenUrlPatterns = [
      /login\.php/i,
      /admin\.php/i,
      /wp-admin/i,
      /administrator/i,
      /\.env$/i,
      /config\.php/i,
      /database\.php/i
    ];

    // حدود الاستخدام
    this.usageLimits = {
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxProjectSize: 100 * 1024 * 1024, // 100MB
      maxSessionDuration: 2 * 60 * 60 * 1000, // 2 hours
      maxApiCalls: 100, // per 15 minutes
      maxConcurrentSessions: 5
    };
  }

  // فحص الأمان للأوامر
  isCommandSafe(command) {
    const lowerCommand = command.toLowerCase();
    
    // فحص الأوامر المحظورة
    for (const forbidden of this.forbiddenCommands) {
      if (lowerCommand.includes(forbidden)) {
        this.logger.warn(`Forbidden command detected: ${command}`);
        return false;
      }
    }

    // فحص محاولات الخروج من المجلد
    if (lowerCommand.includes('cd ..') || lowerCommand.includes('cd ../')) {
      this.logger.warn(`Directory traversal attempt: ${command}`);
      return false;
    }

    // فحص محاولات الوصول لملفات النظام
    if (lowerCommand.includes('/etc/') || lowerCommand.includes('/var/') || lowerCommand.includes('/sys/')) {
      this.logger.warn(`System file access attempt: ${command}`);
      return false;
    }

    return true;
  }

  // فحص الأمان للملفات
  isFilePathSafe(filePath, projectPath) {
    try {
      const normalizedFilePath = path.resolve(filePath);
      const normalizedProjectPath = path.resolve(projectPath);
      
      // التأكد من أن الملف ضمن مجلد المشروع
      if (!normalizedFilePath.startsWith(normalizedProjectPath)) {
        this.logger.warn(`File path outside project directory: ${filePath}`);
        return false;
      }

      // فحص الملفات المحظورة
      const forbiddenFiles = [
        '.env',
        '.git',
        'node_modules',
        '.same',
        'package-lock.json',
        'yarn.lock'
      ];

      for (const forbidden of forbiddenFiles) {
        if (normalizedFilePath.includes(forbidden)) {
          this.logger.warn(`Forbidden file access: ${filePath}`);
          return false;
        }
      }

      return true;
    } catch (error) {
      this.logger.error('Error checking file path safety:', error);
      return false;
    }
  }

  // فحص الأمان للURL
  isUrlSafe(url) {
    try {
      const urlObj = new URL(url);
      
      // فحص البروتوكول
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        this.logger.warn(`Unsafe protocol: ${url}`);
        return false;
      }

      // فحص الأنماط المحظورة
      for (const pattern of this.forbiddenUrlPatterns) {
        if (pattern.test(url)) {
          this.logger.warn(`Forbidden URL pattern: ${url}`);
          return false;
        }
      }

      // فحص المنافذ المحظورة
      const forbiddenPorts = [21, 22, 23, 25, 53, 80, 443, 3306, 5432, 27017];
      if (urlObj.port && forbiddenPorts.includes(parseInt(urlObj.port))) {
        this.logger.warn(`Forbidden port: ${url}`);
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error('Error checking URL safety:', error);
      return false;
    }
  }

  // فحص حجم الملف
  isFileSizeSafe(fileSize) {
    return fileSize <= this.usageLimits.maxFileSize;
  }

  // فحص حجم المشروع
  isProjectSizeSafe(projectSize) {
    return projectSize <= this.usageLimits.maxProjectSize;
  }

  // فحص مدة الجلسة
  isSessionDurationSafe(sessionStartTime) {
    const sessionDuration = Date.now() - sessionStartTime;
    return sessionDuration <= this.usageLimits.maxSessionDuration;
  }

  // تشفير البيانات الحساسة
  encryptData(data) {
    try {
      const algorithm = 'aes-256-cbc';
      const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-key', 'salt', 32);
      const iv = crypto.randomBytes(16);
      
      const cipher = crypto.createCipher(algorithm, key);
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      return {
        encrypted,
        iv: iv.toString('hex')
      };
    } catch (error) {
      this.logger.error('Error encrypting data:', error);
      throw error;
    }
  }

  // فك تشفير البيانات
  decryptData(encryptedData, iv) {
    try {
      const algorithm = 'aes-256-cbc';
      const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-key', 'salt', 32);
      
      const decipher = crypto.createDecipher(algorithm, key);
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      this.logger.error('Error decrypting data:', error);
      throw error;
    }
  }

  // إنشاء token آمن
  generateSecureToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // فحص صحة Token
  validateToken(token) {
    return token && token.length === 64 && /^[a-f0-9]+$/i.test(token);
  }

  // تسجيل محاولة أمنية مشبوهة
  logSecurityEvent(eventType, details) {
    const securityEvent = {
      timestamp: new Date().toISOString(),
      eventType,
      details,
      ip: details.ip || 'unknown',
      userAgent: details.userAgent || 'unknown'
    };

    this.logger.warn('Security event detected:', securityEvent);
    
    // في التطبيق الحقيقي، سيتم إرسال هذا إلى نظام مراقبة الأمان
    return securityEvent;
  }

  // فحص محاولات التسلل
  detectIntrusion(activity) {
    const suspiciousPatterns = [
      /script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(activity)) {
        this.logger.warn(`Intrusion attempt detected: ${activity}`);
        return true;
      }
    }

    return false;
  }

  // تنظيف المدخلات
  sanitizeInput(input) {
    if (typeof input !== 'string') {
      return input;
    }

    // إزالة الأحرف الخطيرة
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

  // فحص صحة البيانات
  validateData(data, schema) {
    try {
      // فحص بسيط للبيانات المطلوبة
      for (const [field, rules] of Object.entries(schema)) {
        if (rules.required && !data[field]) {
          throw new Error(`Required field missing: ${field}`);
        }

        if (data[field] && rules.type && typeof data[field] !== rules.type) {
          throw new Error(`Invalid type for field: ${field}`);
        }

        if (data[field] && rules.maxLength && data[field].length > rules.maxLength) {
          throw new Error(`Field too long: ${field}`);
        }
      }

      return true;
    } catch (error) {
      this.logger.error('Data validation error:', error);
      return false;
    }
  }

  // فحص معدل الطلبات
  checkRateLimit(userId, action) {
    // في التطبيق الحقيقي، سيتم استخدام Redis أو قاعدة بيانات
    // لتتبع معدل الطلبات لكل مستخدم
    return true;
  }

  // إنشاء تقرير أمان
  generateSecurityReport() {
    return {
      timestamp: new Date().toISOString(),
      securityChecks: {
        commandValidation: true,
        filePathValidation: true,
        urlValidation: true,
        dataEncryption: true,
        intrusionDetection: true
      },
      usageLimits: this.usageLimits,
      forbiddenCommands: this.forbiddenCommands.length,
      forbiddenUrlPatterns: this.forbiddenUrlPatterns.length
    };
  }
}

module.exports = SecurityManager;