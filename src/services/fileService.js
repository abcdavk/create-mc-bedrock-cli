import fs, { mkdir } from 'fs/promises';
import path from 'path';

export async function moveSample(samplePath, targetPath) {
  try {
    await mkdir(targetPath, { recursive: true });
    const entries = await fs.readdir(samplePath, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(samplePath, entry.name);
      const destinationPath = path.join(targetPath, entry.name);

      if (entry.isDirectory()) {
        await moveSample(sourcePath, destinationPath);
      } else {
        await fs.copyFile(sourcePath, destinationPath);
      }
    }

    console.log('Sample workspace generated successfully!');
    console.log(`🎉 Your project is ready! To get started:
  1. Navigate to your project folder:
     cd ${targetPath}
  2. Open the project in your code editor:
     code .
  3. Start building your Minecraft Bedrock project! 🚀`);
  } catch (error) {
    throw new Error(`Error moving sample: ${error.message}`);
  }
}
