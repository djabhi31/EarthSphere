# Contributing to EarthSphere

First off, thank you for considering contributing to EarthSphere! It's people like you that make EarthSphere such a great tool.

## Setup Instructions

1. **Fork the repo** and clone it to your local machine.
2. **Install dependencies** using npm:
   ```bash
   npm install
   ```
3. **Set up environment variables**:
   Copy `.env.example` to `.env.local` and add any necessary keys. NASA EONET is a public API, so no keys are required to start developing.
4. **Run the development server**:
   ```bash
   npm run dev
   ```
5. **Open your browser**:
   Navigate to `http://localhost:3000` to view the application.

## Submitting a Pull Request

1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make your changes and test them thoroughly.
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request against the `main` branch.

Please ensure your code follows the existing style, includes appropriate comments, and passes all checks.

Thank you!
