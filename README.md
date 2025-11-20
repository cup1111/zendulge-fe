# Zendulge Frontend Application

A modern, production-ready React application built with React Router, TypeScript, and TailwindCSS.

## 🛠️ Tech Stack

### Core Technologies

- **Framework**: React Router 7.x
- **Language**: TypeScript 5.x
- **Styling**: TailwindCSS 4.x
- **Build Tool**: Vite 7.x
- **Package Manager**: Yarn 1.22.x

### Key Dependencies

- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form 7.x with Zod validation
- **Charts**: Recharts 3.x
- **Icons**: Lucide React
- **Animation**: Framer Motion 11.x
- **State Management**: Built-in React Router data loading
- **Date Handling**: React Day Picker 9.x

### Development Tools

- **ESLint**: Airbnb TypeScript configuration
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality checks
- **TypeScript**: Strict type checking

## � Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js**: v22.20.0 (as specified in engines)
- **Yarn**: v1.22.x or higher
- **VS Code**: Recommended for development

## 🚀 Quick Start

### 1. Install Dependencies

```bash
yarn install
```

### 2. Setup VS Code Extensions

```bash
# Fix VS Code CLI if needed
yarn fix-vscode-cli

# Install all recommended extensions
yarn setup-vscode
```

### 3. Start Development Server

```bash
yarn dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
app/
├── assets/               # Static assets (images, icons)
├── components/           # Reusable UI components
│   ├── layout/          # Layout components (header, footer)
│   └── ui/              # UI primitives and form elements
├── contexts/            # React contexts for global state
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and configurations
├── routes/              # Application pages and route handlers
├── app.css              # Global styles
├── root.tsx             # Application root component
└── routes.ts            # Route configuration
```

## 🔧 Available Scripts

| Script              | Description                       |
| ------------------- | --------------------------------- |
| `yarn dev`          | Start development server with HMR |
| `yarn build`        | Build for production              |
| `yarn start`        | Start production server           |
| `yarn typecheck`    | Run TypeScript type checking      |
| `yarn lint`         | Run ESLint                        |
| `yarn lint:fix`     | Fix auto-fixable ESLint issues    |
| `yarn format`       | Format code with Prettier         |
| `yarn format:check` | Check code formatting             |
| `yarn quality`      | Run all quality checks            |

## 🧪 Testing

### Code Quality Checks

```bash
# Run TypeScript type checking
yarn typecheck

# Run ESLint
yarn lint

# Fix auto-fixable linting issues
yarn lint:fix

# Check code formatting
yarn format:check

# Format code
yarn format

# Run all quality checks
yarn quality
```

## 🚀 Building for Production

### Build the Application

```bash
yarn build
```

```bash
cp .env.example .env (CONFIG THE .env VALUE, eg: database)
```

### Start Production Server

```bash
yarn start
```

## 🐳 Docker Support

### Development with Docker

```bash
# Build the Docker image
docker build -t zendulge-frontend .

# Run the container
docker run -p 5173:5173 zendulge-frontend
```

## 🚀 Deployment

### Production Deployment

1. **Build the application**:

   ```bash
   yarn build
   ```

2. **Deploy to AWS S3**:
   ```bash
   yarn deploy
   ```

### Deployment Structure

```
build/
├── client/    # Static assets for CDN/S3
└── server/    # Server-side code for hosting
```

### Supported Platforms

- **AWS S3 + CloudFront**: Static site deployment
- **Vercel**: Automatic deployments
- **Netlify**: Static site hosting
- **Railway**: Full-stack hosting
- **Docker**: Containerized deployment

## 🔒 Code Quality & Git Hooks

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

## 🎨 Styling & UI Components

### TailwindCSS Configuration

- **TailwindCSS 4.x**: Latest version with CSS-first configuration
- **Custom Design System**: Consistent colors, spacing, and typography
- **Dark Mode Support**: Built-in dark mode capabilities
- **Responsive Design**: Mobile-first approach

### UI Component Library

- **Radix UI**: Accessible, unstyled component primitives
- **Custom Components**: Built on top of Radix with TailwindCSS
- **Form Components**: React Hook Form integration
- **Chart Components**: Recharts integration for data visualization

## 📊 Development Guidelines

### Code Standards

- Follow TypeScript best practices
- Use React Hook Form for form handling
- Implement proper error boundaries
- Write accessible components
- Use semantic HTML elements

### Component Development

- Create reusable UI components in `app/components/ui/`
- Follow the established component patterns
- Use TypeScript interfaces for props
- Implement proper prop validation

### State Management

- Use React Router's built-in data loading
- Implement React Context for global state
- Use custom hooks for shared logic
- Follow React best practices for state

## 🔧 Features

- 🚀 **Server-side rendering** with React Router
- ⚡️ **Hot Module Replacement** for fast development
- 📦 **Asset bundling and optimization** with Vite
- 🔄 **Data loading and mutations** with React Router
- 🔒 **TypeScript** for type safety
- 🎉 **TailwindCSS** for styling
- 📱 **Responsive design** for all devices
- ♿ **Accessibility** built-in with Radix UI
- 🎯 **SEO optimized** with meta tags and SSR

## 👥 Authors

- **Kitman Yiu**

## 📈 Goals & Roadmap

### Month 1 (Nov 2025)

- ✅ Frontend folder setup (ESLint, TypeScript, security, folder structure)
- 🚧 Pages implementation:
  - Home page
  - Login page (customer & business)
  - Register page (customer & business)
  - 404 Not Found page
  - Help page
- 🚧 Authentication integration
- 🚧 Error handling implementation

### Month 2 (Dec 2025)

- Deal cards and browsing functionality
- Categories and filters
- Advanced UI components

### Month 3 (Jan 2026)

- Booking flow implementation
- Notifications system
- User dashboard

### Month 4 (Feb 2026)

- Payment integration (Stripe)
- Order lifecycle management
- Final MVP completion

---

Built with ❤️ using React Router, TypeScript, and TailwindCSS.

### License
© 2025 Zendulge. All Rights Reserved.

Unauthorized copying of this file is strictly prohibited.