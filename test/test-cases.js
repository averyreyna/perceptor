/**
 * Comprehensive test cases for the Socratic coding tutor
 */

const testCases = [
  {
    category: 'DIRECT_ANSWERS',
    userInput: 'How do I create a function in JavaScript?',
    mockResponse: 'The answer is to use the function keyword like this: function myFunction() { return "hello"; }',
    expectedResult: 'FAIL',
    description: 'Should detect direct answer pattern'
  },
  {
    category: 'DIRECT_ANSWERS',
    userInput: 'What is a variable?',
    mockResponse: 'Here\'s the code you need: let myVariable = "hello world";',
    expectedResult: 'FAIL',
    description: 'Should detect direct code provision'
  },
  {
    category: 'DIRECT_ANSWERS',
    userInput: 'How do I fix this error?',
    mockResponse: 'You need to add a semicolon at the end of line 5. Here\'s the correct way: console.log("hello");',
    expectedResult: 'FAIL',
    description: 'Should detect prescriptive solution'
  },

  {
    category: 'EXTERNAL_REFERENCES',
    userInput: 'I want to learn about loops',
    mockResponse: 'You should check out the MDN documentation on loops. There are great tutorials on W3Schools too.',
    expectedResult: 'FAIL',
    description: 'Should detect external resource references'
  },
  {
    category: 'EXTERNAL_REFERENCES',
    userInput: 'How do I learn more about arrays?',
    mockResponse: 'Go to YouTube and watch some videos about JavaScript arrays. The documentation will help too.',
    expectedResult: 'FAIL',
    description: 'Should detect external learning suggestions'
  },

  {
    category: 'SOCRATIC_GOOD',
    userInput: 'How do I create a function?',
    mockResponse: 'Great question! What do you think a function is supposed to do? Let\'s start by building a simple one together. What would you like your function to accomplish?',
    expectedResult: 'PASS',
    description: 'Should recognize Socratic questioning approach'
  },
  {
    category: 'SOCRATIC_GOOD',
    userInput: 'My code isn\'t working',
    mockResponse: 'Let\'s figure this out together! Can you tell me what you expected to happen versus what actually happened? What do you think might be causing the difference?',
    expectedResult: 'PASS',
    description: 'Should recognize guided discovery approach'
  },
  {
    category: 'SOCRATIC_GOOD',
    userInput: 'What is a variable?',
    mockResponse: 'Let\'s explore this by creating one! Think of a variable like a box with a label. What would you like to store in your first box? Let\'s try making one and see what happens.',
    expectedResult: 'PASS',
    description: 'Should recognize hands-on learning approach'
  },
  {
    category: 'SOCRATIC_GOOD',
    userInput: 'I want to learn loops',
    mockResponse: 'Perfect! Let\'s build something that needs a loop right now. What if we wanted to print "Hello" 5 times? How do you think we could do that without writing console.log 5 separate times?',
    expectedResult: 'PASS',
    description: 'Should recognize immediate practical application'
  },

  {
    category: 'EDGE_CASES',
    userInput: 'Can you help me?',
    mockResponse: 'Of course! What would you like to build or learn today? I\'m here to guide you through hands-on practice.',
    expectedResult: 'PASS',
    description: 'Should handle vague requests appropriately'
  },
  {
    category: 'EDGE_CASES',
    userInput: 'Show me the codebase structure',
    mockResponse: 'Let\'s explore your project together! What do you think each file might be responsible for? Take a look at the file names - what patterns do you notice?',
    expectedResult: 'PASS',
    description: 'Should handle codebase analysis requests with questions'
  },

  {
    category: 'MIXED',
    userInput: 'How do I debug this?',
    mockResponse: 'Debugging is like being a detective! What clues do you see in the error message? Let\'s start by adding some console.log statements to see what\'s happening. Try adding console.log("checkpoint 1") at the beginning of your function and tell me what you see.',
    expectedResult: 'PASS',
    description: 'Should recognize guided debugging with specific next steps'
  },
  {
    category: 'MIXED',
    userInput: 'Explain objects in JavaScript',
    mockResponse: 'Let\'s create an object together! Think of an object like describing a person - they have properties like name, age, height. What would you like to create an object about? A car? A book? You choose, and we\'ll build it step by step.',
    expectedResult: 'PASS',
    description: 'Should recognize conceptual explanation through building'
  }
];

const scenarioTests = [
  {
    scenario: 'BEGINNER_OVERWHELMED',
    userInput: 'I don\'t understand anything about programming',
    goodResponse: 'That\'s totally normal - everyone starts somewhere! Let\'s build something really simple together right now. How about we make the computer say "Hello" to you? What\'s your name?',
    badResponse: 'You need to start with the basics. First learn variables, then functions, then objects. Here\'s a tutorial link to get started.',
    description: 'Should encourage and start immediately with simple practice'
  },
  {
    scenario: 'STUDENT_ASKING_FOR_SOLUTION',
    userInput: 'Can you just give me the code for a calculator?',
    goodResponse: 'I\'d love to help you build a calculator! But let\'s make it yours by building it together. What\'s the first thing a calculator needs to do? What happens when someone presses a number button?',
    badResponse: 'Here\'s a complete calculator code: function add(a, b) { return a + b; } function subtract(a, b) { return a - b; }...',
    description: 'Should redirect to guided building instead of providing complete solutions'
  },
  {
    scenario: 'DEBUGGING_HELP',
    userInput: 'My function returns undefined',
    goodResponse: 'Ah, the mysterious undefined! This is a great learning moment. What do you think your function should return? Can you show me the function and walk me through what you think each line does?',
    badResponse: 'The problem is you\'re missing a return statement. Add return before your variable like this: return result;',
    description: 'Should guide discovery of the issue rather than directly fixing it'
  }
];

module.exports = {
  testCases,
  scenarioTests
};
