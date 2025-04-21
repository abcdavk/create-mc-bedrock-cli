import inquirer from 'inquirer';

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
