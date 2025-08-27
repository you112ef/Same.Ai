#!/bin/bash

# AI Coding Assistant Deployment Script
# This script automates the deployment process for production

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DEPLOYMENT_ENV=${DEPLOYMENT_ENV:-"production"}
DOCKER_REGISTRY=${DOCKER_REGISTRY:-""}
IMAGE_TAG=${IMAGE_TAG:-"latest"}
CONTAINER_NAME="ai-coding-assistant"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking deployment prerequisites..."
    
    if ! command_exists docker; then
        print_error "Docker is required for deployment"
        exit 1
    fi
    
    if ! command_exists docker-compose; then
        print_error "Docker Compose is required for deployment"
        exit 1
    fi
    
    if [ ! -f .env ]; then
        print_error ".env file not found. Please run setup first."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Function to build Docker image
build_image() {
    print_status "Building Docker image..."
    
    if [ -n "$DOCKER_REGISTRY" ]; then
        IMAGE_NAME="${DOCKER_REGISTRY}/ai-coding-assistant:${IMAGE_TAG}"
    else
        IMAGE_NAME="ai-coding-assistant:${IMAGE_TAG}"
    fi
    
    docker build -t "$IMAGE_NAME" .
    print_success "Docker image built successfully: $IMAGE_NAME"
}

# Function to stop existing containers
stop_containers() {
    print_status "Stopping existing containers..."
    
    if docker ps -q --filter "name=$CONTAINER_NAME" | grep -q .; then
        docker stop "$CONTAINER_NAME"
        docker rm "$CONTAINER_NAME"
        print_success "Existing containers stopped and removed"
    else
        print_status "No existing containers found"
    fi
}

# Function to deploy application
deploy_application() {
    print_status "Deploying application..."
    
    # Create production docker-compose file
    cat > docker-compose.prod.yml << EOF
version: '3.8'

services:
  ai-coding-assistant:
    image: ${IMAGE_NAME:-"ai-coding-assistant:${IMAGE_TAG}"}
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
    env_file:
      - .env
    volumes:
      - ./projects:/app/projects
      - ./versions:/app/versions
      - ./uploads:/app/uploads
      - ./logs:/app/logs
    depends_on:
      - redis
    restart: unless-stopped
    networks:
      - ai-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - ai-network

volumes:
  redis_data:

networks:
  ai-network:
    driver: bridge
EOF
    
    # Start services
    docker-compose -f docker-compose.prod.yml up -d
    
    print_success "Application deployed successfully"
}

# Function to run health checks
health_check() {
    print_status "Running health checks..."
    
    # Wait for services to start
    sleep 10
    
    # Check backend
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        print_success "Backend is healthy"
    else
        print_error "Backend health check failed"
        return 1
    fi
    
    # Check Redis
    if docker exec ai-coding-assistant-redis-1 redis-cli ping > /dev/null 2>&1; then
        print_success "Redis is healthy"
    else
        print_error "Redis health check failed"
        return 1
    fi
    
    print_success "All health checks passed"
}

# Function to show deployment info
show_deployment_info() {
    echo
    print_success "Deployment completed successfully!"
    echo
    echo "Deployment Information:"
    echo "  Environment: $DEPLOYMENT_ENV"
    echo "  Image: ${IMAGE_NAME:-"ai-coding-assistant:${IMAGE_TAG}"}"
    echo "  Container: $CONTAINER_NAME"
    echo
    echo "Service URLs:"
    echo "  Backend API: http://localhost:3001"
    echo "  Redis: localhost:6379"
    echo
    echo "Useful commands:"
    echo "  docker-compose -f docker-compose.prod.yml logs -f    # View logs"
    echo "  docker-compose -f docker-compose.prod.yml down       # Stop services"
    echo "  docker-compose -f docker-compose.prod.yml restart    # Restart services"
    echo
    echo "Monitoring:"
    echo "  docker stats                                        # Container statistics"
    echo "  docker system df                                    # Disk usage"
}

# Function to rollback deployment
rollback() {
    print_warning "Rolling back deployment..."
    
    # Stop current deployment
    docker-compose -f docker-compose.prod.yml down
    
    # Remove current image
    docker rmi "${IMAGE_NAME:-"ai-coding-assistant:${IMAGE_TAG}"}" || true
    
    print_success "Rollback completed"
}

# Function to show help
show_help() {
    echo "AI Coding Assistant Deployment Script"
    echo
    echo "Usage: $0 [OPTIONS]"
    echo
    echo "Options:"
    echo "  -h, --help          Show this help message"
    echo "  -e, --env ENV       Deployment environment (default: production)"
    echo "  -t, --tag TAG       Docker image tag (default: latest)"
    echo "  -r, --registry REG  Docker registry URL"
    echo "  --rollback          Rollback to previous deployment"
    echo
    echo "Environment Variables:"
    echo "  DEPLOYMENT_ENV      Deployment environment"
    echo "  DOCKER_REGISTRY     Docker registry URL"
    echo "  IMAGE_TAG           Docker image tag"
    echo
    echo "Examples:"
    echo "  $0                           # Deploy with default settings"
    echo "  $0 -e staging -t v1.0.0     # Deploy staging with specific tag"
    echo "  $0 --rollback               # Rollback deployment"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -e|--env)
            DEPLOYMENT_ENV="$2"
            shift 2
            ;;
        -t|--tag)
            IMAGE_TAG="$2"
            shift 2
            ;;
        -r|--registry)
            DOCKER_REGISTRY="$2"
            shift 2
            ;;
        --rollback)
            rollback
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Main deployment function
main() {
    echo "=========================================="
    echo "  AI Coding Assistant Deployment Script"
    echo "=========================================="
    echo
    
    # Check prerequisites
    check_prerequisites
    
    # Build image
    build_image
    
    # Stop existing containers
    stop_containers
    
    # Deploy application
    deploy_application
    
    # Run health checks
    health_check
    
    # Show deployment info
    show_deployment_info
}

# Run main function
main "$@"