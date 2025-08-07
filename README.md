# Coding Tutor CLI

A command-line assistant designed to guide beginner programmers in learning to code through interactive conversations. Instead of providing direct solutions, the tutor asks guiding questions and encourages hands-on learning.

## Features

- 🎓 Interactive CLI chat interface
- 🤔 Socratic teaching method - guides rather than solves
- 💡 Covers fundamental programming concepts:
  - Functions and methods
  - Variables and data types
  - Loops and iteration
  - Conditionals and logic
  - Data structures
- 🔄 Contextual conversation history
- 📝 Code feedback and review

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Make the CLI globally available:
   ```bash
   npm link
   ```

## Usage

Start a tutoring session:
```bash
coding-tutor
```

Example interaction:
```
$ coding-tutor
🎓 Welcome to Coding Tutor!
I'm here to guide you in learning to code. Ask me anything!
Type "exit" or "quit" to end the session.

> How do I create a function in Python?

AI: Great question about functions! A function is like a reusable block of code that performs a specific task.

Let's break it down:
1. Functions have a name
2. They can take inputs (parameters)
3. They do something with those inputs
4. They can return a result

What programming language are you working with? I can guide you through the syntax!

> Can you show me an example?

AI: I'd love to help, but I think you'll learn better by building it yourself! 🎯

Instead of showing you a complete example, let me guide you through creating one step by step. What specifically are you trying to build?

Start with the first step, and I'll help you figure out what comes next!

> def add_numbers(a, b):

AI: Nice start on that function! Let me help you improve it:

1. Does your function have a clear, descriptive name?
2. Are the parameters named well?
3. What should happen in the function body?

Show me what you're thinking for the next part!
```

## Philosophy

This tutor follows the Socratic method of teaching:
- **Asks questions** instead of giving direct answers
- **Guides discovery** rather than providing solutions
- **Encourages experimentation** and learning from mistakes
- **Builds understanding** through step-by-step exploration

## Development

Run in development mode:
```bash
node index.js
```

## License

MIT