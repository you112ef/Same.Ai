const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');
const archiver = require('archiver');

class VersionManager {
  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.simple(),
      transports: [new winston.transports.Console()]
    });
    
    this.versionsPath = 'versions';
    this.maxVersions = 50; // الحد الأقصى للإصدارات المحفوظة
  }

  async saveVersion(projectPath, description = '') {
    try {
      const versionId = uuidv4();
      const timestamp = new Date().toISOString();
      const versionDir = path.join(this.versionsPath, versionId);
      
      // إنشاء مجلد الإصدار
      await fs.ensureDir(versionDir);
      
      // نسخ مشروع كامل
      await this.copyProject(projectPath, versionDir);
      
      // إنشاء metadata
      const metadata = {
        id: versionId,
        timestamp,
        description,
        projectPath,
        fileCount: await this.countFiles(projectPath),
        size: await this.getProjectSize(projectPath)
      };
      
      await fs.writeJson(path.join(versionDir, 'metadata.json'), metadata, { spaces: 2 });
      
      // إنشاء screenshot للمعاينة
      await this.createScreenshot(projectPath, versionDir);
      
      // تحديث قائمة الإصدارات
      await this.updateVersionList(versionId, metadata);
      
      // تنظيف الإصدارات القديمة
      await this.cleanupOldVersions();
      
      this.logger.info(`Version saved: ${versionId} - ${description}`);
      
      return {
        versionId,
        timestamp,
        description,
        metadata
      };
    } catch (error) {
      this.logger.error('Error saving version:', error);
      throw error;
    }
  }

  async copyProject(sourcePath, destPath) {
    try {
      // استثناء node_modules وملفات النظام
      const excludePatterns = [
        'node_modules',
        '.git',
        '.same',
        'versions',
        '*.log',
        '.DS_Store'
      ];
      
      await fs.copy(sourcePath, destPath, {
        filter: (src, dest) => {
          const relativePath = path.relative(sourcePath, src);
          return !excludePatterns.some(pattern => {
            if (pattern.includes('*')) {
              return relativePath.includes(pattern.replace('*', ''));
            }
            return relativePath.includes(pattern);
          });
        }
      });
    } catch (error) {
      this.logger.error('Error copying project:', error);
      throw error;
    }
  }

  async countFiles(dirPath) {
    try {
      const files = await this.getAllFiles(dirPath);
      return files.length;
    } catch (error) {
      return 0;
    }
  }

  async getAllFiles(dirPath) {
    const files = [];
    
    const items = await fs.readdir(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = await fs.stat(fullPath);
      
      if (stat.isDirectory()) {
        if (!item.startsWith('.') && item !== 'node_modules') {
          const subFiles = await this.getAllFiles(fullPath);
          files.push(...subFiles);
        }
      } else {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  async getProjectSize(dirPath) {
    try {
      const files = await this.getAllFiles(dirPath);
      let totalSize = 0;
      
      for (const file of files) {
        const stats = await fs.stat(file);
        totalSize += stats.size;
      }
      
      return totalSize;
    } catch (error) {
      return 0;
    }
  }

  async createScreenshot(projectPath, versionDir) {
    try {
      // في التطبيق الحقيقي، سيتم استخدام Puppeteer أو Playwright
      // لالتقاط screenshot من Live Preview
      const screenshotPath = path.join(versionDir, 'preview.png');
      
      // محاكاة بسيطة - في التطبيق الحقيقي سيتم التقاط صورة حقيقية
      const mockScreenshot = {
        timestamp: new Date().toISOString(),
        url: 'http://localhost:3000',
        size: { width: 1920, height: 1080 }
      };
      
      await fs.writeJson(path.join(versionDir, 'screenshot.json'), mockScreenshot, { spaces: 2 });
      
      return screenshotPath;
    } catch (error) {
      this.logger.error('Error creating screenshot:', error);
      return null;
    }
  }

  async updateVersionList(versionId, metadata) {
    try {
      const versionsListPath = path.join(this.versionsPath, 'versions.json');
      let versions = [];
      
      if (await fs.pathExists(versionsListPath)) {
        versions = await fs.readJson(versionsListPath);
      }
      
      versions.unshift({
        id: versionId,
        timestamp: metadata.timestamp,
        description: metadata.description,
        fileCount: metadata.fileCount,
        size: metadata.size
      });
      
      await fs.writeJson(versionsListPath, versions, { spaces: 2 });
    } catch (error) {
      this.logger.error('Error updating version list:', error);
    }
  }

  async getVersions() {
    try {
      const versionsListPath = path.join(this.versionsPath, 'versions.json');
      
      if (!await fs.pathExists(versionsListPath)) {
        return [];
      }
      
      return await fs.readJson(versionsListPath);
    } catch (error) {
      this.logger.error('Error getting versions:', error);
      return [];
    }
  }

  async getVersion(versionId) {
    try {
      const versionDir = path.join(this.versionsPath, versionId);
      
      if (!await fs.pathExists(versionDir)) {
        throw new Error('Version not found');
      }
      
      const metadata = await fs.readJson(path.join(versionDir, 'metadata.json'));
      const files = await this.getAllFiles(versionDir);
      
      return {
        ...metadata,
        files: files.map(file => path.relative(versionDir, file))
      };
    } catch (error) {
      this.logger.error('Error getting version:', error);
      throw error;
    }
  }

  async restoreVersion(versionId, targetPath) {
    try {
      const versionDir = path.join(this.versionsPath, versionId);
      
      if (!await fs.pathExists(versionDir)) {
        throw new Error('Version not found');
      }
      
      // مسح المجلد الحالي
      await fs.emptyDir(targetPath);
      
      // نسخ الإصدار المحدد
      await this.copyProject(versionDir, targetPath);
      
      // حذف ملفات النظام من النسخة المستعادة
      const systemFiles = ['metadata.json', 'screenshot.json'];
      for (const file of systemFiles) {
        const filePath = path.join(targetPath, file);
        if (await fs.pathExists(filePath)) {
          await fs.remove(filePath);
        }
      }
      
      this.logger.info(`Version restored: ${versionId} to ${targetPath}`);
      
      return {
        versionId,
        targetPath,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Error restoring version:', error);
      throw error;
    }
  }

  async compareVersions(versionId1, versionId2) {
    try {
      const version1 = await this.getVersion(versionId1);
      const version2 = await this.getVersion(versionId2);
      
      const differences = {
        files: {
          added: [],
          removed: [],
          modified: []
        },
        metadata: {
          fileCountDiff: version2.fileCount - version1.fileCount,
          sizeDiff: version2.size - version1.size,
          timeDiff: new Date(version2.timestamp) - new Date(version1.timestamp)
        }
      };
      
      // مقارنة الملفات
      const files1 = new Set(version1.files);
      const files2 = new Set(version2.files);
      
      for (const file of files2) {
        if (!files1.has(file)) {
          differences.files.added.push(file);
        }
      }
      
      for (const file of files1) {
        if (!files2.has(file)) {
          differences.files.removed.push(file);
        }
      }
      
      return differences;
    } catch (error) {
      this.logger.error('Error comparing versions:', error);
      throw error;
    }
  }

  async exportVersion(versionId, exportPath) {
    try {
      const versionDir = path.join(this.versionsPath, versionId);
      
      if (!await fs.pathExists(versionDir)) {
        throw new Error('Version not found');
      }
      
      const metadata = await fs.readJson(path.join(versionDir, 'metadata.json'));
      const zipPath = path.join(exportPath, `version-${versionId}.zip`);
      
      await fs.ensureDir(exportPath);
      
      // إنشاء ملف ZIP
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      archive.pipe(output);
      archive.directory(versionDir, false);
      
      await archive.finalize();
      
      this.logger.info(`Version exported: ${versionId} to ${zipPath}`);
      
      return {
        versionId,
        exportPath: zipPath,
        size: await fs.stat(zipPath).then(stats => stats.size)
      };
    } catch (error) {
      this.logger.error('Error exporting version:', error);
      throw error;
    }
  }

  async deleteVersion(versionId) {
    try {
      const versionDir = path.join(this.versionsPath, versionId);
      
      if (!await fs.pathExists(versionDir)) {
        throw new Error('Version not found');
      }
      
      // حذف مجلد الإصدار
      await fs.remove(versionDir);
      
      // تحديث قائمة الإصدارات
      const versionsListPath = path.join(this.versionsPath, 'versions.json');
      let versions = [];
      
      if (await fs.pathExists(versionsListPath)) {
        versions = await fs.readJson(versionsListPath);
        versions = versions.filter(v => v.id !== versionId);
        await fs.writeJson(versionsListPath, versions, { spaces: 2 });
      }
      
      this.logger.info(`Version deleted: ${versionId}`);
      
      return { success: true, versionId };
    } catch (error) {
      this.logger.error('Error deleting version:', error);
      throw error;
    }
  }

  async cleanupOldVersions() {
    try {
      const versions = await this.getVersions();
      
      if (versions.length > this.maxVersions) {
        const versionsToDelete = versions.slice(this.maxVersions);
        
        for (const version of versionsToDelete) {
          await this.deleteVersion(version.id);
        }
        
        this.logger.info(`Cleaned up ${versionsToDelete.length} old versions`);
      }
    } catch (error) {
      this.logger.error('Error cleaning up old versions:', error);
    }
  }

  async getVersionStats() {
    try {
      const versions = await this.getVersions();
      
      const stats = {
        totalVersions: versions.length,
        totalSize: versions.reduce((sum, v) => sum + v.size, 0),
        averageSize: versions.length > 0 ? 
          versions.reduce((sum, v) => sum + v.size, 0) / versions.length : 0,
        oldestVersion: versions.length > 0 ? versions[versions.length - 1] : null,
        newestVersion: versions.length > 0 ? versions[0] : null
      };
      
      return stats;
    } catch (error) {
      this.logger.error('Error getting version stats:', error);
      return {
        totalVersions: 0,
        totalSize: 0,
        averageSize: 0,
        oldestVersion: null,
        newestVersion: null
      };
    }
  }
}

module.exports = VersionManager;