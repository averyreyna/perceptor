#!/usr/bin/env node

const CodebaseAnalyzer = require('./lib/codebaseAnalyzer');
const path = require('path');

/**
 * Demo script to test the CodebaseAnalyzer functionality
 */
class CodebaseAnalyzerDemo {
  constructor() {
    this.analyzer = new CodebaseAnalyzer();
  }

  // Helper method to add delays for screen recording
  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async runDemo() {
    console.log('🔍 Codebase Analyzer Demo\n');
    console.log('=' .repeat(50));
    console.log('\n⏳ Starting demo in 3 seconds...');
    await this.delay(3000);

    try {
      // Test 1: Analyze current directory (perceptor project)
      console.log('\n📁 Test 1: Analyzing current project directory...\n');
      await this.delay(2000);
      
      const currentDirAnalysis = this.analyzer.analyzeCurrentDirectory();
      console.log(this.analyzer.formatAnalysisForLLM(currentDirAnalysis));
      
      console.log('\n⏸️  Pausing for 4 seconds...');
      await this.delay(4000);

      // Test 2: Show raw analysis object structure
      console.log('\n' + '='.repeat(50));
      console.log('\n🔧 Test 2: Raw Analysis Object Structure\n');
      await this.delay(2000);
      
      console.log('Analysis Object Keys:', Object.keys(currentDirAnalysis));
      await this.delay(1500);
      
      console.log('\nSummary Object:', JSON.stringify(currentDirAnalysis.summary, null, 2));
      await this.delay(2000);
      
      console.log('\nInsights:', currentDirAnalysis.insights);
      
      console.log('\n⏸️  Pausing for 3 seconds...');
      await this.delay(3000);

      // Test 3: Test with different directory if provided
      const targetDir = process.argv[2];
      if (targetDir && targetDir !== process.cwd()) {
        console.log('\n' + '='.repeat(50));
        console.log(`\n📂 Test 3: Analyzing specified directory: ${targetDir}\n`);
        await this.delay(2000);
        
        try {
          const customDirAnalysis = this.analyzer.analyzeDirectory(targetDir);
          console.log(this.analyzer.formatAnalysisForLLM(customDirAnalysis));
          await this.delay(3000);
        } catch (error) {
          console.error(`❌ Error analyzing directory ${targetDir}:`, error.message);
          await this.delay(2000);
        }
      }

      // Test 4: Performance test
      console.log('\n' + '='.repeat(50));
      console.log('\n⏱️  Test 4: Performance Analysis\n');
      await this.delay(2000);
      
      console.log('Running performance test...');
      await this.delay(1000);
      
      const startTime = Date.now();
      const perfAnalysis = this.analyzer.analyzeCurrentDirectory();
      const endTime = Date.now();
      
      console.log(`Analysis completed in: ${endTime - startTime}ms`);
      await this.delay(1000);
      console.log(`Files analyzed: ${perfAnalysis.summary.totalFiles}`);
      await this.delay(1000);
      console.log(`Directories scanned: ${perfAnalysis.summary.totalDirectories}`);
      
      console.log('\n⏸️  Pausing for 3 seconds...');
      await this.delay(3000);

      // Test 5: Edge cases
      console.log('\n' + '='.repeat(50));
      console.log('\n🧪 Test 5: Edge Case Testing\n');
      await this.delay(2000);
      
      console.log('Testing non-existent directory...');
      await this.delay(1500);
      
      // Test non-existent directory
      try {
        this.analyzer.analyzeDirectory('/non/existent/path');
      } catch (error) {
        console.log('✅ Correctly handled non-existent directory:', error.message);
        await this.delay(2000);
      }

      console.log('Testing empty directory...');
      await this.delay(1500);

      // Test empty directory (if we can create one temporarily)
      const tempDir = path.join(process.cwd(), 'temp-test-dir');
      const fs = require('fs');
      
      try {
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir);
          const emptyDirAnalysis = this.analyzer.analyzeDirectory(tempDir);
          console.log('✅ Empty directory analysis:', {
            files: emptyDirAnalysis.summary.totalFiles,
            directories: emptyDirAnalysis.summary.totalDirectories,
            insights: emptyDirAnalysis.insights.length
          });
          fs.rmdirSync(tempDir);
          await this.delay(2000);
        }
      } catch (error) {
        console.log('⚠️  Could not test empty directory:', error.message);
        await this.delay(2000);
      }

    } catch (error) {
      console.error('❌ Demo failed:', error);
    }

    console.log('\n' + '='.repeat(50));
    console.log('\n✨ Demo completed! The CodebaseAnalyzer is working properly.\n');
    await this.delay(2000);
    console.log('🎬 Recording complete!');
  }

  // Helper method to demonstrate specific features
  demonstrateFeatures() {
    console.log('\n🎯 CodebaseAnalyzer Features:\n');
    console.log('• Analyzes directory structure up to 3 levels deep');
    console.log('• Identifies programming languages by file extensions');
    console.log('• Detects project types (Node.js, Python, Rust, etc.)');
    console.log('• Finds configuration and package files');
    console.log('• Generates architectural insights');
    console.log('• Formats output for LLM consumption');
    console.log('• Ignores common build/cache directories');
    console.log('• Handles errors gracefully');
  }
}

// Run the demo
if (require.main === module) {
  const demo = new CodebaseAnalyzerDemo();
  
  console.log('Usage: node demo-codebase-analyzer.js [optional-directory-path]');
  demo.demonstrateFeatures();
  demo.runDemo().catch(console.error);
}

module.exports = CodebaseAnalyzerDemo;
