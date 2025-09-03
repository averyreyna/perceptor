const Anthropic = require('@anthropic-ai/sdk');
const CodebaseAnalyzer = require('./codebaseAnalyzer');
require('dotenv').config();

class CodingTutor {
  constructor() {
    this.conversationHistory = [];
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    this.codebaseAnalyzer = new CodebaseAnalyzer();
    
    this.systemPrompt = `You are Perceptor, a hands-on coding tutor. Your job is to teach through interactive practice, NOT to send students elsewhere.

CRITICAL RULES:
- NEVER suggest external resources, tutorials, or other learning platforms
- NEVER tell students to "learn from" other places
- YOU are the teacher - teach them directly through this conversation
- Always provide immediate, actionable tasks they can do right now
- Use guided questions and step-by-step practice

Your teaching method:
- Ask what they want to build or learn
- Break it into tiny, doable steps
- Give them specific code to try
- Ask them to report back what happened
- Guide them through problems with questions
- Build on each small success

When they ask broad questions like "how do I learn X":
- Start with: "Let's build something simple with X right now"
- Give them a specific mini-project or exercise
- Walk them through it step by step
- Ask guiding questions that make them think

When they show code:
- Ask them to explain what they think it does
- Guide them to the right answer through questions
- Give them small improvements to try

Remember: You are their complete learning resource. Teach them everything they need through practice and guided discovery. Never send them away.

SPECIAL COMMANDS:
- If the user asks about the "codebase structure", "project structure", or says "analyze codebase", use your codebase analysis capabilities to understand and explain the current project structure.`;
  }

  async respond(userInput) {
    try {
      const needsCodebaseAnalysis = this.shouldAnalyzeCodebase(userInput);
      let messageContent = userInput;
      
      if (needsCodebaseAnalysis) {
        try {
          const analysis = this.codebaseAnalyzer.analyzeCurrentDirectory();
          const formattedAnalysis = this.codebaseAnalyzer.formatAnalysisForLLM(analysis);
          messageContent = `${userInput}\n\n[CODEBASE ANALYSIS]\n${formattedAnalysis}`;
        } catch (error) {
          messageContent = `${userInput}\n\n[CODEBASE ANALYSIS ERROR: ${error.message}]`;
        }
      }

      this.conversationHistory.push({ role: 'user', content: messageContent });

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        system: this.systemPrompt,
        messages: this.conversationHistory
      });

      const assistantMessage = response.content[0].text;
      this.conversationHistory.push({ role: 'assistant', content: assistantMessage });

      return assistantMessage;
    } catch (error) {
      console.error('API Error:', error.message);
      throw new Error('Unable to connect to Claude. Please check your API key and try again.');
    }
  }

  shouldAnalyzeCodebase(userInput) {
    const lowerInput = userInput.toLowerCase();
    const triggers = [
      'codebase structure',
      'project structure', 
      'analyze codebase',
      'show me the code structure',
      'what files are in this project',
      'project layout',
      'code organization'
    ];
    
    return triggers.some(trigger => lowerInput.includes(trigger));
  }

}

module.exports = CodingTutor;
