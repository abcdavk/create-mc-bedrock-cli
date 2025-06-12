import simpleGit from 'simple-git';
import fs from 'fs/promises';

const sources = {
  microsoft: {
    name: 'Microsoft Official Templates',
    repo: 'https://github.com/microsoft/minecraft-scripting-samples.git',
    tempRepoPath: './temp-repo-microsoft'
  },
  custom: {
    name: '⭐ Custom Templates',
    repo: 'https://github.com/Keyyard/custom-mc-scripting-templates.git',
    tempRepoPath: './temp-repo-custom'
  }
};

export async function fetchSamples(sourceKey) {
  const source = sources[sourceKey];
  const git = simpleGit();
  console.log(`Fetching available samples from ${source.name}...`);
  try {
    await git.clone(source.repo, source.tempRepoPath, ['--depth', '1']);
  } catch (error) {
    throw new Error(`Error fetching samples: ${error.message}`);
  }
}

export async function getSamples(sourceKey) {
  const source = sources[sourceKey];
  try {
    const entries = await fs.readdir(source.tempRepoPath, { withFileTypes: true });
    const samples = entries
      .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
      .map(entry => ({
        name: entry.name === 'ts-starter' ? '⭐ ts-starter' : entry.name,
        value: entry.name
      }));
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

//** */
// We use Object.entries to iterate over the sources object
// and return an array of options for the inquirer prompt.
// This allows us to dynamically generate the list of sources
// based on the sources defined in the service. 
// */
export function getSourceOptions() {
  return Object.entries(sources).map(([key, source]) => ({
    name: source.name,
    value: key
  }));
}
