import simpleGit from 'simple-git';
import fs from 'fs/promises';

const samplesRepo = 'https://github.com/microsoft/minecraft-scripting-samples.git';
const tempRepoPath = './temp-repo';

export async function fetchSamples() {
  const git = simpleGit();
  console.log('Fetching available samples from Microsoft...');
  try {
    await git.clone(samplesRepo, tempRepoPath, ['--depth', '1']);
  } catch (error) {
    throw new Error(`Error fetching samples: ${error.message}`);
  }
}

export async function getSamples() {
  try {
    const entries = await fs.readdir(tempRepoPath, { withFileTypes: true });
    const samples = entries
      .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
      .map(entry => ({
        name: entry.name === 'ts-starter' ? '⭐ ts-starter' : entry.name,
        value: entry.name
      }));

    // Move the starred template to the top
    samples.sort((a, b) => {
      if (a.value === 'ts-starter') return -1;
      if (b.value === 'ts-starter') return 1;
      return 0;
    });

    return samples;
  } catch (error) {
    console.error('Error reading samples:', error.message);
    return [];
  }
}
