# Contributing to AI Coding Assistant

Thank you for your interest in contributing to the AI Coding Assistant project! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)
- [Community](#community)

## Code of Conduct

This project and its participants are governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

- **Be respectful** and inclusive of all contributors
- **Be collaborative** and open to different viewpoints
- **Be constructive** in feedback and discussions
- **Be professional** in all interactions

### Reporting Issues

If you experience or witness unacceptable behavior, please report it to the project maintainers.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Docker (optional, for containerized development)

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai-coding-assistant.git
   cd ai-coding-assistant
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_REPO/ai-coding-assistant.git
   ```

### First Contribution

For your first contribution, we recommend:
1. **Start with documentation** improvements
2. **Fix a simple bug** or add a small feature
3. **Ask questions** in issues or discussions
4. **Join community discussions**

## Development Setup

### 1. Install Dependencies

```bash
# Install all dependencies
npm run install:all

# Or install separately
npm install                    # Backend
cd frontend && npm install    # Frontend
cd shared && npm install      # Shared module
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit with your settings
nano .env
```

**Required Environment Variables:**
- `OPENAI_API_KEY`: Your OpenAI API key
- `SESSION_SECRET`: Random string for session security
- `PORT`: Server port (default: 3001)

### 3. Start Development Servers

```bash
# Start both backend and frontend
npm run dev:all

# Or start separately
npm run dev                    # Backend only
cd frontend && npm start      # Frontend only
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs

## Contributing Guidelines

### What to Contribute

We welcome contributions in the following areas:

#### 🐛 Bug Fixes
- Fix reported bugs
- Improve error handling
- Add input validation

#### ✨ New Features
- Add new project types
- Implement new AI capabilities
- Enhance user interface

#### 📚 Documentation
- Improve README files
- Add code comments
- Create tutorials and guides

#### 🧪 Testing
- Add unit tests
- Improve test coverage
- Add integration tests

#### 🔧 Infrastructure
- Improve build process
- Add CI/CD pipelines
- Enhance monitoring

#### 🌐 Internationalization
- Add new language support
- Improve translations
- Fix RTL layout issues

### What NOT to Contribute

- **Breaking changes** without discussion
- **Major refactoring** without approval
- **New dependencies** without justification
- **Security-sensitive** changes without review

## Code Standards

### General Principles

1. **Keep it simple** - Prefer simple solutions over complex ones
2. **Be consistent** - Follow existing patterns and conventions
3. **Think long-term** - Write code that's maintainable and scalable
4. **Document everything** - Add comments and documentation

### Code Style

#### JavaScript/TypeScript

- Use **ES6+** features when possible
- Prefer **const** and **let** over **var**
- Use **arrow functions** for callbacks
- Use **template literals** for string concatenation
- Use **destructuring** for object/array access

```typescript
// Good
const { name, age } = user;
const fullName = `${firstName} ${lastName}`;
const users = items.map(item => item.user);

// Avoid
var userName = user.name;
var fullName = firstName + ' ' + lastName;
var users = items.map(function(item) { return item.user; });
```

#### React Components

- Use **functional components** with hooks
- Use **TypeScript** for type safety
- Follow **Material-UI** design patterns
- Implement **responsive design**

```typescript
// Good
const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">{user.name}</Typography>
    </Box>
  );
};

// Avoid
class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isEditing: false };
  }
  
  render() {
    return <div className="user-profile">{this.props.user.name}</div>;
  }
}
```

#### Backend Code

- Use **async/await** for asynchronous operations
- Implement **proper error handling**
- Use **middleware** for common functionality
- Follow **RESTful** API design

```javascript
// Good
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    logger.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Avoid
app.get('/api/users/:id', (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      res.status(500).send('Error');
    } else {
      res.send(user);
    }
  });
});
```

### File Organization

```
ai-coding-assistant/
├── server/           # Backend code
│   ├── managers/     # Business logic managers
│   ├── routes/       # API routes
│   ├── middleware/   # Express middleware
│   └── utils/        # Utility functions
├── frontend/         # Frontend code
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom hooks
│   │   ├── utils/       # Utility functions
│   │   └── types/       # TypeScript types
│   └── public/          # Static assets
├── shared/          # Shared code
│   ├── types/       # Common TypeScript types
│   └── constants/   # Shared constants
├── scripts/         # Build and deployment scripts
├── monitoring/      # Monitoring configurations
└── docs/           # Documentation
```

### Naming Conventions

- **Files**: Use kebab-case (`user-profile.tsx`)
- **Components**: Use PascalCase (`UserProfile`)
- **Functions**: Use camelCase (`getUserProfile`)
- **Constants**: Use UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Types/Interfaces**: Use PascalCase (`UserProfileProps`)

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test files
npm test -- --grep "UserProfile"
```

### Writing Tests

- **Test structure**: Use describe/it blocks
- **Test naming**: Be descriptive about what you're testing
- **Test isolation**: Each test should be independent
- **Mocking**: Mock external dependencies

```typescript
// Good
describe('UserProfile Component', () => {
  it('should display user name when user is provided', () => {
    const user = { name: 'John Doe', email: 'john@example.com' };
    render(<UserProfile user={user} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
  
  it('should show loading state when user is not provided', () => {
    render(<UserProfile user={null} />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
```

### Test Coverage

We aim for:
- **Unit tests**: 80%+ coverage
- **Integration tests**: 60%+ coverage
- **End-to-end tests**: Critical user flows

## Pull Request Process

### 1. Create a Feature Branch

```bash
# Create and switch to feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### 2. Make Your Changes

- **Write code** following our standards
- **Add tests** for new functionality
- **Update documentation** as needed
- **Test locally** before committing

### 3. Commit Your Changes

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add user profile editing capability

- Add edit mode toggle
- Implement form validation
- Add save/cancel functionality
- Update user interface components"
```

**Commit Message Format:**
```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### 4. Push and Create PR

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create pull request on GitHub
```

### 5. PR Description Template

```markdown
## Description
Brief description of what this PR accomplishes.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] I have tested this change locally
- [ ] I have added tests for this change
- [ ] All tests pass

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

### 6. Code Review Process

1. **Automated checks** must pass (CI/CD)
2. **Code review** by maintainers
3. **Address feedback** and make changes
4. **Approval** from at least one maintainer
5. **Merge** when ready

## Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Steps

1. **Create release branch** from main
2. **Update version** in package.json
3. **Update changelog** with new features/fixes
4. **Create release** on GitHub
5. **Deploy** to production
6. **Announce** to community

## Community

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and discussions
- **Pull Requests**: Code contributions and reviews
- **Releases**: New versions and updates

### Getting Help

1. **Check documentation** first
2. **Search existing issues** for similar problems
3. **Create a new issue** with detailed information
4. **Join discussions** for help and ideas

### Recognition

Contributors are recognized through:
- **Contributor list** in README
- **GitHub contributors** page
- **Release notes** for significant contributions
- **Community shoutouts** for exceptional work

## Questions?

If you have questions about contributing:

1. **Check this guide** first
2. **Search existing issues** and discussions
3. **Create a new discussion** for general questions
4. **Contact maintainers** for specific concerns

Thank you for contributing to AI Coding Assistant! 🚀