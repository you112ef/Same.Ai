const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

class VersionManager {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.projectPath = path.join(process.cwd(), 'projects', sessionId);
    this.versionsPath = path.join(process.cwd(), 'versions', sessionId);
    this.systemPath = path.join(this.projectPath, '.same');
  }
  
  async createSnapshot(description = '') {
    try {
      const timestamp = new Date().toISOString();
      const versionId = `v${Date.now()}`;
      const versionPath = path.join(this.versionsPath, versionId);
      
      await fs.ensureDir(versionPath);
      
      // نسخ المشروع
      await fs.copy(this.projectPath, path.join(versionPath, 'project'));
      
      // إنشاء أرشيف مضغوط
      const archivePath = path.join(versionPath, 'project.zip');
      await this.createArchive(this.projectPath, archivePath);
      
      // حفظ معلومات الإصدار
      const versionInfo = {
        id: versionId,
        timestamp,
        description: description || 'نسخة تلقائية',
        projectPath: this.projectPath,
        archivePath,
        size: await this.getDirectorySize(this.projectPath),
        files: await this.getProjectFileCount()
      };
      
      await fs.writeFile(
        path.join(versionPath, 'version.json'),
        JSON.stringify(versionInfo, null, 2)
      );
      
      // تحديث قائمة الإصدارات
      await this.updateVersionsList(versionInfo);
      
      // تحديث سجل التاريخ
      await this.updateHistory('snapshot', description);
      
      return { success: true, version: versionInfo };
    } catch (error) {
      console.error('Error creating snapshot:', error);
      throw error;
    }
  }
  
  async createArchive(sourcePath, archivePath) {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(archivePath);
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      output.on('close', () => resolve());
      archive.on('error', (err) => reject(err));
      
      archive.pipe(output);
      archive.directory(sourcePath, false);
      archive.finalize();
    });
  }
  
  async getDirectorySize(dirPath) {
    let size = 0;
    try {
      const items = await fs.readdir(dirPath);
      
      for (const item of items) {
        if (item === '.same' || item === 'node_modules') continue;
        
        const fullPath = path.join(dirPath, item);
        const stats = await fs.stat(fullPath);
        
        if (stats.isDirectory()) {
          size += await this.getDirectorySize(fullPath);
        } else {
          size += stats.size;
        }
      }
    } catch (error) {
      console.error('Error calculating directory size:', error);
    }
    
    return size;
  }
  
  async getProjectFileCount() {
    let count = 0;
    try {
      const countFiles = async (dirPath) => {
        const items = await fs.readdir(dirPath);
        
        for (const item of items) {
          if (item === '.same' || item === 'node_modules') continue;
          
          const fullPath = path.join(dirPath, item);
          const stats = await fs.stat(fullPath);
          
          if (stats.isDirectory()) {
            count += await countFiles(fullPath);
          } else {
            count++;
          }
        }
      };
      
      await countFiles(this.projectPath);
    } catch (error) {
      console.error('Error counting files:', error);
    }
    
    return count;
  }
  
  async updateVersionsList(versionInfo) {
    const versionsListPath = path.join(this.systemPath, 'versions.json');
    
    let versions = [];
    try {
      versions = JSON.parse(await fs.readFile(versionsListPath, 'utf8'));
    } catch (error) {
      versions = [];
    }
  
    versions.unshift(versionInfo);
    
    // الاحتفاظ بآخر 10 إصدارات فقط
    if (versions.length > 10) {
      versions = versions.slice(0, 10);
    }
    
    await fs.writeFile(versionsListPath, JSON.stringify(versions, null, 2));
  }
  
  async restoreVersion(versionId) {
    try {
      const versionPath = path.join(this.versionsPath, versionId);
      const versionInfoPath = path.join(versionPath, 'version.json');
      
      if (!await fs.pathExists(versionInfoPath)) {
        throw new Error(`الإصدار غير موجود: ${versionId}`);
      }
      
      const versionInfo = JSON.parse(await fs.readFile(versionInfoPath, 'utf8'));
      
      // إنشاء نسخة احتياطية من الحالة الحالية
      await this.createSnapshot('نسخة احتياطية قبل الاسترجاع');
      
      // استرجاع الإصدار
      const projectBackup = path.join(this.projectPath, 'backup');
      await fs.move(this.projectPath, projectBackup);
      await fs.copy(path.join(versionPath, 'project'), this.projectPath);
      
      // تحديث السجلات
      await this.updateHistory('restore', `تم استرجاع الإصدار: ${versionId}`);
      
      return { success: true, version: versionInfo };
    } catch (error) {
      console.error('Error restoring version:', error);
      throw error;
    }
  }
  
  async getVersionsList() {
    try {
      const versionsListPath = path.join(this.systemPath, 'versions.json');
      
      if (!await fs.pathExists(versionsListPath)) {
        return { success: true, versions: [] };
      }
      
      const versions = JSON.parse(await fs.readFile(versionsListPath, 'utf8'));
      return { success: true, versions };
    } catch (error) {
      console.error('Error getting versions list:', error);
      throw error;
    }
  }
  
  async deleteVersion(versionId) {
    try {
      const versionPath = path.join(this.versionsPath, versionId);
      
      if (!await fs.pathExists(versionPath)) {
        throw new Error(`الإصدار غير موجود: ${versionId}`);
      }
      
      await fs.remove(versionPath);
      
      // تحديث قائمة الإصدارات
      const versionsListPath = path.join(this.systemPath, 'versions.json');
      let versions = [];
      
      try {
        versions = JSON.parse(await fs.readFile(versionsListPath, 'utf8'));
      } catch (error) {
        versions = [];
      }
      
      versions = versions.filter(v => v.id !== versionId);
      await fs.writeFile(versionsListPath, JSON.stringify(versions, null, 2));
      
      // تحديث السجلات
      await this.updateHistory('delete', `تم حذف الإصدار: ${versionId}`);
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting version:', error);
      throw error;
    }
  }
  
  async compareVersions(versionId1, versionId2) {
    try {
      const version1Path = path.join(this.versionsPath, versionId1, 'project');
      const version2Path = path.join(this.versionsPath, versionId2, 'project');
      
      if (!await fs.pathExists(version1Path) || !await fs.pathExists(version2Path)) {
        throw new Error('أحد الإصدارات غير موجود');
      }
      
      const differences = await this.compareDirectories(version1Path, version2Path);
      
      return {
        success: true,
        version1: versionId1,
        version2: versionId2,
        differences
      };
    } catch (error) {
      console.error('Error comparing versions:', error);
      throw error;
    }
  }
  
  async compareDirectories(dir1, dir2, relativePath = '') {
    const differences = {
      added: [],
      modified: [],
      deleted: [],
      unchanged: []
    };
    
    try {
      const [items1, items2] = await Promise.all([
        fs.readdir(dir1).catch(() => []),
        fs.readdir(dir2).catch(() => [])
      ]);
      
      const allItems = new Set([...items1, ...items2]);
      
      for (const item of allItems) {
        if (item === '.same' || item === 'node_modules') continue;
        
        const itemPath1 = path.join(dir1, item);
        const itemPath2 = path.join(dir2, item);
        const relativeItemPath = path.join(relativePath, item);
        
        const [exists1, exists2] = await Promise.all([
          fs.pathExists(itemPath1),
          fs.pathExists(itemPath2)
        ]);
        
        if (exists1 && !exists2) {
          differences.deleted.push(relativeItemPath);
        } else if (!exists1 && exists2) {
          differences.added.push(relativeItemPath);
        } else if (exists1 && exists2) {
          const [stats1, stats2] = await Promise.all([
            fs.stat(itemPath1),
            fs.stat(itemPath2)
          ]);
          
          if (stats1.isDirectory() && stats2.isDirectory()) {
            const subDifferences = await this.compareDirectories(itemPath1, itemPath2, relativeItemPath);
            Object.keys(differences).forEach(key => {
              differences[key].push(...subDifferences[key]);
            });
          } else if (stats1.isFile() && stats2.isFile()) {
            if (stats1.size !== stats2.size || stats1.mtime.getTime() !== stats2.mtime.getTime()) {
              differences.modified.push(relativeItemPath);
            } else {
              differences.unchanged.push(relativeItemPath);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error comparing directories:', error);
    }
    
    return differences;
  }
  
  async updateHistory(action, description) {
    try {
      const historyFile = path.join(this.systemPath, 'history.md');
      const timestamp = new Date().toLocaleString('ar-SA');
      
      let history = '';
      try {
        history = await fs.readFile(historyFile, 'utf8');
      } catch (error) {
        history = '# سجل التغييرات\n\n';
      }
      
      const entry = `\n## ${action} - ${timestamp}\n- الإجراء: ${action}\n- الوصف: ${description}\n`;
      history += entry;
      
      await fs.writeFile(historyFile, history, 'utf8');
    } catch (error) {
      console.error('Error updating history:', error);
    }
  }
  
  async cleanupOldVersions(maxVersions = 5) {
    try {
      const versionsListPath = path.join(this.systemPath, 'versions.json');
      
      if (!await fs.pathExists(versionsListPath)) {
        return { success: true, deleted: 0 };
      }
      
      const versions = JSON.parse(await fs.readFile(versionsListPath, 'utf8'));
      
      if (versions.length <= maxVersions) {
        return { success: true, deleted: 0 };
      }
      
      const versionsToDelete = versions.slice(maxVersions);
      let deletedCount = 0;
      
      for (const version of versionsToDelete) {
        try {
          const versionPath = path.join(this.versionsPath, version.id);
          if (await fs.pathExists(versionPath)) {
            await fs.remove(versionPath);
            deletedCount++;
          }
        } catch (error) {
          console.error(`Error deleting version ${version.id}:`, error);
        }
      }
      
      // Update versions list
      const remainingVersions = versions.slice(0, maxVersions);
      await fs.writeFile(versionsListPath, JSON.stringify(remainingVersions, null, 2));
      
      await this.updateHistory('cleanup', `تم حذف ${deletedCount} إصدارات قديمة`);
      
      return { success: true, deleted: deletedCount };
    } catch (error) {
      console.error('Error cleaning up old versions:', error);
      throw error;
    }
  }
}

module.exports = VersionManager;