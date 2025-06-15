import fs, { mkdir } from 'fs/promises';
import path from 'path';

export async function moveSample(samplePath, targetPath, isRoot = true) {
  try {
    await mkdir(targetPath, { recursive: true });
    const entries = await fs.readdir(samplePath, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(samplePath, entry.name);
      const destinationPath = path.join(targetPath, entry.name);

      if (entry.isDirectory()) {
        await moveSample(sourcePath, destinationPath, false);
      } else {
        await fs.copyFile(sourcePath, destinationPath);
      }
    }

    if (isRoot) {
      console.log('Sample workspace generated successfully!');
      console.log(`🎉 Your project is ready! To get started:\n  1. Navigate to your project folder:\n     cd ${targetPath}\n  2. Open the project in your code editor:\n     code .\n  3. Start building your Minecraft Bedrock project! 🚀`);
    }
  } catch (error) {
    throw new Error(`Error moving sample: ${error.message}`);
  }
}
