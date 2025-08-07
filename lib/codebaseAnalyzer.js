const fs = require('fs');
const path = require('path');

class CodebaseAnalyzer {
  constructor() {
    this.ignoredDirs = ['node_modules', '.git', 'dist', 'build', '.next', 'coverage'];
    this.ignoredFiles = ['.env', '.env.local', '.DS_Store'];
    this.programmingExtensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.cs', '.php', '.rb', '.go', '.rs', '.swift', '.kt'];
    this.configExtensions = ['.json', '.yaml', '.yml', '.toml', '.ini', '.cfg'];
  }

  analyzeDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
      throw new Error(`Directory does not exist: ${dirPath}`);
    }

    const analysis = {
      rootPath: dirPath,
      structure: this.buildDirectoryTree(dirPath),
      summary: {
        totalFiles: 0,
        totalDirectories: 0,
        programmingFiles: {},
        configFiles: [],
        packageFiles: [],
        documentationFiles: []
      },
      insights: []
    };

    this.analyzeStructure(analysis.structure, analysis.summary);
    this.generateInsights(analysis);
    
    return analysis;
  }

  buildDirectoryTree(dirPath, maxDepth = 3, currentDepth = 0) {
    if (currentDepth >= maxDepth) {
      return null;
    }

    const stats = fs.statSync(dirPath);
    const name = path.basename(dirPath);

    if (this.ignoredDirs.includes(name)) {
      return null;
    }

    const node = {
      name,
      path: dirPath,
      type: stats.isDirectory() ? 'directory' : 'file',
      extension: stats.isFile() ? path.extname(name) : null,
      children: []
    };

    if (stats.isDirectory()) {
      try {
        const children = fs.readdirSync(dirPath);
        for (const child of children) {
          const childPath = path.join(dirPath, child);
          const childNode = this.buildDirectoryTree(childPath, maxDepth, currentDepth + 1);
          if (childNode) {
            node.children.push(childNode);
          }
        }
      } catch (error) {
        // Skip directories that can't be read
      }
    }

    return node;
  }

  analyzeStructure(node, summary) {
    if (!node) return;

    if (node.type === 'directory') {
      summary.totalDirectories++;
      node.children.forEach(child => this.analyzeStructure(child, summary));
    } else {
      summary.totalFiles++;
      const ext = node.extension;
      const name = node.name;

      if (this.programmingExtensions.includes(ext)) {
        if (!summary.programmingFiles[ext]) {
          summary.programmingFiles[ext] = [];
        }
        summary.programmingFiles[ext].push(name);
      } else if (this.configExtensions.includes(ext)) {
        summary.configFiles.push(name);
      } else if (['package.json', 'package-lock.json', 'yarn.lock', 'requirements.txt', 'Gemfile', 'Cargo.toml', 'go.mod'].includes(name)) {
        summary.packageFiles.push(name);
      } else if (['.md', '.txt', '.rst'].includes(ext) || name.toLowerCase().includes('readme')) {
        summary.documentationFiles.push(name);
      }
    }
  }

  generateInsights(analysis) {
    const { summary } = analysis;

    // Determine project type
    if (summary.packageFiles.includes('package.json')) {
      analysis.insights.push('This appears to be a Node.js/JavaScript project');
      
      if (summary.programmingFiles['.tsx'] || summary.programmingFiles['.jsx']) {
        analysis.insights.push('Uses React components (JSX/TSX files detected)');
      }
      if (summary.programmingFiles['.ts']) {
        analysis.insights.push('Uses TypeScript for type safety');
      }
    } else if (summary.packageFiles.includes('requirements.txt')) {
      analysis.insights.push('This appears to be a Python project');
    } else if (summary.packageFiles.includes('Cargo.toml')) {
      analysis.insights.push('This appears to be a Rust project');
    }

    // Architecture insights
    const hasLibDir = analysis.structure.children.some(child => child.name === 'lib');
    const hasSrcDir = analysis.structure.children.some(child => child.name === 'src');
    
    if (hasLibDir) {
      analysis.insights.push('Uses lib/ directory for main code organization');
    }
    if (hasSrcDir) {
      analysis.insights.push('Uses src/ directory for source code');
    }

    // File organization
    const jsFiles = summary.programmingFiles['.js'] || [];
    if (jsFiles.length > 0) {
      analysis.insights.push(`Contains ${jsFiles.length} JavaScript files`);
    }

    if (summary.configFiles.length > 0) {
      analysis.insights.push(`Has ${summary.configFiles.length} configuration files`);
    }
  }

  formatAnalysisForLLM(analysis) {
    let output = `# Codebase Structure Analysis

**Root Directory:** ${path.basename(analysis.rootPath)}

## Project Overview
${analysis.insights.join('\n')}

## File Summary
- **Total Files:** ${analysis.summary.totalFiles}
- **Total Directories:** ${analysis.summary.totalDirectories}

## Programming Files
${Object.entries(analysis.summary.programmingFiles).map(([ext, files]) => 
  `**${ext}** (${files.length}): ${files.slice(0, 5).join(', ')}${files.length > 5 ? '...' : ''}`
).join('\n')}

## Important Files
- **Package/Dependency Files:** ${analysis.summary.packageFiles.join(', ') || 'None'}
- **Config Files:** ${analysis.summary.configFiles.join(', ') || 'None'}
- **Documentation:** ${analysis.summary.documentationFiles.join(', ') || 'None'}

## Directory Structure
${this.formatDirectoryTree(analysis.structure, '', 0, 2)}
`;

    return output;
  }

  formatDirectoryTree(node, prefix, depth, maxDepth) {
    if (!node || depth >= maxDepth) return '';
    
    let result = `${prefix}${node.name}${node.type === 'directory' ? '/' : ''}\n`;
    
    if (node.type === 'directory' && node.children.length > 0) {
      const sortedChildren = node.children.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'directory' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });

      sortedChildren.slice(0, 10).forEach((child, index) => {
        const isLast = index === sortedChildren.length - 1 || index === 9;
        const childPrefix = prefix + (isLast ? '└── ' : '├── ');
        const nextPrefix = prefix + (isLast ? '    ' : '│   ');
        result += this.formatDirectoryTree(child, childPrefix, depth + 1, maxDepth);
      });

      if (sortedChildren.length > 10) {
        result += `${prefix}└── ... (${sortedChildren.length - 10} more items)\n`;
      }
    }
    
    return result;
  }

  analyzeCurrentDirectory() {
    return this.analyzeDirectory(process.cwd());
  }
}

module.exports = CodebaseAnalyzer;