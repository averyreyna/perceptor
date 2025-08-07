class CodingTutor {
  constructor() {
    this.conversationHistory = [];
    this.currentTopic = null;
    this.userProgress = {};
  }

  async respond(userInput) {
    // Store user input in conversation history
    this.conversationHistory.push({ role: 'user', content: userInput });

    // Analyze the input and generate a teaching response
    const response = this.generateTeachingResponse(userInput);
    
    // Store AI response in conversation history
    this.conversationHistory.push({ role: 'assistant', content: response });

    return response;
  }

  generateTeachingResponse(input) {
    const lowerInput = input.toLowerCase();

    // Function-related questions
    if (this.containsKeywords(lowerInput, ['function', 'def', 'method'])) {
      return this.handleFunctionQuestions(input);
    }

    // Variable-related questions
    if (this.containsKeywords(lowerInput, ['variable', 'var', 'let', 'const'])) {
      return this.handleVariableQuestions(input);
    }

    // Loop-related questions
    if (this.containsKeywords(lowerInput, ['loop', 'for', 'while', 'iterate'])) {
      return this.handleLoopQuestions(input);
    }

    // Conditional-related questions
    if (this.containsKeywords(lowerInput, ['if', 'else', 'condition', 'conditional'])) {
      return this.handleConditionalQuestions(input);
    }

    // Data structure questions
    if (this.containsKeywords(lowerInput, ['list', 'array', 'dict', 'dictionary', 'object'])) {
      return this.handleDataStructureQuestions(input);
    }

    // Example requests
    if (this.containsKeywords(lowerInput, ['example', 'show me', 'demonstrate'])) {
      return this.handleExampleRequests(input);
    }

    // Code review/feedback
    if (this.looksLikeCode(input)) {
      return this.provideCodeFeedback(input);
    }

    // General programming questions
    return this.handleGeneralQuestions(input);
  }

  handleFunctionQuestions(input) {
    const responses = [
      "Great question about functions! A function is like a reusable block of code that performs a specific task.\n\nLet's break it down:\n1. Functions have a name\n2. They can take inputs (parameters)\n3. They do something with those inputs\n4. They can return a result\n\nWhat programming language are you working with? I can guide you through the syntax!",
      
      "Functions are one of the most important concepts in programming! Think of them as little machines that take input and produce output.\n\nTry this exercise: Can you think of a simple task you'd want a function to do? For example, adding two numbers, or greeting someone by name?",
      
      "I see you're asking about functions! Instead of showing you the complete syntax, let me guide you through building one step by step.\n\nFirst, what would you like your function to do? Once you tell me, we can work through:\n1. Naming it\n2. Deciding what inputs it needs\n3. Writing the logic inside"
    ];
    
    return this.getRandomResponse(responses);
  }

  handleVariableQuestions(input) {
    return "Variables are like containers that store data! Think of them as labeled boxes where you can put different types of information.\n\nLet's explore this together:\n1. What kind of information do you want to store?\n2. What would be a good name for that container?\n\nOnce you decide, try creating a variable and tell me what you wrote!";
  }

  handleLoopQuestions(input) {
    return "Loops are fantastic for repeating tasks! Instead of writing the same code over and over, loops do it automatically.\n\nLet's think about this step by step:\n1. What task do you want to repeat?\n2. How many times, or under what condition?\n\nCan you think of a real-world example where you repeat something? Like counting from 1 to 10?";
  }

  handleConditionalQuestions(input) {
    return "Conditionals help your program make decisions! They're like asking 'if this is true, then do that.'\n\nLet's practice with a simple scenario:\nImagine you're writing code to decide if someone can vote. What condition would you check?\n\nTry writing out the logic in plain English first, then we can translate it to code!";
  }

  handleDataStructureQuestions(input) {
    return "Data structures are ways to organize and store multiple pieces of information!\n\nThink of them like different types of containers:\n- Lists/Arrays: Like a shopping list (ordered items)\n- Dictionaries/Objects: Like a phone book (key-value pairs)\n\nWhat kind of data are you trying to organize? That will help us choose the right structure!";
  }

  handleExampleRequests(input) {
    return "I'd love to help, but I think you'll learn better by building it yourself! 🎯\n\nInstead of showing you a complete example, let me guide you through creating one step by step. What specifically are you trying to build?\n\nStart with the first step, and I'll help you figure out what comes next!";
  }

  provideCodeFeedback(input) {
    // Simple code detection and feedback
    if (input.includes('def ') || input.includes('function ')) {
      return "Nice start on that function! Let me help you improve it:\n\n1. Does your function have a clear, descriptive name?\n2. Are the parameters named well?\n3. What should happen in the function body?\n\nShow me what you're thinking for the next part!";
    }

    if (input.includes('=') && !input.includes('==')) {
      return "I see you're working with variables! That's great progress.\n\nLet me ask you:\n1. Is the variable name descriptive?\n2. Does the value make sense for what you're trying to store?\n\nWhat are you planning to do with this variable next?";
    }

    return "I can see you're writing some code! Rather than just telling you if it's right or wrong, let me ask:\n\n1. What is this code supposed to do?\n2. Can you walk me through it line by line?\n3. What do you expect to happen when it runs?\n\nThis will help you debug and understand it better!";
  }

  handleGeneralQuestions(input) {
    const responses = [
      "That's an interesting question! Programming is all about breaking down problems into smaller steps.\n\nCan you tell me more about what you're trying to accomplish? I'd love to guide you through the thinking process!",
      
      "Great question! Instead of giving you the answer directly, let me help you discover it.\n\nWhat do you already know about this topic? And what specific part is confusing you?",
      
      "I love that you're curious! The best way to learn programming is by doing.\n\nWhat's a small first step you could take toward solving this? Even if you're not sure it's right, give it a try!"
    ];
    
    return this.getRandomResponse(responses);
  }

  containsKeywords(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
  }

  looksLikeCode(input) {
    // Simple heuristics to detect if input looks like code
    const codeIndicators = ['def ', 'function ', '=', '{', '}', '()', 'if ', 'for ', 'while ', 'import ', 'const ', 'let ', 'var '];
    return codeIndicators.some(indicator => input.includes(indicator));
  }

  getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

module.exports = CodingTutor;
