#!/usr/bin/env node

import inquirer from 'inquirer';
import simpleGit from 'simple-git';
import path from 'path';
import fs, { mkdir } from 'fs/promises'; 

class BedrockCLI {
  constructor() {
    this.samplesRepo = 'https://github.com/microsoft/minecraft-scripting-samples.git';
    this.tempRepoPath = './temp-repo';
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async displayAsciiArt() {
    const artLines = [
      "---",
      "",
      " ▄▄· ▄▄▄  ▄▄▄ . ▄▄▄· ▄▄▄▄▄▄▄▄ .    ▄▄▄▄· ▄▄▄ .·▄▄▄▄  ▄▄▄         ▄▄· ▄ •▄      ▄▄· ▄▄▌  ▪  ",
      "▐█ ▌▪▀▄ █·▀▄.▀·▐█ ▀█ •██  ▀▄.▀·    ▐█ ▀█▪▀▄.▀·██▪ ██ ▀▄ █·▪     ▐█ ▌▪█▌▄▌▪    ▐█ ▌▪██•  ██ ",
      "██ ▄▄▐▀▀▄ ▐▀▀▪▄▄█▀▀█  ▐█.▪▐▀▀▪▄    ▐█▀▀█▄▐▀▀▪▄▐█· ▐█▌▐▀▀▄  ▄█▀▄ ██ ▄▄▐▀▀▄·    ██ ▄▄██▪  ▐█·",
      "▐███▌▐█•█▌▐█▄▄▌▐█ ▪▐▌ ▐█▌·▐█▄▄▌    ██▄▪▐█▐█▄▄▌██. ██ ▐█•█▌▐█▌.▐▌▐███▌▐█.█▌    ▐███▌▐█▌▐▌▐█▌",
      "·▀▀▀ .▀  ▀ ▀▀▀  ▀  ▀  ▀▀▀  ▀▀▀     ·▀▀▀▀  ▀▀▀ ▀▀▀▀▀• .▀  ▀ ▀█▄▀▪·▀▀▀ ·▀  ▀    ·▀▀▀ .▀▀▀ ▀▀▀",
      "",
      "---",
      "by @keyyard - workspaces from Microsoft Minecraft Scripting Samples",
      "---",
    ];

    for (const line of artLines) {
      console.log(line);
      await this.sleep(100);
    }
  }

  async fetchSamples() {
    const git = simpleGit();
    console.log('Fetching available samples from Microsoft...');
    try {
      await git.clone(this.samplesRepo, this.tempRepoPath, ['--depth', '1']);
    } catch (error) {
      throw new Error(`Error fetching samples: ${error.message}`);
    }
  }

  async getSamples() {
    try {
      const entries = await fs.readdir(this.tempRepoPath, { withFileTypes: true });
      return entries
        .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
        .map(entry => ({ name: entry.name, value: entry.name }));
    } catch (error) {
      console.error('Error reading samples:', error.message);
      return [];
    }
  }

  async promptUser(samples) {
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

  async moveSample(samplePath, targetPath) {
    try {
      await mkdir(path.dirname(targetPath), { recursive: true });
      await fs.rename(samplePath, targetPath);
    console.log('Sample generated successfully!');
    console.log(`🎉 Your project is ready! To get started:
    1. Navigate to your project folder:
       cd ${path.dirname(targetPath)}
    2. Open the project in your code editor:
       code .
    3. Start building your Minecraft Bedrock project! 🚀`);
    } catch (error) {
      throw new Error(`Error moving sample: ${error.message}`);
    }
  }

  async cleanupTempFiles() {
    try {
      await fs.rm(this.tempRepoPath, { recursive: true, force: true });
    } catch (error) {
      console.error('Error cleaning up temporary files:', error.message);
    }
  }

  async run() {
    await this.displayAsciiArt();

    try {
      await this.cleanupTempFiles();
      await this.fetchSamples();
      const samples = await this.getSamples();

      if (samples.length === 0) {
        console.error('No samples found in the repository.');
        return;
      }

      const answers = await this.promptUser(samples);
      const { sample, destination } = answers;

      const targetPath = path.resolve(destination, sample);
      const samplePath = path.join(this.tempRepoPath, sample);

      await this.moveSample(samplePath, targetPath);
    } catch (error) {
      console.error(error.message);
    } finally {
      await this.cleanupTempFiles();
    }
  }
}

const cli = new BedrockCLI();
cli.run();
