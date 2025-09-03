# Perceptor Test Suite 🧪

A comprehensive testing framework to validate that your Perceptor CLI coding tutor follows Socratic teaching principles and doesn't give direct answers.

## Features

- **Socratic Method Validation**: Detects direct answers, external references, and validates questioning techniques
- **Cool Terminal Effects**: Progress bars, animations, and colorful output
- **Comprehensive Test Cases**: Mock responses and live API testing
- **Detailed Reporting**: Category breakdowns and actionable feedback

## Quick Start

```bash
# Run all tests (mock + live if API key available)
npm test

# Run only mock tests (no API calls)
npm run test:mock

# Run with specific focus on Socratic validation
npm run test:socratic
```

## What It Tests

### ❌ Violations (Bad Socratic Teaching)
- **Direct Answers**: "The answer is...", "Here's the code..."
- **External References**: "Check out MDN", "Go to YouTube"
- **Prescriptive Solutions**: "You need to...", "You should..."
- **Low Question Density**: Not enough guiding questions

### ✅ Good Practices (Socratic Method)
- **Socratic Questions**: "What do you think?", "Why might that be?"
- **Guided Discovery**: "Let's build something", "Try this and tell me..."
- **Immediate Practice**: Starting with hands-on activities
- **Question-Rich Responses**: High density of guiding questions

## Test Categories

1. **DIRECT_ANSWERS**: Catches responses that give solutions directly
2. **EXTERNAL_REFERENCES**: Detects suggestions to use external resources
3. **SOCRATIC_GOOD**: Validates proper Socratic questioning
4. **EDGE_CASES**: Tests handling of vague or unusual requests
5. **MIXED**: Borderline cases that require nuanced evaluation

## Scoring System

- **Base Score**: 50 points
- **Socratic Questions**: +10 points each (max +30)
- **Guided Discovery**: +15 points each (max +25)
- **Good Question Density**: +15 points
- **Direct Answers**: -30 points each
- **External References**: -25 points each
- **Low Question Density**: -10 points

**Pass Threshold**: 70+ points with no high-severity violations

## Example Output

```
✦ PERCEPTOR TEST SUITE
Validating Socratic Method Compliance

[████████████████████] 100% ✓ Should detect direct answer pattern (45/100)
[████████████████████] 100% ✓ Should recognize Socratic questioning (85/100)

TEST RESULTS
✓ Passed: 12
✗ Failed: 2
• Total: 14
✦ Pass Rate: 86%

🎉 EXCELLENT! Your tutor follows Socratic principles well.
```

## Understanding Results

- **Green ✓**: Test passed - good Socratic behavior
- **Red ✗**: Test failed - detected violations
- **Yellow ⚠**: Warning - borderline behavior
- **Score**: Higher is better (0-100 scale)

## Tips for Improvement

If tests are failing:

1. **Reduce Direct Answers**: Replace "The answer is..." with "What do you think...?"
2. **Add More Questions**: Aim for 1 question per 20 words
3. **Remove External References**: Keep all learning within the conversation
4. **Use Guided Discovery**: Start with "Let's build..." instead of explaining concepts
5. **Practice Immediate Application**: Give students something to try right away

## Files

- `socratic-validator.js`: Core validation logic
- `test-cases.js`: Comprehensive test scenarios
- `test-runner.js`: Main test execution with animations
- `README.md`: This documentation
