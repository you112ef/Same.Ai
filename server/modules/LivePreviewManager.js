const { spawn } = require('child_process');
const winston = require('winston');
const path = require('path');
const fs = require('fs-extra');

class LivePreviewManager {
  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.simple(),
      transports: [new winston.transports.Console()]
    });

    this.activePreviews = new Map(); // sessionId -> previewInfo
    this.portManager = new PortManager();
  }

  async startPreview(sessionId, projectPath, projectType = 'nextjs') {
    try {
      this.logger.info(`Starting preview for session: ${sessionId}`);

      // التحقق من وجود المشروع
      if (!await fs.pathExists(projectPath)) {
        throw new Error('Project path does not exist');
      }

      // الحصول على منفذ متاح
      const port = await this.portManager.getAvailablePort();
      
      // تحديد أمر التشغيل حسب نوع المشروع
      const startCommand = this.getStartCommand(projectType, port);
      
      // تشغيل خادم المعاينة
      const previewProcess = await this.runPreviewServer(projectPath, startCommand, port);
      
      // حفظ معلومات المعاينة
      const previewInfo = {
        sessionId,
        projectPath,
        projectType,
        port,
        process: previewProcess,
        startTime: new Date(),
        status: 'starting'
      };

      this.activePreviews.set(sessionId, previewInfo);

      // انتظار بدء الخادم
      await this.waitForServer(port);

      previewInfo.status = 'running';
      previewInfo.url = `http://localhost:${port}`;

      this.logger.info(`Preview started successfully: ${previewInfo.url}`);
      
      return previewInfo;
    } catch (error) {
      this.logger.error('Error starting preview:', error);
      throw error;
    }
  }

  getStartCommand(projectType, port) {
    const commands = {
      'nextjs': `bun dev --port ${port} --hostname 0.0.0.0`,
      'react': `bun dev --port ${port} --host`,
      'vue': `bun dev --port ${port} --host`,
      'svelte': `bun dev --port ${port} --host`,
      'vanilla': `bun dev --port ${port} --host`
    };

    return commands[projectType] || commands['nextjs'];
  }

  async runPreviewServer(projectPath, command, port) {
    return new Promise((resolve, reject) => {
      const [cmd, ...args] = command.split(' ');
      
      const process = spawn(cmd, args, {
        cwd: projectPath,
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
          ...process.env,
          PORT: port.toString(),
          NODE_ENV: 'development'
        }
      });

      let stdout = '';
      let stderr = '';

      process.stdout.on('data', (data) => {
        stdout += data.toString();
        this.logger.debug(`Preview stdout: ${data.toString()}`);
      });

      process.stderr.on('data', (data) => {
        stderr += data.toString();
        this.logger.debug(`Preview stderr: ${data.toString()}`);
      });

      process.on('error', (error) => {
        this.logger.error('Preview process error:', error);
        reject(error);
      });

      process.on('close', (code) => {
        this.logger.info(`Preview process closed with code: ${code}`);
      });

      // انتظار قليل للتأكد من بدء العملية
      setTimeout(() => {
        resolve(process);
      }, 1000);
    });
  }

  async waitForServer(port, maxAttempts = 30) {
    const http = require('http');
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await new Promise((resolve, reject) => {
          const req = http.get(`http://localhost:${port}`, (res) => {
            if (res.statusCode === 200) {
              resolve();
            } else {
              reject(new Error(`Server responded with status: ${res.statusCode}`));
            }
          });

          req.on('error', reject);
          req.setTimeout(2000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
          });
        });

        this.logger.info(`Server is ready on port ${port}`);
        return true;
      } catch (error) {
        if (attempt === maxAttempts) {
          throw new Error(`Server failed to start after ${maxAttempts} attempts`);
        }
        
        this.logger.debug(`Waiting for server... attempt ${attempt}/${maxAttempts}`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  async stopPreview(sessionId) {
    try {
      const previewInfo = this.activePreviews.get(sessionId);
      
      if (!previewInfo) {
        this.logger.warn(`No preview found for session: ${sessionId}`);
        return false;
      }

      this.logger.info(`Stopping preview for session: ${sessionId}`);

      // إيقاف العملية
      if (previewInfo.process && !previewInfo.process.killed) {
        previewInfo.process.kill('SIGTERM');
        
        // انتظار إيقاف العملية
        await new Promise((resolve) => {
          previewInfo.process.on('close', resolve);
          setTimeout(resolve, 5000); // timeout بعد 5 ثوان
        });
      }

      // إطلاق المنفذ
      await this.portManager.releasePort(previewInfo.port);

      // حذف من القائمة النشطة
      this.activePreviews.delete(sessionId);

      this.logger.info(`Preview stopped for session: ${sessionId}`);
      return true;
    } catch (error) {
      this.logger.error('Error stopping preview:', error);
      return false;
    }
  }

  async getPreviewUrl(sessionId) {
    const previewInfo = this.activePreviews.get(sessionId);
    
    if (!previewInfo || previewInfo.status !== 'running') {
      return null;
    }

    return previewInfo.url;
  }

  async getPreviewStatus(sessionId) {
    const previewInfo = this.activePreviews.get(sessionId);
    
    if (!previewInfo) {
      return { status: 'not_found' };
    }

    // فحص حالة العملية
    const isRunning = previewInfo.process && !previewInfo.process.killed;
    
    return {
      sessionId,
      status: isRunning ? 'running' : 'stopped',
      url: previewInfo.url,
      port: previewInfo.port,
      startTime: previewInfo.startTime,
      uptime: Date.now() - previewInfo.startTime.getTime()
    };
  }

  async restartPreview(sessionId) {
    try {
      this.logger.info(`Restarting preview for session: ${sessionId}`);
      
      const previewInfo = this.activePreviews.get(sessionId);
      
      if (!previewInfo) {
        throw new Error('No preview found to restart');
      }

      // إيقاف المعاينة الحالية
      await this.stopPreview(sessionId);

      // إعادة تشغيل المعاينة
      const newPreviewInfo = await this.startPreview(
        sessionId,
        previewInfo.projectPath,
        previewInfo.projectType
      );

      this.logger.info(`Preview restarted successfully for session: ${sessionId}`);
      return newPreviewInfo;
    } catch (error) {
      this.logger.error('Error restarting preview:', error);
      throw error;
    }
  }

  async getAllPreviews() {
    const previews = [];
    
    for (const [sessionId, previewInfo] of this.activePreviews.entries()) {
      const status = await this.getPreviewStatus(sessionId);
      previews.push(status);
    }
    
    return previews;
  }

  async cleanupAllPreviews() {
    this.logger.info('Cleaning up all previews');
    
    const sessionIds = Array.from(this.activePreviews.keys());
    const cleanupPromises = sessionIds.map(sessionId => this.stopPreview(sessionId));
    
    await Promise.allSettled(cleanupPromises);
    
    this.logger.info('All previews cleaned up');
  }

  async getPreviewLogs(sessionId, lines = 100) {
    const previewInfo = this.activePreviews.get(sessionId);
    
    if (!previewInfo) {
      return null;
    }

    // في التطبيق الحقيقي، سيتم قراءة السجلات من ملف أو من العملية
    return {
      sessionId,
      logs: `Preview logs for session ${sessionId} (last ${lines} lines)`,
      timestamp: new Date().toISOString()
    };
  }
}

// مدير المنافذ
class PortManager {
  constructor() {
    this.usedPorts = new Set();
    this.basePort = 3000;
  }

  async getAvailablePort() {
    let port = this.basePort;
    
    while (this.usedPorts.has(port)) {
      port++;
    }
    
    this.usedPorts.add(port);
    return port;
  }

  async releasePort(port) {
    this.usedPorts.delete(port);
  }

  getUsedPorts() {
    return Array.from(this.usedPorts);
  }
}

module.exports = LivePreviewManager;