# AI Coding Assistant Makefile

.PHONY: help install build start dev clean docker-build docker-up docker-down test lint format

# Default target
help:
	@echo "AI Coding Assistant - Available commands:"
	@echo ""
	@echo "Installation:"
	@echo "  install          Install all dependencies"
	@echo "  install-backend  Install backend dependencies only"
	@echo "  install-frontend Install frontend dependencies only"
	@echo ""
	@echo "Development:"
	@echo "  dev              Start development servers (backend + frontend)"
	@echo "  dev-backend      Start backend development server only"
	@echo "  dev-frontend     Start frontend development server only"
	@echo ""
	@echo "Building:"
	@echo "  build            Build all components"
	@echo "  build-backend    Build backend only"
	@echo "  build-frontend   Build frontend only"
	@echo ""
	@echo "Production:"
	@echo "  start            Start production server"
	@echo "  start-backend    Start production backend server"
	@echo ""
	@echo "Docker:"
	@echo "  docker-build     Build Docker image"
	@echo "  docker-up        Start Docker services"
	@echo "  docker-down      Stop Docker services"
	@echo "  docker-logs      Show Docker logs"
	@echo ""
	@echo "Maintenance:"
	@echo "  clean            Clean build artifacts and dependencies"
	@echo "  test             Run tests"
	@echo "  lint             Run linting"
	@echo "  format           Format code"
	@echo "  logs             Show application logs"

# Installation
install:
	@echo "Installing all dependencies..."
	npm run install:all

install-backend:
	@echo "Installing backend dependencies..."
	npm install

install-frontend:
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

# Development
dev:
	@echo "Starting development servers..."
	npm run dev:all

dev-backend:
	@echo "Starting backend development server..."
	npm run dev

dev-frontend:
	@echo "Starting frontend development server..."
	cd frontend && npm start

# Building
build:
	@echo "Building all components..."
	npm run build:all

build-backend:
	@echo "Building backend..."
	npm run build

build-frontend:
	@echo "Building frontend..."
	cd frontend && npm run build

# Production
start:
	@echo "Starting production server..."
	npm start

start-backend:
	@echo "Starting production backend server..."
	npm start

# Docker
docker-build:
	@echo "Building Docker image..."
	docker build -t ai-coding-assistant .

docker-up:
	@echo "Starting Docker services..."
	docker-compose up -d

docker-down:
	@echo "Stopping Docker services..."
	docker-compose down

docker-logs:
	@echo "Showing Docker logs..."
	docker-compose logs -f

# Maintenance
clean:
	@echo "Cleaning build artifacts and dependencies..."
	rm -rf node_modules
	rm -rf frontend/node_modules
	rm -rf shared/node_modules
	rm -rf dist
	rm -rf frontend/build
	rm -rf shared/dist
	rm -rf logs
	rm -rf projects
	rm -rf versions
	rm -rf uploads

test:
	@echo "Running tests..."
	npm test

lint:
	@echo "Running linting..."
	@echo "Backend linting..."
	npm run lint || echo "No linting configured for backend"
	@echo "Frontend linting..."
	cd frontend && npm run lint || echo "No linting configured for frontend"

format:
	@echo "Formatting code..."
	@echo "Backend formatting..."
	npm run format || echo "No formatting configured for backend"
	@echo "Frontend formatting..."
	cd frontend && npm run format || echo "No formatting configured for frontend"

logs:
	@echo "Showing application logs..."
	tail -f logs/app.log

# Database
db-setup:
	@echo "Setting up database..."
	docker-compose up -d postgres
	@echo "Waiting for database to be ready..."
	sleep 10
	@echo "Database setup complete"

db-reset:
	@echo "Resetting database..."
	docker-compose down postgres
	docker volume rm ai-coding-assistant_postgres_data
	docker-compose up -d postgres

# Monitoring
monitoring-setup:
	@echo "Setting up monitoring services..."
	docker-compose up -d prometheus grafana
	@echo "Monitoring services started:"
	@echo "  Prometheus: http://localhost:9090"
	@echo "  Grafana: http://localhost:3000 (admin/admin)"

monitoring-stop:
	@echo "Stopping monitoring services..."
	docker-compose stop prometheus grafana

# Health checks
health:
	@echo "Checking application health..."
	@curl -f http://localhost:3001/health || echo "Backend is not responding"
	@curl -f http://localhost:3000 || echo "Frontend is not responding"

# Backup and restore
backup:
	@echo "Creating backup..."
	@mkdir -p backups
	@tar -czf backups/backup-$(shell date +%Y%m%d-%H%M%S).tar.gz projects versions uploads logs

restore:
	@echo "Available backups:"
	@ls -la backups/
	@echo "Usage: make restore-backup BACKUP_FILE=backup-YYYYMMDD-HHMMSS.tar.gz"

restore-backup:
	@if [ -z "$(BACKUP_FILE)" ]; then echo "Please specify BACKUP_FILE"; exit 1; fi
	@echo "Restoring from backup: $(BACKUP_FILE)"
	@tar -xzf backups/$(BACKUP_FILE)
	@echo "Restore complete"

# Quick start for new developers
quickstart: install docker-up
	@echo "Quick start complete!"
	@echo "Application is running at:"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend: http://localhost:3001"
	@echo "  Redis: localhost:6379"
	@echo "  Database: localhost:5432"