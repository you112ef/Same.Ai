# AI Coding Assistant Makefile
# Make targets for development, testing, and deployment

.PHONY: help install dev build test lint format clean docker docker-compose deploy

# Default target
help:
	@echo "AI Coding Assistant - Available Commands:"
	@echo ""
	@echo "Development:"
	@echo "  install     Install all dependencies"
	@echo "  dev         Start development server"
	@echo "  build       Build the application"
	@echo "  start       Start production server"
	@echo ""
	@echo "Testing:"
	@echo "  test        Run all tests"
	@echo "  test:watch  Run tests in watch mode"
	@echo "  test:cov    Run tests with coverage"
	@echo ""
	@echo "Code Quality:"
	@echo "  lint        Run ESLint"
	@echo "  lint:fix    Fix ESLint issues"
	@echo "  format      Format code with Prettier"
	@echo ""
	@echo "Docker:"
	@echo "  docker:build    Build Docker image"
	@echo "  docker:run      Run Docker container"
	@echo "  docker:compose  Start with Docker Compose"
	@echo "  docker:stop     Stop Docker Compose"
	@echo ""
	@echo "Maintenance:"
	@echo "  clean       Clean build artifacts"
	@echo "  logs        View application logs"
	@echo "  health      Check application health"

# Development
install:
	@echo "Installing dependencies..."
	npm run install:all

dev:
	@echo "Starting development server..."
	npm run dev

build:
	@echo "Building application..."
	npm run build:all

start:
	@echo "Starting production server..."
	npm start

# Testing
test:
	@echo "Running tests..."
	npm test

test:watch:
	@echo "Running tests in watch mode..."
	npm run test:watch

test:cov:
	@echo "Running tests with coverage..."
	npm run test:coverage

# Code Quality
lint:
	@echo "Running ESLint..."
	npm run lint

lint:fix:
	@echo "Fixing ESLint issues..."
	npm run lint:fix

format:
	@echo "Formatting code with Prettier..."
	npm run format

# Docker
docker:build:
	@echo "Building Docker image..."
	npm run docker:build

docker:run:
	@echo "Running Docker container..."
	npm run docker:run

docker:compose:
	@echo "Starting with Docker Compose..."
	npm run docker:compose

docker:stop:
	@echo "Stopping Docker Compose..."
	npm run docker:compose:down

# Maintenance
clean:
	@echo "Cleaning build artifacts..."
	npm run clean:all

logs:
	@echo "Viewing application logs..."
	npm run logs

health:
	@echo "Checking application health..."
	npm run health

# Database
db:start:
	@echo "Starting database..."
	docker-compose up -d postgres redis

db:stop:
	@echo "Stopping database..."
	docker-compose stop postgres redis

db:reset:
	@echo "Resetting database..."
	docker-compose down -v postgres redis
	docker-compose up -d postgres redis

# Monitoring
monitor:start:
	@echo "Starting monitoring services..."
	docker-compose up -d prometheus grafana elasticsearch kibana

monitor:stop:
	@echo "Stopping monitoring services..."
	docker-compose stop prometheus grafana elasticsearch kibana

# Production
prod:build:
	@echo "Building production image..."
	docker build --target production -t ai-coding-assistant:prod .

prod:run:
	@echo "Running production container..."
	docker run -d \
		-p 3000:3000 \
		-e NODE_ENV=production \
		-e OPENAI_API_KEY=$${OPENAI_API_KEY} \
		--name ai-coding-assistant-prod \
		ai-coding-assistant:prod

prod:stop:
	@echo "Stopping production container..."
	docker stop ai-coding-assistant-prod
	docker rm ai-coding-assistant-prod

# Development Environment
env:setup:
	@echo "Setting up development environment..."
	cp .env.example .env
	@echo "Please edit .env file with your configuration"

env:check:
	@echo "Checking environment variables..."
	@if [ -f .env ]; then \
		echo "Environment file exists"; \
		echo "Required variables:"; \
		grep -E "^[A-Z_]+=" .env.example | cut -d'=' -f1 | sort; \
	else \
		echo "Environment file not found. Run 'make env:setup'"; \
	fi

# Git Hooks
hooks:install:
	@echo "Installing Git hooks..."
	@if [ -d .git ]; then \
		cp scripts/hooks/* .git/hooks/; \
		chmod +x .git/hooks/*; \
		echo "Git hooks installed successfully"; \
	else \
		echo "Not a Git repository"; \
	fi

# Security
security:audit:
	@echo "Running security audit..."
	npm audit

security:fix:
	@echo "Fixing security vulnerabilities..."
	npm audit fix

# Backup
backup:
	@echo "Creating backup..."
	@timestamp=$$(date +%Y%m%d_%H%M%S); \
	tar -czf "backup_$${timestamp}.tar.gz" \
		--exclude=node_modules \
		--exclude=.git \
		--exclude=dist \
		--exclude=coverage \
		--exclude=logs \
		--exclude=projects \
		.; \
	echo "Backup created: backup_$${timestamp}.tar.gz"

# Quick Start
quickstart: env:setup install db:start dev
	@echo "Quick start completed!"
	@echo "Application should be running at http://localhost:3000"

# Full Setup
setup: env:setup install hooks:install db:start monitor:start
	@echo "Full setup completed!"
	@echo "Application: http://localhost:3000"
	@echo "Frontend: http://localhost:3001"
	@echo "Grafana: http://localhost:3002"
	@echo "Prometheus: http://localhost:9090"
	@echo "Kibana: http://localhost:5601"

# Cleanup
cleanup: docker:stop db:stop monitor:stop
	@echo "Cleaning up containers..."
	docker system prune -f
	@echo "Cleanup completed!"

# Help for specific targets
install:help:
	@echo "Install target: Installs all dependencies for backend and frontend"
	@echo "Usage: make install"

dev:help:
	@echo "Dev target: Starts development server with hot reload"
	@echo "Usage: make dev"

docker:help:
	@echo "Docker targets: Manage Docker containers and services"
	@echo "Usage: make docker:build, make docker:run, make docker:compose"