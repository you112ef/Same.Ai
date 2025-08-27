#!/bin/bash

# AI Coding Assistant Setup Script
# This script automates the setup process for new installations

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Function to check Node.js version
check_node_version() {
    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2)
        NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1)
        
        if [ "$NODE_MAJOR" -ge 18 ]; then
            print_success "Node.js version $NODE_VERSION is compatible"
            return 0
        else
            print_error "Node.js version $NODE_VERSION is too old. Please install Node.js 18 or higher."
            return 1
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 18 or higher."
        return 1
    fi
}

# Function to check npm
check_npm() {
    if command_exists npm; then
        print_success "npm is installed"
        return 0
    else
        print_error "npm is not installed. Please install npm."
        return 1
    fi
}

# Function to check Docker
check_docker() {
    if command_exists docker; then
        print_success "Docker is installed"
        if command_exists docker-compose; then
            print_success "Docker Compose is installed"
            return 0
        else
            print_warning "Docker Compose is not installed. Some features may not work."
            return 1
        fi
    else
        print_warning "Docker is not installed. Some features may not work."
        return 1
    fi
}

# Function to create environment file
create_env_file() {
    if [ ! -f .env ]; then
        print_status "Creating .env file from template..."
        cp .env.example .env
        print_warning "Please edit .env file with your OpenAI API key and other settings"
        print_status "You can find the .env file in the project root directory"
    else
        print_status ".env file already exists"
    fi
}

# Function to create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    mkdir -p projects versions uploads logs backups
    print_success "Directories created successfully"
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing backend dependencies..."
    npm install
    
    print_status "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
    
    print_status "Installing shared module dependencies..."
    cd shared && npm install && cd ..
    
    print_success "All dependencies installed successfully"
}

# Function to build components
build_components() {
    print_status "Building shared module..."
    cd shared && npm run build && cd ..
    
    print_status "Building frontend..."
    cd frontend && npm run build && cd ..
    
    print_success "All components built successfully"
}

# Function to setup Docker (optional)
setup_docker() {
    if command_exists docker && command_exists docker-compose; then
        read -p "Do you want to set up Docker services? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_status "Setting up Docker services..."
            docker-compose up -d redis postgres
            print_success "Docker services started successfully"
        fi
    fi
}

# Function to display next steps
show_next_steps() {
    echo
    print_success "Setup completed successfully!"
    echo
    echo "Next steps:"
    echo "1. Edit the .env file with your OpenAI API key and other settings"
    echo "2. Start the development servers:"
    echo "   - Backend only: npm run dev"
    echo "   - Frontend only: cd frontend && npm start"
    echo "   - Both: npm run dev:all"
    echo "3. Open your browser and navigate to:"
    echo "   - Frontend: http://localhost:3000"
    echo "   - Backend: http://localhost:3001"
    echo
    echo "Available commands:"
    echo "  make help          - Show all available commands"
    echo "  make dev           - Start development servers"
    echo "  make docker-up     - Start Docker services"
    echo "  make clean         - Clean build artifacts"
    echo
    echo "For more information, see the README.md file"
}

# Main setup function
main() {
    echo "=========================================="
    echo "  AI Coding Assistant Setup Script"
    echo "=========================================="
    echo
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    check_node_version || exit 1
    check_npm || exit 1
    check_docker
    
    # Create environment file
    create_env_file
    
    # Create directories
    create_directories
    
    # Install dependencies
    install_dependencies
    
    # Build components
    build_components
    
    # Setup Docker (optional)
    setup_docker
    
    # Show next steps
    show_next_steps
}

# Run main function
main "$@"