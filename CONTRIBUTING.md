# Contributing to EarthSphere 🌍

Thank you for your interest in contributing to **EarthSphere**! We welcome contributions of all sizes — from fixing small typos and improving documentation to adding major features or visual enhancements.

---

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before making any contributions.

---

## 🛠️ Local Development Setup

### Prerequisites
- **Node.js**: `v20.0.0` or higher
- **npm**: `v9.0.0` or higher
- **Git**

### Installation Steps

1. **Fork the Repository** on GitHub.
2. **Clone your fork locally:**
   ```bash
   git clone https://github.com/YOUR-USERNAME/EarthSphere.git
   cd EarthSphere
   ```
3. **Install Dependencies:**
   ```bash
   npm install
   ```
4. **Set Up Environment Variables:**
   ```bash
   cp .env.example .env.local
   ```
5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
6. Open your browser and navigate to `http://localhost:3000`.

---

## 🏷️ Commit Message Conventions

We adhere to **Conventional Commits** standards to keep our release history clean and structured:

- `feat:` A new feature for the application
- `fix:` A bug fix
- `docs:` Documentation changes
- `style:` Formatting, missing semi-colons, UI tweaks (no code logic change)
- `refactor:` Refactoring code without changing functionality
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Maintenance tasks, dependency updates

**Example:** `feat(globe): add atmospheric shader emission on active volcanic events`

---

## 🚀 Submitting a Pull Request

1. **Create a Topic Branch:**
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. **Implement Your Changes & Test:**
   ```bash
   npm run lint
   npx tsc --noEmit
   npm run build
   ```
3. **Commit Your Changes:**
   ```bash
   git commit -m "feat(module): descriptive commit message"
   ```
4. **Push to Your Branch:**
   ```bash
   git push origin feat/your-feature-name
   ```
5. **Open a Pull Request** against the `master` branch. Fill out the provided [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md).

---

## 🐞 Reporting Bugs & Requesting Features

- Use our [Issue Templates](.github/ISSUE_TEMPLATE/) when filing bugs or proposing new features.
- Provide step-by-step reproduction instructions and screenshots where applicable.

Thank you for helping make **EarthSphere** extraordinary! ❤️
