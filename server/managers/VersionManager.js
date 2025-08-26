const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const { v4: uuidv4 } = require('uuid');

class VersionManager {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.projectDir = path.join(process.cwd(), 'projects', sessionId);
    this.versionsDir = path.join(this.projectDir, '.versions');
    this.versionsFile = path.join(this.versionsDir, 'versions.json');
  }

  /**
   * Initialize version control system
   */
  async initialize() {
    try {
      await fs.ensureDir(this.versionsDir);
      
      // Create versions file if it doesn't exist
      if (!await fs.pathExists(this.versionsFile)) {
        const initialVersions = {
          versions: [],
          currentVersion: null,
          lastSnapshot: null
        };
        await fs.writeFile(this.versionsFile, JSON.stringify(initialVersions, null, 2));
      }
      
      console.log(`Version control initialized for session: ${this.sessionId}`);
      return true;
    } catch (error) {
      console.error('Error initializing version control:', error);
      throw error;
    }
  }

  /**
   * Create a new version snapshot
   */
  async createSnapshot(description = '', metadata = {}) {
    try {
      await this.initialize();
      
      const versionId = uuidv4();
      const timestamp = new Date().toISOString();
      const versionDir = path.join(this.versionsDir, versionId);
      
      // Create version directory
      await fs.ensureDir(versionDir);
      
      // Copy project files to version directory
      await this.copyProjectFiles(versionDir);
      
      // Create version metadata
      const version = {
        id: versionId,
        description,
        timestamp,
        metadata,
        fileCount: await this.countFiles(versionDir),
        size: await this.calculateSize(versionDir),
        author: metadata.author || 'AI Assistant',
        tags: metadata.tags || []
      };
      
      // Update versions file
      await this.addVersion(version);
      
      console.log(`Version snapshot created: ${versionId}`);
      return { success: true, version };
    } catch (error) {
      console.error('Error creating snapshot:', error);
      throw error;
    }
  }

  /**
   * Copy project files to version directory
   */
  async copyProjectFiles(versionDir) {
    try {
      const srcDir = path.join(this.projectDir, 'src');
      
      if (await fs.pathExists(srcDir)) {
        await fs.copy(srcDir, path.join(versionDir, 'src'));
      }
      
      // Copy package.json if it exists
      const packageJsonPath = path.join(this.projectDir, 'package.json');
      if (await fs.pathExists(packageJsonPath)) {
        await fs.copy(packageJsonPath, path.join(versionDir, 'package.json'));
      }
      
      // Copy other important files
      const importantFiles = ['README.md', 'tsconfig.json', '.env', '.gitignore'];
      for (const file of importantFiles) {
        const filePath = path.join(this.projectDir, file);
        if (await fs.pathExists(filePath)) {
          await fs.copy(filePath, path.join(versionDir, file));
        }
      }
    } catch (error) {
      console.error('Error copying project files:', error);
      throw error;
    }
  }

  /**
   * Add version to versions file
   */
  async addVersion(version) {
    try {
      const versionsData = await this.readVersionsFile();
      versionsData.versions.push(version);
      versionsData.lastSnapshot = version.timestamp;
      
      await fs.writeFile(this.versionsFile, JSON.stringify(versionsData, null, 2));
    } catch (error) {
      console.error('Error adding version:', error);
      throw error;
    }
  }

  /**
   * Read versions file
   */
  async readVersionsFile() {
    try {
      const content = await fs.readFile(this.versionsFile, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.error('Error reading versions file:', error);
      return { versions: [], currentVersion: null, lastSnapshot: null };
    }
  }

  /**
   * List all versions
   */
  async listVersions() {
    try {
      await this.initialize();
      const versionsData = await this.readVersionsFile();
      return { success: true, versions: versionsData.versions };
    } catch (error) {
      console.error('Error listing versions:', error);
      throw error;
    }
  }

  /**
   * Get specific version
   */
  async getVersion(versionId) {
    try {
      const versionsData = await this.readVersionsFile();
      const version = versionsData.versions.find(v => v.id === versionId);
      
      if (!version) {
        throw new Error(`Version not found: ${versionId}`);
      }
      
      return { success: true, version };
    } catch (error) {
      console.error('Error getting version:', error);
      throw error;
    }
  }

  /**
   * Restore project to specific version
   */
  async restoreVersion(versionId) {
    try {
      const version = await this.getVersion(versionId);
      if (!version.success) {
        throw new Error('Version not found');
      }
      
      const versionDir = path.join(this.versionsDir, versionId);
      
      if (!await fs.pathExists(versionDir)) {
        throw new Error('Version files not found');
      }
      
      // Backup current state
      await this.createSnapshot('Backup before restore', { 
        type: 'backup',
        reason: 'restore_operation'
      });
      
      // Clear current src directory
      const srcDir = path.join(this.projectDir, 'src');
      if (await fs.pathExists(srcDir)) {
        await fs.remove(srcDir);
      }
      
      // Restore version files
      const versionSrcDir = path.join(versionDir, 'src');
      if (await fs.pathExists(versionSrcDir)) {
        await fs.copy(versionSrcDir, srcDir);
      }
      
      // Restore package.json
      const versionPackageJson = path.join(versionDir, 'package.json');
      if (await fs.pathExists(versionPackageJson)) {
        await fs.copy(versionPackageJson, path.join(this.projectDir, 'package.json'));
      }
      
      // Update current version
      await this.setCurrentVersion(versionId);
      
      console.log(`Project restored to version: ${versionId}`);
      return { success: true, version: version.version };
    } catch (error) {
      console.error('Error restoring version:', error);
      throw error;
    }
  }

  /**
   * Set current version
   */
  async setCurrentVersion(versionId) {
    try {
      const versionsData = await this.readVersionsFile();
      versionsData.currentVersion = versionId;
      await fs.writeFile(this.versionsFile, JSON.stringify(versionsData, null, 2));
    } catch (error) {
      console.error('Error setting current version:', error);
      throw error;
    }
  }

  /**
   * Compare two versions
   */
  async compareVersions(versionId1, versionId2) {
    try {
      const version1 = await this.getVersion(versionId1);
      const version2 = await this.getVersion(versionId2);
      
      if (!version1.success || !version2.success) {
        throw new Error('One or both versions not found');
      }
      
      const version1Dir = path.join(this.versionsDir, versionId1);
      const version2Dir = path.join(this.versionsDir, versionId2);
      
      const differences = await this.findDifferences(version1Dir, version2Dir);
      
      return {
        success: true,
        version1: version1.version,
        version2: version2.version,
        differences
      };
    } catch (error) {
      console.error('Error comparing versions:', error);
      throw error;
    }
  }

  /**
   * Find differences between two version directories
   */
  async findDifferences(dir1, dir2) {
    try {
      const files1 = await this.scanDirectory(dir1);
      const files2 = await this.scanDirectory(dir2);
      
      const differences = {
        added: [],
        removed: [],
        modified: [],
        unchanged: []
      };
      
      // Find added and modified files
      for (const file2 of files2) {
        const file1 = files1.find(f => f.relativePath === file2.relativePath);
        
        if (!file1) {
          differences.added.push(file2);
        } else if (file1.hash !== file2.hash) {
          differences.modified.push({
            file: file2.relativePath,
            oldHash: file1.hash,
            newHash: file2.hash,
            oldSize: file1.size,
            newSize: file2.size
          });
        } else {
          differences.unchanged.push(file2);
        }
      }
      
      // Find removed files
      for (const file1 of files1) {
        const file2 = files2.find(f => f.relativePath === file1.relativePath);
        if (!file2) {
          differences.removed.push(file1);
        }
      }
      
      return differences;
    } catch (error) {
      console.error('Error finding differences:', error);
      return { added: [], removed: [], modified: [], unchanged: [] };
    }
  }

  /**
   * Scan directory recursively
   */
  async scanDirectory(dir, baseDir = dir) {
    try {
      const files = [];
      const items = await fs.readdir(dir);
      
      for (const item of items) {
        if (item === '.versions') continue; // Skip versions directory
        
        const fullPath = path.join(dir, item);
        const relativePath = path.relative(baseDir, fullPath);
        const stats = await fs.stat(fullPath);
        
        if (stats.isDirectory()) {
          const subFiles = await this.scanDirectory(fullPath, baseDir);
          files.push(...subFiles);
        } else {
          const content = await fs.readFile(fullPath);
          const hash = this.simpleHash(content.toString());
          
          files.push({
            relativePath,
            size: stats.size,
            modified: stats.mtime,
            hash
          });
        }
      }
      
      return files;
    } catch (error) {
      console.error('Error scanning directory:', error);
      return [];
    }
  }

  /**
   * Simple hash function
   */
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  /**
   * Export version to archive
   */
  async exportVersion(versionId, format = 'zip') {
    try {
      const version = await this.getVersion(versionId);
      if (!version.success) {
        throw new Error('Version not found');
      }
      
      const versionDir = path.join(this.versionsDir, versionId);
      const exportPath = path.join(this.versionsDir, `${versionId}.${format}`);
      
      if (format === 'zip') {
        await this.createZipArchive(versionDir, exportPath);
      } else {
        throw new Error(`Export format not supported: ${format}`);
      }
      
      console.log(`Version exported: ${exportPath}`);
      return { success: true, exportPath };
    } catch (error) {
      console.error('Error exporting version:', error);
      throw error;
    }
  }

  /**
   * Create ZIP archive
   */
  async createZipArchive(sourceDir, outputPath) {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(outputPath);
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      output.on('close', () => resolve());
      archive.on('error', (err) => reject(err));
      
      archive.pipe(output);
      archive.directory(sourceDir, false);
      archive.finalize();
    });
  }

  /**
   * Delete version
   */
  async deleteVersion(versionId) {
    try {
      const versionsData = await this.readVersionsFile();
      const versionIndex = versionsData.versions.findIndex(v => v.id === versionId);
      
      if (versionIndex === -1) {
        throw new Error('Version not found');
      }
      
      // Remove version from list
      versionsData.versions.splice(versionIndex, 1);
      
      // Update versions file
      await fs.writeFile(this.versionsFile, JSON.stringify(versionsData, null, 2));
      
      // Remove version directory
      const versionDir = path.join(this.versionsDir, versionId);
      if (await fs.pathExists(versionDir)) {
        await fs.remove(versionDir);
      }
      
      console.log(`Version deleted: ${versionId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting version:', error);
      throw error;
    }
  }

  /**
   * Get version statistics
   */
  async getVersionStats() {
    try {
      const versionsData = await this.readVersionsFile();
      const versions = versionsData.versions;
      
      const stats = {
        totalVersions: versions.length,
        totalSize: versions.reduce((sum, v) => sum + (v.size || 0), 0),
        averageSize: versions.length > 0 ? 
          versions.reduce((sum, v) => sum + (v.size || 0), 0) / versions.length : 0,
        oldestVersion: versions.length > 0 ? 
          versions.reduce((oldest, v) => v.timestamp < oldest.timestamp ? v : oldest) : null,
        newestVersion: versions.length > 0 ? 
          versions.reduce((newest, v) => v.timestamp > newest.timestamp ? v : newest) : null,
        currentVersion: versionsData.currentVersion
      };
      
      return { success: true, stats };
    } catch (error) {
      console.error('Error getting version stats:', error);
      throw error;
    }
  }

  /**
   * Clean up old versions
   */
  async cleanupOldVersions(maxVersions = 10) {
    try {
      const versionsData = await this.readVersionsFile();
      const versions = versionsData.versions;
      
      if (versions.length <= maxVersions) {
        return { success: true, message: 'No cleanup needed' };
      }
      
      // Sort versions by timestamp (oldest first)
      versions.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      
      // Keep the most recent versions and current version
      const versionsToKeep = versions.slice(-maxVersions);
      const currentVersion = versionsData.currentVersion;
      
      if (currentVersion && !versionsToKeep.find(v => v.id === currentVersion)) {
        const currentVersionData = versions.find(v => v.id === currentVersion);
        if (currentVersionData) {
          versionsToKeep.unshift(currentVersionData);
        }
      }
      
      // Delete old versions
      const versionsToDelete = versions.filter(v => 
        !versionsToKeep.find(keep => keep.id === v.id)
      );
      
      for (const version of versionsToDelete) {
        await this.deleteVersion(version.id);
      }
      
      console.log(`Cleaned up ${versionsToDelete.length} old versions`);
      return { success: true, deletedCount: versionsToDelete.length };
    } catch (error) {
      console.error('Error cleaning up old versions:', error);
      throw error;
    }
  }

  /**
   * Count files in directory
   */
  async countFiles(dir) {
    try {
      let count = 0;
      const items = await fs.readdir(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stats = await fs.stat(fullPath);
        
        if (stats.isDirectory()) {
          count += await this.countFiles(fullPath);
        } else {
          count++;
        }
      }
      
      return count;
    } catch (error) {
      console.error('Error counting files:', error);
      return 0;
    }
  }

  /**
   * Calculate directory size
   */
  async calculateSize(dir) {
    try {
      let size = 0;
      const items = await fs.readdir(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stats = await fs.stat(fullPath);
        
        if (stats.isDirectory()) {
          size += await this.calculateSize(fullPath);
        } else {
          size += stats.size;
        }
      }
      
      return size;
    } catch (error) {
      console.error('Error calculating size:', error);
      return 0;
    }
  }
}

module.exports = VersionManager;