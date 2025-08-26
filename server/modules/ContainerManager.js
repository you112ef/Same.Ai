const Docker = require('dockerode');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class ContainerManager {
  constructor() {
    this.docker = new Docker();
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.simple(),
      transports: [new winston.transports.Console()]
    });
    
    this.activeContainers = new Map();
    this.baseImage = 'node:18-alpine';
    this.workspacePath = process.env.WORKSPACE_PATH || '/workspace';
    
    this.init();
  }

  async init() {
    try {
      // Ensure workspace directory exists
      await fs.ensureDir(this.workspacePath);
      
      // Pull base image if not exists
      await this.ensureBaseImage();
      
      this.logger.info('ContainerManager initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize ContainerManager:', error);
      throw error;
    }
  }

  async ensureBaseImage() {
    try {
      const images = await this.docker.listImages();
      const baseImageExists = images.some(img => 
        img.RepoTags && img.RepoTags.includes(this.baseImage)
      );
      
      if (!baseImageExists) {
        this.logger.info(`Pulling base image: ${this.baseImage}`);
        await this.docker.pull(this.baseImage);
      }
    } catch (error) {
      this.logger.error('Error ensuring base image:', error);
      throw error;
    }
  }

  async createContainer(sessionId) {
    try {
      const containerId = `ai-assistant-${sessionId}`;
      const projectPath = path.join(this.workspacePath, sessionId);
      
      // Create project directory
      await fs.ensureDir(projectPath);
      
      // Create .same directory for internal files
      const sameDir = path.join(projectPath, '.same');
      await fs.ensureDir(sameDir);
      
      // Initialize internal files
      await this.initializeInternalFiles(sameDir);
      
      // Create Docker container
      const container = await this.docker.createContainer({
        Image: this.baseImage,
        name: containerId,
        Hostname: containerId,
        WorkingDir: '/app',
        Env: [
          'NODE_ENV=development',
          'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'
        ],
        Cmd: ['tail', '-f', '/dev/null'], // Keep container running
        HostConfig: {
          Binds: [
            `${projectPath}:/app`,
            '/var/run/docker.sock:/var/run/docker.sock:ro'
          ],
          Memory: 512 * 1024 * 1024, // 512MB
          MemorySwap: 1024 * 1024 * 1024, // 1GB
          CpuShares: 512,
          SecurityOpt: ['no-new-privileges'],
          CapDrop: ['ALL'],
          NetworkMode: 'bridge',
          PortBindings: {
            '3000/tcp': [{ HostPort: this.getAvailablePort().toString() }],
            '5173/tcp': [{ HostPort: this.getAvailablePort().toString() }]
          }
        },
        Labels: {
          'ai-assistant.session': sessionId,
          'ai-assistant.created': new Date().toISOString()
        }
      });

      // Start container
      await container.start();
      
      // Install essential tools
      await this.installTools(container);
      
      const containerInfo = {
        id: container.id,
        name: containerId,
        sessionId,
        projectPath,
        status: 'running',
        createdAt: new Date(),
        ports: await this.getContainerPorts(container)
      };
      
      this.activeContainers.set(sessionId, containerInfo);
      
      this.logger.info(`Container created: ${containerId} for session: ${sessionId}`);
      
      return containerInfo;
    } catch (error) {
      this.logger.error('Error creating container:', error);
      throw error;
    }
  }

  async initializeInternalFiles(sameDir) {
    const files = {
      'todos.md': '# مهام المشروع\n\n## المهام المنجزة\n\n## المهام المعلقة\n\n',
      'wiki.md': '# دليل المشروع\n\n## معلومات المشروع\n\n## التعليمات\n\n',
      'history.md': '# سجل التعديلات\n\n',
      'logs.md': '# سجل التنفيذ\n\n',
      'settings.json': JSON.stringify({
        language: 'ar',
        projectType: 'nextjs',
        integrations: {},
        preferences: {}
      }, null, 2)
    };

    for (const [filename, content] of Object.entries(files)) {
      await fs.writeFile(path.join(sameDir, filename), content, 'utf8');
    }
  }

  async installTools(container) {
    try {
      const commands = [
        'apk update',
        'apk add --no-cache git curl wget unzip',
        'npm install -g bun',
        'npm install -g @types/node typescript'
      ];

      for (const command of commands) {
        await this.executeCommandInContainer(container, command);
      }
      
      this.logger.info('Tools installed successfully in container');
    } catch (error) {
      this.logger.error('Error installing tools:', error);
      // Don't throw error, continue with basic functionality
    }
  }

  async executeCommand(containerId, command) {
    try {
      const containerInfo = this.activeContainers.get(containerId);
      if (!containerInfo) {
        throw new Error('Container not found');
      }

      const container = this.docker.getContainer(containerInfo.id);
      
      // Validate command for security
      if (!this.isCommandSafe(command)) {
        throw new Error('Command not allowed for security reasons');
      }

      const result = await this.executeCommandInContainer(container, command);
      
      // Log command execution
      await this.logCommandExecution(containerInfo.sessionId, command, result);
      
      return {
        command,
        output: result.stdout,
        error: result.stderr,
        exitCode: result.exitCode,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Error executing command:', error);
      throw error;
    }
  }

  async executeCommandInContainer(container, command) {
    return new Promise((resolve, reject) => {
      container.exec({
        Cmd: ['sh', '-c', command],
        AttachStdout: true,
        AttachStderr: true,
        WorkingDir: '/app'
      }, (err, exec) => {
        if (err) {
          reject(err);
          return;
        }

        exec.start((err, stream) => {
          if (err) {
            reject(err);
            return;
          }

          let stdout = '';
          let stderr = '';

          stream.on('data', (chunk) => {
            const output = chunk.toString();
            if (chunk[0] === 1) {
              stdout += output;
            } else {
              stderr += output;
            }
          });

          stream.on('end', () => {
            exec.inspect((err, info) => {
              if (err) {
                reject(err);
                return;
              }
              resolve({
                stdout,
                stderr,
                exitCode: info.ExitCode
              });
            });
          });
        });
      });
    });
  }

  isCommandSafe(command) {
    const dangerousCommands = [
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
      'groupdel'
    ];

    const lowerCommand = command.toLowerCase();
    return !dangerousCommands.some(dangerous => lowerCommand.includes(dangerous));
  }

  async getContainerPorts(container) {
    try {
      const info = await container.inspect();
      const ports = {};
      
      if (info.NetworkSettings.Ports) {
        for (const [containerPort, hostBindings] of Object.entries(info.NetworkSettings.Ports)) {
          if (hostBindings && hostBindings.length > 0) {
            ports[containerPort] = hostBindings[0].HostPort;
          }
        }
      }
      
      return ports;
    } catch (error) {
      this.logger.error('Error getting container ports:', error);
      return {};
    }
  }

  async logCommandExecution(sessionId, command, result) {
    try {
      const containerInfo = this.activeContainers.get(sessionId);
      if (!containerInfo) return;

      const logEntry = `## ${new Date().toISOString()}\n\n**Command:** \`${command}\`\n\n**Exit Code:** ${result.exitCode}\n\n**Output:**\n\`\`\`\n${result.stdout}\n\`\`\`\n\n**Errors:**\n\`\`\`\n${result.stderr}\n\`\`\`\n\n---\n\n`;
      
      const logsPath = path.join(containerInfo.projectPath, '.same', 'logs.md');
      await fs.appendFile(logsPath, logEntry);
    } catch (error) {
      this.logger.error('Error logging command execution:', error);
    }
  }

  async cleanupContainer(containerId) {
    try {
      const containerInfo = this.activeContainers.get(containerId);
      if (!containerInfo) {
        this.logger.warn(`Container info not found for cleanup: ${containerId}`);
        return;
      }

      const container = this.docker.getContainer(containerInfo.id);
      
      // Stop container
      try {
        await container.stop({ t: 10 }); // 10 second timeout
      } catch (error) {
        this.logger.warn(`Error stopping container: ${error.message}`);
      }

      // Remove container
      try {
        await container.remove({ force: true });
      } catch (error) {
        this.logger.warn(`Error removing container: ${error.message}`);
      }

      // Clean up project directory
      try {
        await fs.remove(containerInfo.projectPath);
      } catch (error) {
        this.logger.warn(`Error removing project directory: ${error.message}`);
      }

      // Remove from active containers
      this.activeContainers.delete(containerId);
      
      this.logger.info(`Container cleaned up: ${containerInfo.name}`);
    } catch (error) {
      this.logger.error('Error cleaning up container:', error);
      throw error;
    }
  }

  async getContainerStatus(containerId) {
    try {
      const containerInfo = this.activeContainers.get(containerId);
      if (!containerInfo) {
        return { status: 'not_found' };
      }

      const container = this.docker.getContainer(containerInfo.id);
      const info = await container.inspect();
      
      return {
        id: containerInfo.id,
        name: containerInfo.name,
        status: info.State.Status,
        running: info.State.Running,
        ports: await this.getContainerPorts(container),
        createdAt: containerInfo.createdAt,
        projectPath: containerInfo.projectPath
      };
    } catch (error) {
      this.logger.error('Error getting container status:', error);
      return { status: 'error', error: error.message };
    }
  }

  async listContainers() {
    const containers = [];
    
    for (const [sessionId, containerInfo] of this.activeContainers.entries()) {
      const status = await this.getContainerStatus(sessionId);
      containers.push({
        sessionId,
        ...status
      });
    }
    
    return containers;
  }

  getAvailablePort() {
    // Simple port allocation (in production, use a proper port manager)
    const basePort = 3000;
    const usedPorts = new Set();
    
    for (const containerInfo of this.activeContainers.values()) {
      if (containerInfo.ports) {
        Object.values(containerInfo.ports).forEach(port => usedPorts.add(parseInt(port)));
      }
    }
    
    let port = basePort;
    while (usedPorts.has(port)) {
      port++;
    }
    
    return port;
  }

  async getContainerLogs(containerId, lines = 100) {
    try {
      const containerInfo = this.activeContainers.get(containerId);
      if (!containerInfo) {
        throw new Error('Container not found');
      }

      const container = this.docker.getContainer(containerInfo.id);
      const logs = await container.logs({
        stdout: true,
        stderr: true,
        tail: lines
      });

      return logs.toString('utf8');
    } catch (error) {
      this.logger.error('Error getting container logs:', error);
      throw error;
    }
  }

  async restartContainer(containerId) {
    try {
      const containerInfo = this.activeContainers.get(containerId);
      if (!containerInfo) {
        throw new Error('Container not found');
      }

      const container = this.docker.getContainer(containerInfo.id);
      await container.restart();
      
      this.logger.info(`Container restarted: ${containerInfo.name}`);
      return { success: true };
    } catch (error) {
      this.logger.error('Error restarting container:', error);
      throw error;
    }
  }

  async getResourceUsage(containerId) {
    try {
      const containerInfo = this.activeContainers.get(containerId);
      if (!containerInfo) {
        throw new Error('Container not found');
      }

      const container = this.docker.getContainer(containerInfo.id);
      const stats = await container.stats({ stream: false });
      
      return {
        cpu: stats.cpu_stats,
        memory: stats.memory_stats,
        network: stats.networks,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Error getting resource usage:', error);
      throw error;
    }
  }

  async cleanupAllContainers() {
    const cleanupPromises = [];
    
    for (const [sessionId, containerInfo] of this.activeContainers.entries()) {
      cleanupPromises.push(this.cleanupContainer(sessionId));
    }
    
    await Promise.allSettled(cleanupPromises);
    this.logger.info('All containers cleaned up');
  }
}

module.exports = ContainerManager;