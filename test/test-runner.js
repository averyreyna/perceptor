#!/usr/bin/env node

/**
 * Perceptor Test Runner
 * Cool terminal animations and comprehensive testing for Socratic method validation
 */

const SocraticValidator = require('./socratic-validator');
const { testCases, scenarioTests } = require('./test-cases');
const CodingTutor = require('../lib/tutor');

class TestRunner {
  constructor() {
    this.validator = new SocraticValidator();
    this.tutor = new CodingTutor();
    
    // Cool terminal colors and effects
    this.colors = {
      cyan: '\x1b[36m',
      green: '\x1b[32m',
      red: '\x1b[31m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      gray: '\x1b[90m',
      white: '\x1b[37m',
      bold: '\x1b[1m',
      dim: '\x1b[2m',
      reset: '\x1b[0m',
      lightBlue: '\x1b[38;5;117m'
    };

    this.symbols = {
      pass: '✓',
      fail: '✗',
      warning: '⚠',
      info: 'ℹ',
      star: '✦',
      arrow: '→',
      bullet: '•'
    };

    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
      details: []
    };
  }

  async runAllTests() {
    this.printHeader();
    
    await this.runMockTests();
    
    if (process.env.ANTHROPIC_API_KEY) {
      console.log(`\n${this.colors.yellow}${this.symbols.info} API key detected. Run live tests? (y/N)${this.colors.reset}`);
      const answer = await this.getUserInput();
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        await this.runLiveTests();
      }
    } else {
      console.log(`\n${this.colors.gray}${this.symbols.info} No API key found. Skipping live tests.${this.colors.reset}`);
    }

