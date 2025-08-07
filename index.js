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

function startThinkingAnimation() {
  // ANSI color codes
  const colors = {
    lightBlue: '\x1b[38;5;117m', // Light/baby blue
    gray: '\x1b[90m',
    reset: '\x1b[0m'
  };
  
  let seconds = 0;
  let estimatedTokens = 0;
  let frameIndex = 0;
  
  // Animated ASCII star frames (similar to Claude Code)
  const starFrames = ['*', '✦', '✧', '✦'];
  
  // Static dots
  const staticDots = '...';
  
  const startTime = Date.now();
  
  process.stdout.write('\n');
  
  const interval = setInterval(() => {
    seconds = Math.floor((Date.now() - startTime) / 1000);
    estimatedTokens = Math.floor(seconds * 12); // Rough token estimation
    
    const animatedStar = starFrames[frameIndex % starFrames.length];
    const display = `${colors.lightBlue}${animatedStar} Thinking${staticDots}${colors.reset} ${colors.gray}(${seconds}s • ↑ ${estimatedTokens} tokens • esc to interrupt)${colors.reset}`;
    
    process.stdout.write(`\r${display}`);
    frameIndex++;
  }, 500);
  
  return { interval, startTime };
}

function stopThinkingAnimation(animationData, responseTokens = 0) {
  clearInterval(animationData.interval);
  const totalTime = Math.floor((Date.now() - animationData.startTime) / 1000);
  const finalTokens = responseTokens || Math.floor(totalTime * 12);
  
  // Clear the line completely
  process.stdout.write('\r' + ' '.repeat(80) + '\r');
}

async function startTutorSession() {
  console.log('');
  console.log('██████╗ ███████╗██████╗  ██████╗███████╗██████╗ ████████╗ ██████╗ ██████╗ ');
  console.log('██╔══██╗██╔════╝██╔══██╗██╔════╝██╔════╝██╔══██╗╚══██╔══╝██╔═══██╗██╔══██╗');
  console.log('██████╔╝█████╗  ██████╔╝██║     █████╗  ██████╔╝   ██║   ██║   ██║██████╔╝');
  console.log('██╔═══╝ ██╔══╝  ██╔══██╗██║     ██╔══╝  ██╔═══╝    ██║   ██║   ██║██╔══██╗');
  console.log('██║     ███████╗██║  ██║╚██████╗███████╗██║        ██║   ╚██████╔╝██║  ██║');
  console.log('╚═╝     ╚══════╝╚═╝  ╚═╝ ╚═════╝╚══════╝╚═╝        ╚═╝    ╚═════╝ ╚═╝  ╚═╝');
  console.log('');
  console.log('I\'m here to guide you in learning to code. Ask me anything!');
  console.log('Type "exit" or "quit" to end the session.\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'perceptor> '
  });

  const tutor = new CodingTutor();

  rl.prompt();

  rl.on('line', async (input) => {
    const userInput = input.trim();
    
    if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit') {
      console.log('\nHappy coding!');
      rl.close();
      return;
    }

    if (userInput === '') {
      rl.prompt();
      return;
    }

    const animationData = startThinkingAnimation();
    
    try {
      const response = await tutor.respond(userInput);
      const responseTokens = Math.floor(response.length / 4);
      stopThinkingAnimation(animationData, responseTokens);
      console.log(`${response}\n`);
    } catch (error) {
      stopThinkingAnimation(animationData);
      if (error.message.includes('API key')) {
        console.log('❌ API key not found. Please set ANTHROPIC_API_KEY in your .env file.\n');
      } else {
        console.log('❌ Connection error. Please try again.\n');
      }
    }

    rl.prompt();
  });

  rl.on('close', () => {
    process.exit(0);
  });
}

program.parse(process.argv);
