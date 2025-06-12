import inquirer from 'inquirer';
import { getSourceOptions } from '../services/gitService.js';

export async function promptSource() {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'source',
      message: 'Select a template source:',
      choices: getSourceOptions()
    }
  ]);
}

export async function promptUser(samples) {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'sample',
      message: 'Select a sample to clone:',
      choices: samples
    },
    {
      type: 'input',
      name: 'destination',
      message: 'Enter the destination folder:',
      default: './'
    }
  ]);
}
