#!/usr/bin/env node
import { displayAsciiArt } from '../utils/logger.js';
import { fetchSamples, getSamples } from '../services/gitService.js';
import { promptSource, promptUser, promptCategory, promptTemplate } from './commands.js';
import { moveSample } from '../services/fileService.js';
import { updateManifestFiles } from '../services/manifestService.js';
import { cleanupTempFiles } from '../utils/helpers.js';
import path from 'path';
import inquirer from 'inquirer';
import { version } from 'os';

async function run() {
  await displayAsciiArt();

  try {
    await cleanupTempFiles();
    const { source } = await promptSource();
    await cleanupTempFiles();
    await fetchSamples(source);

    let sample, destination, samplePath, addonOption;
    if (source === 'custom') {
      const category = await promptCategory();
      sample = await promptTemplate(category);
      // inquirer is used to prompt for the destination folder
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'destination',
          message: 'Enter the destination folder:',
          default: './'
        },
        {
          type: 'input',
          name: 'name',
          message: 'Enter the addon name:',
          default: 'name'
        },
        {
          type: 'input',
          name: 'description',
          message: 'Enter the addon description:',
          default: 'description'
        }
      ]);
      console.warn(JSON.stringify(answers.name));
      addonOption = {
        name: answers.name,
        description: answers.description
      }
      destination = answers.destination;
      samplePath = path.join('./temp-repo-custom', category, sample);
    } else {
      const samples = await getSamples(source);
      if (samples.length === 0) {
        console.error('No samples found in the repository.');
        return;
      }
      const answers = await promptUser(samples);
      sample = answers.sample;
      destination = answers.destination;
      samplePath = path.join('./temp-repo-microsoft', sample);
    }

    const targetPath = path.resolve(destination);
    await moveSample(samplePath, targetPath);

    // Update manifest files after moving the sample
    const relativePath = path.relative(process.cwd(), targetPath);
    await updateManifestFiles(relativePath, destination, addonOption);
  } catch (error) {
    console.error(error.message);
  } finally {
    await cleanupTempFiles();
  }
}

run();
