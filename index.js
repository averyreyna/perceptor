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
    orange: '\x1b[38;5;208m',
    gray: '\x1b[90m',
    reset: '\x1b[0m'
  };
  
  // Thinking synonyms that change each time
  const thinkingSynonyms = [
    'Pondering', 'Reflecting', 'Contemplating', 'Analyzing', 'Processing',
    'Deliberating', 'Considering', 'Evaluating', 'Examining', 'Cogitating',
    'Ruminating', 'Mulling over', 'Working through', 'Figuring out', 'Elucidating'
  ];
  
  // Moving icons (similar to Claude Code)
  const icons = ['⚡', '🔮', '🧠', '💭', '✨'];
  const selectedIcon = icons[Math.floor(Math.random() * icons.length)];
  const selectedSynonym = thinkingSynonyms[Math.floor(Math.random() * thinkingSynonyms.length)];
  
  let seconds = 0;
  let estimatedTokens = 0;
  let frameIndex = 0;
  
  // Moving icon frames
  const iconFrames = ['  ', ' ', '', ' '];
  
  const startTime = Date.now();
  
  process.stdout.write('\n');
  
  const interval = setInterval(() => {
    seconds = Math.floor((Date.now() - startTime) / 1000);
    estimatedTokens = Math.floor(seconds * 12); // Rough token estimation
    
    const movingIcon = iconFrames[frameIndex % iconFrames.length] + selectedIcon;
    const display = `${colors.orange}${movingIcon} ${selectedSynonym}...${colors.reset} ${colors.gray}(${seconds}s • ↑ ${estimatedTokens} tokens • esc to interrupt)${colors.reset}`;
    
    process.stdout.write(`\r${display}`);
    frameIndex++;
  }, 250);
  
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
      const responseTokens = Math.floor(response.length / 4); // Rough token estimation
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
