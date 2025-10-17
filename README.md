# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
yarn install
```

### Setup VS Code Extensions

```bash
# Fix VS Code CLI if needed
yarn fix-vscode-cli

# Install all recommended extensions
yarn setup-vscode
```

### Development

Start the development server with HMR:

```bash
yarn dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
yarn build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `yarn build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Code Quality & Git Hooks

This project uses Husky to enforce code quality standards through git hooks:

### Pre-commit Hook
Before each commit, the following checks are automatically run:
- **ESLint**: Checks for code style and potential errors
- **ESLint --quiet**: Ensures no ESLint errors (warnings allowed, but errors block commits)

```bash
# Manually run pre-commit checks
.husky/pre-commit
```

### Pre-push Hook
Before each push, comprehensive quality checks are performed:
- **TypeScript type checking**: Ensures no TypeScript errors
- **ESLint --quiet**: Ensures no ESLint errors  
- **Build check**: Verifies the project compiles successfully

```bash
# Manually run pre-push checks
.husky/pre-push
```

### Manual Quality Checks
You can also run quality checks manually:

```bash
# Check for linting issues
yarn lint

# Fix auto-fixable linting issues
yarn lint:fix

# Run TypeScript type checking
yarn typecheck

# Run all quality checks
yarn quality
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