    this.printSummary();
  }

  printHeader() {
    console.clear();
    console.log('');
    console.log(`${this.colors.lightBlue}${this.colors.bold}  ✦ PERCEPTOR TEST SUITE${this.colors.reset}`);
    console.log(`${this.colors.gray}  Validating Socratic Method Compliance${this.colors.reset}`);
    console.log('');
    console.log(`${this.colors.gray}  ${'─'.repeat(50)}${this.colors.reset}`);
    console.log('');
  }

  async runMockTests() {
    console.log(`${this.colors.cyan}${this.symbols.star} Running Mock Response Tests${this.colors.reset}`);
    console.log('');

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      await this.runSingleTest(testCase, i + 1, testCases.length, 'MOCK');
    }

    console.log('');
    console.log(`${this.colors.cyan}${this.symbols.star} Running Scenario Tests${this.colors.reset}`);
    console.log('');

    for (let i = 0; i < scenarioTests.length; i++) {
      const scenario = scenarioTests[i];
      await this.runScenarioTest(scenario, i + 1, scenarioTests.length);
    }
  }

  async runLiveTests() {
    console.log('');
    console.log(`${this.colors.magenta}${this.symbols.star} Running Live API Tests${this.colors.reset}`);
    console.log(`${this.colors.gray}  Testing actual tutor responses...${this.colors.reset}`);
    console.log('');

    const liveTestInputs = [
      'How do I create a function in JavaScript?',
      'What is a variable?',
      'My code has an error, can you fix it?',
      'I want to learn about loops',
      'Can you give me the answer to this problem?'
    ];

    for (let i = 0; i < liveTestInputs.length; i++) {
      const input = liveTestInputs[i];
      await this.runLiveTest(input, i + 1, liveTestInputs.length);
    }
  }

  async runSingleTest(testCase, current, total, type) {
    const progress = this.createProgressBar(current, total);
    process.stdout.write(`\r${progress} Testing: ${testCase.description.substring(0, 40)}...`);

    await this.sleep(100);

    const result = this.validator.validateResponse(testCase.userInput, testCase.mockResponse);
    const passed = testCase.expectedResult === 'PASS' ? result.isSocratic : !result.isSocratic;

    this.results.total++;
    if (passed) {
      this.results.passed++;
    } else {
      this.results.failed++;
    }

    this.results.details.push({
      type,
      testCase,
      result,
      passed,
      category: testCase.category
    });

    const status = passed ? 
      `${this.colors.green}${this.symbols.pass}` : 
      `${this.colors.red}${this.symbols.fail}`;
    
    const score = `${result.score}/100`;
    process.stdout.write(`\r${progress} ${status} ${testCase.description} ${this.colors.gray}(${score})${this.colors.reset}\n`);
  }

  async runScenarioTest(scenario, current, total) {
    const progress = this.createProgressBar(current, total);
    
    process.stdout.write(`\r${progress} Testing good response: ${scenario.scenario}...`);
    await this.sleep(100);
    
    const goodResult = this.validator.validateResponse(scenario.userInput, scenario.goodResponse);
    const goodPassed = goodResult.isSocratic;

    process.stdout.write(`\r${progress} Testing bad response: ${scenario.scenario}...`);
    await this.sleep(100);
    
    const badResult = this.validator.validateResponse(scenario.userInput, scenario.badResponse);
    const badPassed = !badResult.isSocratic;

    const overallPassed = goodPassed && badPassed;
    
    this.results.total++;
    if (overallPassed) {
      this.results.passed++;
    } else {
      this.results.failed++;
    }

    const status = overallPassed ? 
      `${this.colors.green}${this.symbols.pass}` : 
      `${this.colors.red}${this.symbols.fail}`;
    
    process.stdout.write(`\r${progress} ${status} ${scenario.description} ${this.colors.gray}(Good: ${goodResult.score}, Bad: ${badResult.score})${this.colors.reset}\n`);
  }

  async runLiveTest(input, current, total) {
    const progress = this.createProgressBar(current, total);
    process.stdout.write(`\r${progress} ${this.colors.lightBlue}${this.symbols.star}${this.colors.reset} Asking: "${input.substring(0, 30)}..."`);

    try {
      const response = await this.tutor.respond(input);
      const result = this.validator.validateResponse(input, response);
      
      this.results.total++;
      if (result.isSocratic) {
        this.results.passed++;
      } else {
        this.results.failed++;
        if (result.score >= 50) {
          this.results.warnings++;
        }
      }

      const status = result.isSocratic ? 
        `${this.colors.green}${this.symbols.pass}` : 
        result.score >= 50 ? 
          `${this.colors.yellow}${this.symbols.warning}` : 
          `${this.colors.red}${this.symbols.fail}`;
      
      process.stdout.write(`\r${progress} ${status} Live test: "${input.substring(0, 30)}..." ${this.colors.gray}(${result.score}/100)${this.colors.reset}\n`);
      
      if (!result.isSocratic) {
        console.log(`${this.colors.gray}    ${this.symbols.arrow} Response: "${response.substring(0, 80)}..."${this.colors.reset}`);
        if (result.violations.length > 0) {
          console.log(`${this.colors.red}    ${this.symbols.arrow} Issues: ${result.violations.map(v => v.type).join(', ')}${this.colors.reset}`);
        }
      }
    } catch (error) {
      process.stdout.write(`\r${progress} ${this.colors.red}${this.symbols.fail} API Error: ${error.message}${this.colors.reset}\n`);
      this.results.total++;
      this.results.failed++;
    }
  }

  createProgressBar(current, total) {
    const percentage = Math.floor((current / total) * 100);
    const filled = Math.floor(percentage / 5);
    const empty = 20 - filled;
    
    const bar = `${'█'.repeat(filled)}${'░'.repeat(empty)}`;
    return `${this.colors.cyan}[${bar}]${this.colors.reset} ${percentage.toString().padStart(3)}%`;
  }

  printSummary() {
    console.log('');
    console.log(`${this.colors.gray}  ${'─'.repeat(50)}${this.colors.reset}`);
    console.log('');
    console.log(`${this.colors.bold}  TEST RESULTS${this.colors.reset}`);
    console.log('');
    
    const passRate = Math.floor((this.results.passed / this.results.total) * 100);
    const passColor = passRate >= 80 ? this.colors.green : passRate >= 60 ? this.colors.yellow : this.colors.red;
    
    console.log(`  ${this.colors.green}${this.symbols.pass} Passed: ${this.results.passed}${this.colors.reset}`);
    console.log(`  ${this.colors.red}${this.symbols.fail} Failed: ${this.results.failed}${this.colors.reset}`);
    if (this.results.warnings > 0) {
      console.log(`  ${this.colors.yellow}${this.symbols.warning} Warnings: ${this.results.warnings}${this.colors.reset}`);
    }
    console.log(`  ${this.colors.gray}${this.symbols.bullet} Total: ${this.results.total}${this.colors.reset}`);
    console.log('');
    console.log(`  ${passColor}${this.symbols.star} Pass Rate: ${passRate}%${this.colors.reset}`);
    console.log('');

    // Category breakdown
    const categories = {};
    this.results.details.forEach(detail => {
      const cat = detail.category || detail.testCase?.category || 'OTHER';
      if (!categories[cat]) categories[cat] = { passed: 0, total: 0 };
      categories[cat].total++;
      if (detail.passed) categories[cat].passed++;
    });

    console.log(`${this.colors.bold}  CATEGORY BREAKDOWN${this.colors.reset}`);
    console.log('');
    Object.entries(categories).forEach(([category, stats]) => {
      const rate = Math.floor((stats.passed / stats.total) * 100);
      const color = rate >= 80 ? this.colors.green : rate >= 60 ? this.colors.yellow : this.colors.red;
      console.log(`  ${color}${category.padEnd(20)} ${stats.passed}/${stats.total} (${rate}%)${this.colors.reset}`);
    });

    console.log('');
    
    if (passRate >= 80) {
      console.log(`${this.colors.green}${this.colors.bold}  🎉 EXCELLENT! Your tutor follows Socratic principles well.${this.colors.reset}`);
    } else if (passRate >= 60) {
      console.log(`${this.colors.yellow}${this.colors.bold}  ⚠️  GOOD, but room for improvement in Socratic method.${this.colors.reset}`);
    } else {
      console.log(`${this.colors.red}${this.colors.bold}  ❌ NEEDS WORK - Too many direct answers detected.${this.colors.reset}`);
    }
    
    console.log('');
  }

  async getUserInput() {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      rl.question('', (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run tests if called directly
if (require.main === module) {
  const runner = new TestRunner();
  runner.runAllTests().catch(console.error);
}

module.exports = TestRunner;
