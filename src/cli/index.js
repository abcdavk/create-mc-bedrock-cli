#!/usr/bin/env node
import { displayAsciiArt } from '../utils/logger.js';
import { fetchSamples, getSamples } from '../services/gitService.js';
import { promptSource, promptUser } from './commands.js';
import { moveSample } from '../services/fileService.js';
import { updateManifestFiles } from '../services/manifestService.js';
import { cleanupTempFiles } from '../utils/helpers.js';
import path from 'path';

async function run() {
  await displayAsciiArt();

  try {
    await cleanupTempFiles();
    const { source } = await promptSource();
    await fetchSamples(source);
    const samples = await getSamples(source);

    if (samples.length === 0) {
      console.error('No samples found in the repository.');
      return;
    }

    const answers = await promptUser(samples);
    const { sample, destination } = answers;

    const targetPath = path.resolve(destination);
    const samplePath = path.join(source === 'microsoft' ? './temp-repo-microsoft' : './temp-repo-custom', sample);

    await moveSample(samplePath, targetPath);

    // Update manifest files after moving the sample
    const relativePath = path.relative(process.cwd(), targetPath);
    await updateManifestFiles(relativePath, destination);
  } catch (error) {
    console.error(error.message);
  } finally {
    await cleanupTempFiles();
  }
}

run();
