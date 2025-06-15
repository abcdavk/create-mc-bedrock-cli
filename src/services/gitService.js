import simpleGit from 'simple-git';
import fs from 'fs/promises';
import { cleanupTempFiles } from '../utils/helpers.js';
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

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Clones the repository of the specified source to a temporary directory.
 * Cleans up any existing temporary files before cloning.
 * 
 * @param {string} sourceKey - The key identifying which source's repository to fetch.
 * @throws {Error} If there is an issue during the cloning process.
 */

/*******  89492e88-f3ed-424e-9dc3-870acd86612f *******/
export async function fetchSamples(sourceKey) {
  const source = sources[sourceKey];
  const git = simpleGit();
  console.log(`Fetching available samples from ${source.name}...`);
  await cleanupTempFiles();
  try {
    await git.clone(source.repo, source.tempRepoPath, ['--depth', '1']);
  } catch (error) {
    if (error.message && error.message.includes('spawn git ENOENT')) {
      throw new Error('Git is not installed or not found in your PATH. Please install Git from https://git-scm.com/downloads and try again.');
    }
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

/**
 * Returns a list of source options for the user to select from.
 * @returns {import('inquirer').ListChoice[]} A list of source options.
 */
export function getSourceOptions() {
  return Object.entries(sources).map(([key, source]) => ({
    name: source.name,
    value: key
  }));
}
