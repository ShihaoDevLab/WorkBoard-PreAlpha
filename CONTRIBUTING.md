# Contributing to WorkBoard

Thank you for your interest in contributing to WorkBoard! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Contributing to WorkBoard](#contributing-to-workboard)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Development Setup](#development-setup)
    - [Prerequisites](#prerequisites)
    - [Running the Project](#running-the-project)
  - [Code Style](#code-style)
    - [JavaScript](#javascript)
    - [HTML](#html)
    - [CSS](#css)
  - [Submitting Changes](#submitting-changes)
    - [Branch Naming](#branch-naming)
    - [Commit Messages](#commit-messages)
  - [Feature Requests](#feature-requests)
  - [Bug Reports](#bug-reports)
  - [Pull Request Guidelines](#pull-request-guidelines)
    - [PR Checklist](#pr-checklist)
  - [Code of Conduct](#code-of-conduct)
  - [License](#license)
  - [Questions?](#questions)
  - [Recognition](#recognition)

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your changes
4. Make your changes
5. Test your changes
6. Submit a pull request

## Development Setup

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A text editor or IDE (VS Code recommended)
- Git

### Running the Project

1. Clone the repository:

    ```bash
    git clone https://github.com/ShihaoShenDev/WorkBoard.git
    cd WorkBoard
    ```

2. Open `index.html` in your browser:
    - You can simply double-click the file
    - Or use a local server (recommended for better performance):
        ```bash
        # Python 3
        python -m http.server 8000
        # Then open http://localhost:8000 in your browser
        ```

## Code Style

### JavaScript

- Use consistent indentation (2 spaces)
- Use descriptive variable and function names
- Add comments for complex logic
- Use modern JavaScript features (ES6+)
- Handle errors gracefully with try-catch blocks

### HTML

- Use semantic HTML5 elements
- Keep structure clean and organized
- Use meaningful class and ID names

### CSS

- Use consistent naming conventions (BEM-like)
- Use CSS custom properties for theming
- Keep styles organized by component
- Use responsive design principles

## Submitting Changes

### Branch Naming

Use descriptive branch names:

- `feature/[feature-name]` for new features
- `fix/[bug-description]` for bug fixes
- `docs/[documentation-update]` for documentation changes

### Commit Messages

Follow conventional commit format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring without changing functionality
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Example:

```
feat: add stopwatch functionality

- Added stopwatch display with milliseconds
- Implemented start, stop, and reset buttons
- Added visual feedback for active state
```

## Feature Requests

1. Check existing issues to avoid duplicates
2. Create a new issue with the label `enhancement`
3. Provide a clear description of the feature
4. Explain the use case and benefits
5. Include any relevant mockups or examples

## Bug Reports

1. Check existing issues to avoid duplicates
2. Create a new issue with the label `bug`
3. Provide a clear description of the bug
4. Include steps to reproduce the bug
5. Include expected and actual behavior
6. Add browser version and OS if relevant

## Pull Request Guidelines

1. **Fork and Branch**: Fork the repository and create a feature branch
2. **Test**: Ensure your changes work correctly in multiple browsers
3. **Update Documentation**: Update README.md or other documentation if needed
4. **Clean Commits**: Squash related commits and use clear commit messages
5. **Describe Changes**: Provide a clear PR description explaining what and why
6. **Link Issues**: Reference any related issues using `Fixes #123` or `Closes #123`

### PR Checklist

- [ ] Code follows the project's style guidelines
- [ ] Tests have been added/updated (if applicable)
- [ ] Documentation has been updated
- [ ] All tests pass
- [ ] Code is well-commented
- [ ] Changes are minimal and focused

## Code of Conduct

Please be respectful and constructive in all interactions. We follow the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/).

## License

By contributing, you agree that your contributions will be licensed under the MIT License that covers this project.

## Questions?

Feel free to open an issue with the label `question` if you have any questions about contributing to this project.

## Recognition

Contributors will be recognized in the project's README.md file and release notes.

---

**Thank you for contributing to WorkBoard!** 🎉

Note: You can use AI tools like GitHub Copilot to contribute code - Just like me!
*This document is generated by [GitHub Copilot](https://github.com/features/copilot) powered by [`mimo-v2-flash`](https://mimo.xiaomi.com/zh/index).*