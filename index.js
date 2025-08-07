#!/usr/bin/env node

const { Command } = require('commander');
const readline = require('readline');
const CodingTutor = require('./lib/tutor');

const program = new Command();

program
  .name('coding-tutor')
  .description('A CLI assistant for guiding beginner programmers')
  .version('1.0.0')
  .action(() => {
    startTutorSession();
  });

async function startTutorSession() {
  console.log('🎓 Welcome to Coding Tutor!');
  console.log('I\'m here to guide you in learning to code. Ask me anything!');
  console.log('Type "exit" or "quit" to end the session.\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
  });

  const tutor = new CodingTutor();

  rl.prompt();

  rl.on('line', async (input) => {
    const userInput = input.trim();
    
    if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit') {
      console.log('\n👋 Happy coding! Keep practicing!');
      rl.close();
      return;
    }

    if (userInput === '') {
      rl.prompt();
      return;
    }

    try {
      const response = await tutor.respond(userInput);
      console.log(`\nAI: ${response}\n`);
    } catch (error) {
      console.log('\n❌ Sorry, I encountered an error. Please try again.\n');
    }

    rl.prompt();
  });

  rl.on('close', () => {
    process.exit(0);
  });
}

program.parse(process.argv);
