import { createRepository } from '../server/github.js';

async function main() {
  try {
    console.log('Creating GitHub repository "school-manager"...');
    const repo = await createRepository('school-manager', 'School Manager Application', false);
    console.log('\n✅ Repository created successfully!');
    console.log(`\nRepository URL: ${repo.html_url}`);
    console.log(`Clone URL: ${repo.clone_url}`);
    console.log(`\nYou can now push your code to this repository.`);
  } catch (error: any) {
    console.error('❌ Error creating repository:', error.message);
    if (error.status === 422) {
      console.error('This repository name might already exist in your GitHub account.');
    }
  }
}

main();
