import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function updateManifestFiles(destination, userInputName) {
  const manifestPaths = [
    path.join(destination, 'behavior_packs', 'starter', 'manifest.json'),
    path.join(destination, 'resource_packs', 'starter', 'manifest.json')
  ];

  for (const manifestPath of manifestPaths) {
    try {
      const manifestExists = await fs.access(manifestPath).then(() => true).catch(() => false);
      if (!manifestExists) continue;

      const manifestContent = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));

      // Update UUIDs
      manifestContent.header.uuid = uuidv4();
      if (manifestContent.modules) {
        manifestContent.modules.forEach(module => {
          module.uuid = uuidv4();
          module.description = `Generated from npx create-mc-bedrock`;
        });
      }

      // Update name and description based on user input and type (RP/BP)
      const type = manifestPath.includes('behavior_packs') ? 'BP' : 'RP';
      manifestContent.header.name = `${userInputName} ${type}`;
      manifestContent.header.description = `Generated from npx create-mc-bedrock`;

      // Write updated manifest back to file
      await fs.writeFile(manifestPath, JSON.stringify(manifestContent, null, 2), 'utf-8');
    } catch (error) {
      console.error(`Error updating manifest at ${manifestPath}:`, error.message);
    }
  }
}
