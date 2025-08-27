# AI Coding Assistant Scripts

This directory contains various scripts to help with development, deployment, and maintenance of the AI Coding Assistant.

## Available Scripts

### 1. `setup.sh` - Initial Setup Script

Automates the initial setup process for new installations.

**Usage:**
```bash
./scripts/setup.sh
```

**What it does:**
- Checks prerequisites (Node.js, npm, Docker)
- Creates necessary directories
- Installs all dependencies
- Builds components
- Sets up environment file
- Optionally sets up Docker services

**Prerequisites:**
- Node.js 18+
- npm
- Docker (optional)

### 2. `deploy.sh` - Deployment Script

Automates the deployment process for production environments.

**Usage:**
```bash
./scripts/deploy.sh [OPTIONS]
```

**Options:**
- `-h, --help` - Show help message
- `-e, --env ENV` - Deployment environment (default: production)
- `-t, --tag TAG` - Docker image tag (default: latest)
- `-r, --registry REG` - Docker registry URL
- `--rollback` - Rollback to previous deployment

**Examples:**
```bash
# Deploy with default settings
./scripts/deploy.sh

# Deploy staging with specific tag
./scripts/deploy.sh -e staging -t v1.0.0

# Rollback deployment
./scripts/deploy.sh --rollback
```

**What it does:**
- Checks deployment prerequisites
- Builds Docker image
- Deploys application
- Runs health checks
- Shows deployment information

**Prerequisites:**
- Docker
- Docker Compose
- `.env` file configured

## Environment Variables

The scripts use the following environment variables:

- `DEPLOYMENT_ENV` - Deployment environment
- `DOCKER_REGISTRY` - Docker registry URL
- `IMAGE_TAG` - Docker image tag

## Making Scripts Executable

If you encounter permission issues, make the scripts executable:

```bash
chmod +x scripts/*.sh
```

## Troubleshooting

### Script Permission Denied
```bash
chmod +x scripts/setup.sh
chmod +x scripts/deploy.sh
```

### Script Not Found
Make sure you're in the project root directory:
```bash
cd /path/to/ai-coding-assistant
./scripts/setup.sh
```

### Docker Not Found
Install Docker and Docker Compose:
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose

# macOS
brew install docker docker-compose

# Windows
# Download Docker Desktop from https://www.docker.com/products/docker-desktop
```

### Node.js Version Too Old
Install Node.js 18 or higher:
```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Using package manager
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS
brew install node@18
```

## Integration with Makefile

The scripts are integrated with the project's Makefile:

```bash
# Setup
make setup

# Deploy
make deploy

# Show all available commands
make help
```

## Customization

You can customize the scripts by modifying the configuration variables at the top of each script:

- Colors for output
- Default values
- Paths and directories
- Timeout values

## Contributing

When adding new scripts:

1. Follow the existing naming convention
2. Include proper error handling
3. Add colored output for better UX
4. Include help/usage information
5. Make scripts idempotent when possible
6. Add proper documentation

## Security Notes

- Scripts should not be run as root unless necessary
- Environment files contain sensitive information
- Docker images should be built from trusted base images
- Always review scripts before execution