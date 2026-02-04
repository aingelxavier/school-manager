import { getUncachableGitHubClient } from '../server/github.js';
import * as fs from 'fs';
import * as path from 'path';

const OWNER = 'aingelxavier';
const REPO = 'school-manager';

const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  '.cache',
  '.upm',
  '.config',
  '.local',
  'dist',
  'package-lock.json',
  '.replit'
];

function shouldIgnore(filePath: string): boolean {
  return IGNORE_PATTERNS.some(pattern => filePath.includes(pattern));
}

function getAllFiles(dir: string, baseDir: string = dir): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);
    
    if (shouldIgnore(relativePath)) continue;
    
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, baseDir));
    } else {
      files.push(relativePath);
    }
  }
  
  return files;
}

async function main() {
  try {
    const octokit = await getUncachableGitHubClient();
    const projectDir = process.cwd();
    
    console.log('📂 Gathering project files...');
    const files = getAllFiles(projectDir);
    console.log(`Found ${files.length} files to push`);
    
    // Get the default branch ref
    const { data: ref } = await octokit.git.getRef({
      owner: OWNER,
      repo: REPO,
      ref: 'heads/main'
    });
    const latestCommitSha = ref.object.sha;
    
    // Get the tree of the latest commit
    const { data: latestCommit } = await octokit.git.getCommit({
      owner: OWNER,
      repo: REPO,
      commit_sha: latestCommitSha
    });
    
    console.log('📤 Uploading files to GitHub...');
    
    // Create blobs for each file
    const treeItems: any[] = [];
    
    for (const file of files) {
      const filePath = path.join(projectDir, file);
      const content = fs.readFileSync(filePath);
      
      // Check if file is binary
      const isBinary = content.includes(0);
      
      const { data: blob } = await octokit.git.createBlob({
        owner: OWNER,
        repo: REPO,
        content: isBinary ? content.toString('base64') : content.toString('utf-8'),
        encoding: isBinary ? 'base64' : 'utf-8'
      });
      
      treeItems.push({
        path: file,
        mode: '100644',
        type: 'blob',
        sha: blob.sha
      });
      
      process.stdout.write('.');
    }
    
    console.log('\n📝 Creating commit...');
    
    // Create tree
    const { data: tree } = await octokit.git.createTree({
      owner: OWNER,
      repo: REPO,
      base_tree: latestCommit.tree.sha,
      tree: treeItems
    });
    
    // Create commit
    const { data: newCommit } = await octokit.git.createCommit({
      owner: OWNER,
      repo: REPO,
      message: 'Initial commit from Replit',
      tree: tree.sha,
      parents: [latestCommitSha]
    });
    
    // Update ref
    await octokit.git.updateRef({
      owner: OWNER,
      repo: REPO,
      ref: 'heads/main',
      sha: newCommit.sha
    });
    
    console.log('\n✅ Successfully pushed to GitHub!');
    console.log(`\nView your code: https://github.com/${OWNER}/${REPO}`);
    
  } catch (error: any) {
    console.error('❌ Error pushing to GitHub:', error.message);
  }
}

main();
