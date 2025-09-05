# Perceptor

Perceptor is a hands-on coding tutor CLI tool that guides beginner programmers through learning to code using the Socratic method. Rather than providing direct answers, it asks questions and guides discovery, helping you understand the "why" behind programming concepts. The tool features interactive chat sessions, contextual responses for functions/variables/loops/conditionals, code feedback, and conversation history to create an engaging learning experience.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or later)
- npm (v9 or later)

## Local Development

1. Clone the repository:

```bash
git clone https://github.com/yourusername/perceptor.git
cd perceptor
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your Anthropic API key:

```
ANTHROPIC_API_KEY=your_api_key_here
```

4. Start the development session:

```bash
npm start
```

5. Open your terminal to interact with the tutor.

## Available Scripts

- `npm start` - Start the interactive coding tutor session
- `npm run test` - Run the test suite with Socratic validation
- `npm run test:socratic` - Run Socratic method validation tests
- `npm run test:mock` - Run ESLint to check for code issues
