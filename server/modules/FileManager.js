const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const { promisify } = require('util');
const winston = require('winston');
const { exec } = require('child_process');

const execAsync = promisify(exec);
const globAsync = promisify(glob);

class FileManager {
  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.simple(),
      transports: [new winston.transports.Console()]
    });

    this.supportedExtensions = [
      '.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.html', '.json',
      '.md', '.txt', '.yml', '.yaml', '.env', '.gitignore'
    ];

    this.maxFileSize = 10 * 1024 * 1024; // 10MB
    this.maxReadLines = 1000; // Maximum lines to read at once
  }

  async readFile(projectPath, params = {}) {
    try {
      const { file, startLine, endLine, encoding = 'utf8' } = params;
      
      if (!file) {
        throw new Error('File path is required');
      }

      const fullPath = path.resolve(projectPath, file);
      
      // Security check: ensure file is within project directory
      if (!this.isPathSafe(projectPath, fullPath)) {
        throw new Error('Access denied: file path outside project directory');
      }

      // Check if file exists
      if (!await fs.pathExists(fullPath)) {
        throw new Error(`File not found: ${file}`);
      }

      // Check file size
      const stats = await fs.stat(fullPath);
      if (stats.size > this.maxFileSize) {
        throw new Error(`File too large: ${file} (${stats.size} bytes)`);
      }

      // Read file content
      let content = await fs.readFile(fullPath, encoding);
      
      // Handle line range if specified
      if (startLine !== undefined || endLine !== undefined) {
        const lines = content.split('\n');
        const start = startLine || 1;
        const end = endLine || lines.length;
        
        if (start < 1 || end > lines.length || start > end) {
          throw new Error('Invalid line range');
        }
        
        content = lines.slice(start - 1, end).join('\n');
      }

      // Log file read operation
      await this.logFileOperation(projectPath, 'read', file, {
        size: stats.size,
        lines: content.split('\n').length,
        startLine,
        endLine
      });

      return {
        file,
        content,
        size: stats.size,
        lines: content.split('\n').length,
        encoding,
        lastModified: stats.mtime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Error reading file:', error);
      throw error;
    }
  }

  async editFile(projectPath, params = {}) {
    try {
      const { file, content, operation = 'replace', search, replace, line, position } = params;
      
      if (!file) {
        throw new Error('File path is required');
      }

      const fullPath = path.resolve(projectPath, file);
      
      // Security check
      if (!this.isPathSafe(projectPath, fullPath)) {
        throw new Error('Access denied: file path outside project directory');
      }

      // Ensure directory exists
      await fs.ensureDir(path.dirname(fullPath));

      let newContent;
      let originalContent = '';

      if (await fs.pathExists(fullPath)) {
        originalContent = await fs.readFile(fullPath, 'utf8');
      }

      switch (operation) {
        case 'replace':
          newContent = content;
          break;
          
        case 'append':
          newContent = originalContent + '\n' + content;
          break;
          
        case 'prepend':
          newContent = content + '\n' + originalContent;
          break;
          
        case 'insert':
          if (line !== undefined) {
            const lines = originalContent.split('\n');
            if (line < 1 || line > lines.length + 1) {
              throw new Error('Invalid line number for insert operation');
            }
            lines.splice(line - 1, 0, content);
            newContent = lines.join('\n');
          } else if (position !== undefined) {
            newContent = originalContent.slice(0, position) + content + originalContent.slice(position);
          } else {
            throw new Error('Line or position required for insert operation');
          }
          break;
          
        case 'replace_text':
          if (!search || !replace) {
            throw new Error('Search and replace text required');
          }
          newContent = originalContent.replace(new RegExp(search, 'g'), replace);
          break;
          
        case 'delete_lines':
          if (line === undefined) {
            throw new Error('Line number required for delete operation');
          }
          const lines = originalContent.split('\n');
          if (line < 1 || line > lines.length) {
            throw new Error('Invalid line number for delete operation');
          }
          lines.splice(line - 1, 1);
          newContent = lines.join('\n');
          break;
          
        default:
          throw new Error(`Unknown operation: ${operation}`);
      }

      // Write file
      await fs.writeFile(fullPath, newContent, 'utf8');

      // Log file edit operation
      await this.logFileOperation(projectPath, 'edit', file, {
        operation,
        originalSize: originalContent.length,
        newSize: newContent.length,
        changes: newContent.length - originalContent.length
      });

      return {
        file,
        operation,
        success: true,
        originalSize: originalContent.length,
        newSize: newContent.length,
        changes: newContent.length - originalContent.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Error editing file:', error);
      throw error;
    }
  }

  async createFile(projectPath, params = {}) {
    try {
      const { file, content = '', encoding = 'utf8' } = params;
      
      if (!file) {
        throw new Error('File path is required');
      }

      const fullPath = path.resolve(projectPath, file);
      
      // Security check
      if (!this.isPathSafe(projectPath, fullPath)) {
        throw new Error('Access denied: file path outside project directory');
      }

      // Check if file already exists
      if (await fs.pathExists(fullPath)) {
        throw new Error(`File already exists: ${file}`);
      }

      // Ensure directory exists
      await fs.ensureDir(path.dirname(fullPath));

      // Write file
      await fs.writeFile(fullPath, content, encoding);

      // Log file creation
      await this.logFileOperation(projectPath, 'create', file, {
        size: content.length,
        encoding
      });

      return {
        file,
        success: true,
        size: content.length,
        encoding,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Error creating file:', error);
      throw error;
    }
  }

  async deleteFile(projectPath, params = {}) {
    try {
      const { file } = params;
      
      if (!file) {
        throw new Error('File path is required');
      }

      const fullPath = path.resolve(projectPath, file);
      
      // Security check
      if (!this.isPathSafe(projectPath, fullPath)) {
        throw new Error('Access denied: file path outside project directory');
      }

      // Check if file exists
      if (!await fs.pathExists(fullPath)) {
        throw new Error(`File not found: ${file}`);
      }

      // Get file stats before deletion
      const stats = await fs.stat(fullPath);

      // Delete file
      await fs.remove(fullPath);

      // Log file deletion
      await this.logFileOperation(projectPath, 'delete', file, {
        size: stats.size,
        lastModified: stats.mtime
      });

      return {
        file,
        success: true,
        deletedSize: stats.size,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Error deleting file:', error);
      throw error;
    }
  }

  async listFiles(projectPath, params = {}) {
    try {
      const { pattern = '**/*', includeHidden = false, maxDepth = 10 } = params;
      
      // Security check for pattern
      if (pattern.includes('..') || pattern.startsWith('/')) {
        throw new Error('Invalid pattern: contains path traversal');
      }

      const globPattern = includeHidden ? pattern : `!(${pattern})`;
      const options = {
        cwd: projectPath,
        dot: includeHidden,
        maxDepth,
        ignore: includeHidden ? [] : ['**/node_modules/**', '**/.git/**', '**/.same/**']
      };

      const files = await globAsync(globPattern, options);
      
      const fileList = [];
      
      for (const file of files) {
        try {
          const fullPath = path.join(projectPath, file);
          const stats = await fs.stat(fullPath);
          
          fileList.push({
            name: file,
            path: file,
            isDirectory: stats.isDirectory(),
            size: stats.size,
            lastModified: stats.mtime,
            permissions: stats.mode.toString(8)
          });
        } catch (error) {
          this.logger.warn(`Error getting stats for file: ${file}`, error);
        }
      }

      // Sort files: directories first, then by name
      fileList.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });

      return {
        files: fileList,
        count: fileList.length,
        pattern,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Error listing files:', error);
      throw error;
    }
  }

  async searchFiles(projectPath, params = {}) {
    try {
      const { query, pattern = '**/*', caseSensitive = false, regex = false } = params;
      
      if (!query) {
        throw new Error('Search query is required');
      }

      const files = await this.listFiles(projectPath, { pattern });
      const results = [];

      for (const file of files.files) {
        if (file.isDirectory) continue;

        try {
          const content = await this.readFile(projectPath, { file: file.path });
          
          let matches = [];
          if (regex) {
            const regexObj = new RegExp(query, caseSensitive ? 'g' : 'gi');
            const matches_array = content.content.match(regexObj);
            if (matches_array) {
              matches = matches_array.map((match, index) => ({
                match,
                index: content.content.indexOf(match, index > 0 ? content.content.indexOf(match, index - 1) + 1 : 0)
              }));
            }
          } else {
            const searchText = caseSensitive ? query : query.toLowerCase();
            const fileContent = caseSensitive ? content.content : content.content.toLowerCase();
            
            let index = fileContent.indexOf(searchText);
            while (index !== -1) {
              matches.push({
                match: content.content.substring(index, index + query.length),
                index
              });
              index = fileContent.indexOf(searchText, index + 1);
            }
          }

          if (matches.length > 0) {
            results.push({
              file: file.path,
              matches: matches.slice(0, 10), // Limit to 10 matches per file
              totalMatches: matches.length
            });
          }
        } catch (error) {
          this.logger.warn(`Error searching in file: ${file.path}`, error);
        }
      }

      return {
        query,
        results,
        totalFiles: results.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Error searching files:', error);
      throw error;
    }
  }

  async runLinter(projectPath) {
    try {
      const packageJsonPath = path.join(projectPath, 'package.json');
      
      if (!await fs.pathExists(packageJsonPath)) {
        return {
          success: false,
          error: 'No package.json found',
          timestamp: new Date().toISOString()
        };
      }

      const packageJson = await fs.readJson(packageJsonPath);
      const scripts = packageJson.scripts || {};
      
      let lintCommand = null;
      
      // Try to find lint script
      if (scripts.lint) {
        lintCommand = 'npm run lint';
      } else if (scripts.eslint) {
        lintCommand = 'npm run eslint';
      } else if (scripts.check) {
        lintCommand = 'npm run check';
      } else {
        // Try common linting tools
        const commonLinters = ['eslint', 'tsc', 'prettier --check'];
        
        for (const linter of commonLinters) {
          try {
            await execAsync(`cd "${projectPath}" && ${linter} --version`);
            lintCommand = linter;
            break;
          } catch (error) {
            // Linter not available, try next
            continue;
          }
        }
      }

      if (!lintCommand) {
        return {
          success: false,
          error: 'No linting tool found',
          timestamp: new Date().toISOString()
        };
      }

      // Run linter
      const { stdout, stderr } = await execAsync(`cd "${projectPath}" && ${lintCommand}`, {
        timeout: 30000 // 30 seconds timeout
      });

      // Parse linting results
      const issues = this.parseLintOutput(stdout, stderr);

      // Log linting operation
      await this.logFileOperation(projectPath, 'lint', 'project', {
        command: lintCommand,
        issues: issues.length,
        errors: issues.filter(i => i.type === 'error').length,
        warnings: issues.filter(i => i.type === 'warning').length
      });

      return {
        success: true,
        command: lintCommand,
        issues,
        totalIssues: issues.length,
        errors: issues.filter(i => i.type === 'error').length,
        warnings: issues.filter(i => i.type === 'warning').length,
        output: stdout,
        errors: stderr,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Error running linter:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  parseLintOutput(stdout, stderr) {
    const issues = [];
    const lines = (stdout + stderr).split('\n');
    
    for (const line of lines) {
      // Common linting output patterns
      const patterns = [
        // ESLint pattern: file:line:column: message (severity)
        /^(.+):(\d+):(\d+):\s*(.+?)\s*\((.+)\)$/,
        // TypeScript pattern: file(line,col): message
        /^(.+)\((\d+),(\d+)\):\s*(.+)$/,
        // Prettier pattern: file
        /^(.+)$/
      ];
      
      for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match) {
          issues.push({
            file: match[1],
            line: parseInt(match[2]) || 0,
            column: parseInt(match[3]) || 0,
            message: match[4] || match[1],
            type: line.includes('error') ? 'error' : 'warning'
          });
          break;
        }
      }
    }
    
    return issues;
  }

  isPathSafe(projectPath, targetPath) {
    const normalizedProjectPath = path.resolve(projectPath);
    const normalizedTargetPath = path.resolve(targetPath);
    
    return normalizedTargetPath.startsWith(normalizedProjectPath);
  }

  async logFileOperation(projectPath, operation, file, details = {}) {
    try {
      const logEntry = `## ${new Date().toISOString()}\n\n**Operation:** ${operation}\n**File:** ${file}\n**Details:** ${JSON.stringify(details, null, 2)}\n\n---\n\n`;
      
      const historyPath = path.join(projectPath, '.same', 'history.md');
      await fs.appendFile(historyPath, logEntry);
    } catch (error) {
      this.logger.error('Error logging file operation:', error);
    }
  }

  async getFileStats(projectPath, file) {
    try {
      const fullPath = path.resolve(projectPath, file);
      
      if (!this.isPathSafe(projectPath, fullPath)) {
        throw new Error('Access denied: file path outside project directory');
      }

      if (!await fs.pathExists(fullPath)) {
        throw new Error(`File not found: ${file}`);
      }

      const stats = await fs.stat(fullPath);
      
      return {
        file,
        size: stats.size,
        isDirectory: stats.isDirectory(),
        isFile: stats.isFile(),
        lastModified: stats.mtime,
        created: stats.birthtime,
        permissions: stats.mode.toString(8),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Error getting file stats:', error);
      throw error;
    }
  }

  async copyFile(projectPath, params = {}) {
    try {
      const { source, destination } = params;
      
      if (!source || !destination) {
        throw new Error('Source and destination are required');
      }

      const sourcePath = path.resolve(projectPath, source);
      const destPath = path.resolve(projectPath, destination);
      
      // Security checks
      if (!this.isPathSafe(projectPath, sourcePath) || !this.isPathSafe(projectPath, destPath)) {
        throw new Error('Access denied: file path outside project directory');
      }

      if (!await fs.pathExists(sourcePath)) {
        throw new Error(`Source file not found: ${source}`);
      }

      // Ensure destination directory exists
      await fs.ensureDir(path.dirname(destPath));

      // Copy file
      await fs.copy(sourcePath, destPath);

      // Log operation
      await this.logFileOperation(projectPath, 'copy', `${source} -> ${destination}`, {
        source,
        destination
      });

      return {
        source,
        destination,
        success: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Error copying file:', error);
      throw error;
    }
  }

  async moveFile(projectPath, params = {}) {
    try {
      const { source, destination } = params;
      
      if (!source || !destination) {
        throw new Error('Source and destination are required');
      }

      const sourcePath = path.resolve(projectPath, source);
      const destPath = path.resolve(projectPath, destination);
      
      // Security checks
      if (!this.isPathSafe(projectPath, sourcePath) || !this.isPathSafe(projectPath, destPath)) {
        throw new Error('Access denied: file path outside project directory');
      }

      if (!await fs.pathExists(sourcePath)) {
        throw new Error(`Source file not found: ${source}`);
      }

      // Ensure destination directory exists
      await fs.ensureDir(path.dirname(destPath));

      // Move file
      await fs.move(sourcePath, destPath);

      // Log operation
      await this.logFileOperation(projectPath, 'move', `${source} -> ${destination}`, {
        source,
        destination
      });

      return {
        source,
        destination,
        success: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Error moving file:', error);
      throw error;
    }
  }
}

module.exports = FileManager;