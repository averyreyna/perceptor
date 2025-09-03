/**
 * Socratic Method Validator
 * Analyzes tutor responses to ensure they follow Socratic teaching principles
 */

class SocraticValidator {
  constructor() {
    this.directAnswerPatterns = [
      /^(the answer is|here's the answer|the solution is)/i,
      /^(you need to|you should|you must)/i,
      /^(to do this, you)/i,
      /^(first, |second, |third, |step \d+:)/i,
      /^(here's how to|here's the code|use this code)/i,
      /^(copy this|paste this|try this code)/i,
      /^(the correct way is|the right answer is)/i,
      /^(import .+ from|const .+ =|function .+\()/i,
    ];

    this.socraticPatterns = [
      /what do you think/i,
      /why do you think/i,
      /how would you/i,
      /what happens if/i,
      /can you tell me/i,
      /what's your understanding/i,
      /let's think about/i,
      /what would happen/i,
      /have you considered/i,
      /what's the difference/i,
      /\?.*\?/s,
    ];

    this.guidedDiscoveryPatterns = [
      /let's build something/i,
      /let's try/i,
      /let's start with/i,
      /what if we/i,
      /try this and tell me/i,
      /experiment with/i,
      /see what happens/i,
      /report back/i,
    ];

    this.externalReferencePatterns = [
      /check out|look at|visit|go to/i,
      /tutorial|documentation|docs/i,
      /w3schools|mdn|stackoverflow/i,
      /youtube|video|course/i,
      /read about|learn more about/i,
    ];
  }

  validateResponse(userInput, tutorResponse) {
    const results = {
      score: 0,
      maxScore: 100,
      violations: [],
      strengths: [],
      isSocratic: false,
      details: {}
    };

    const directAnswers = this.checkDirectAnswers(tutorResponse);
    if (directAnswers.length > 0) {
      results.violations.push({
        type: 'DIRECT_ANSWER',
        severity: 'HIGH',
        count: directAnswers.length,
        examples: directAnswers.slice(0, 2),
        penalty: -30
      });
      results.score -= 30;
    }

    const externalRefs = this.checkExternalReferences(tutorResponse);
    if (externalRefs.length > 0) {
      results.violations.push({
        type: 'EXTERNAL_REFERENCE',
        severity: 'HIGH',
        count: externalRefs.length,
        examples: externalRefs.slice(0, 2),
        penalty: -25
      });
      results.score -= 25;
    }

    const socraticQuestions = this.checkSocraticQuestions(tutorResponse);
    if (socraticQuestions.length > 0) {
      results.strengths.push({
        type: 'SOCRATIC_QUESTIONS',
        count: socraticQuestions.length,
        examples: socraticQuestions.slice(0, 2),
        bonus: Math.min(socraticQuestions.length * 10, 30)
      });
      results.score += Math.min(socraticQuestions.length * 10, 30);
    }

    const guidedDiscovery = this.checkGuidedDiscovery(tutorResponse);
    if (guidedDiscovery.length > 0) {
      results.strengths.push({
        type: 'GUIDED_DISCOVERY',
        count: guidedDiscovery.length,
        examples: guidedDiscovery.slice(0, 2),
        bonus: Math.min(guidedDiscovery.length * 15, 25)
      });
      results.score += Math.min(guidedDiscovery.length * 15, 25);
    }

    const questionCount = (tutorResponse.match(/\?/g) || []).length;
    const responseLength = tutorResponse.split(' ').length;
    const questionDensity = questionCount / Math.max(responseLength, 1);
    
    if (questionDensity > 0.05) {
      results.strengths.push({
        type: 'GOOD_QUESTION_DENSITY',
        density: questionDensity.toFixed(3),
        bonus: 15
      });
      results.score += 15;
    } else if (questionDensity < 0.02) {
      results.violations.push({
        type: 'LOW_QUESTION_DENSITY',
        severity: 'MEDIUM',
        density: questionDensity.toFixed(3),
        penalty: -10
      });
      results.score -= 10;
    }

    results.score = Math.max(0, Math.min(100, results.score + 50));
    results.isSocratic = results.score >= 70 && results.violations.filter(v => v.severity === 'HIGH').length === 0;

    results.details = {
      questionCount,
      questionDensity: questionDensity.toFixed(3),
      responseLength,
      directAnswerCount: directAnswers.length,
      socraticQuestionCount: socraticQuestions.length
    };

    return results;
  }

  checkDirectAnswers(response) {
    const matches = [];
    for (const pattern of this.directAnswerPatterns) {
      const match = response.match(pattern);
      if (match) {
        matches.push(match[0]);
      }
    }
    return matches;
  }

  checkExternalReferences(response) {
    const matches = [];
    for (const pattern of this.externalReferencePatterns) {
      const match = response.match(pattern);
      if (match) {
        matches.push(match[0]);
      }
    }
    return matches;
  }

  checkSocraticQuestions(response) {
    const matches = [];
    for (const pattern of this.socraticPatterns) {
      const match = response.match(pattern);
      if (match) {
        matches.push(match[0]);
      }
    }
    return matches;
  }

  checkGuidedDiscovery(response) {
    const matches = [];
    for (const pattern of this.guidedDiscoveryPatterns) {
      const match = response.match(pattern);
      if (match) {
        matches.push(match[0]);
      }
    }
    return matches;
  }
}

module.exports = SocraticValidator;
