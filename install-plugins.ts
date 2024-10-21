import { Plugin } from './types/plugin.js';
import download from 'download';
import fs from 'fs';
import os from 'os';
import { PluginInfo } from './types/strategy.js';

export async function installPlugins(
  pluginsInfo: PluginInfo[],
): Promise<Record<string, Plugin>> {
  const plugins: Record<string, Plugin> = {};

  const saveDir = os.homedir() + '/dydx-bot/plugins';

  if (!fs.existsSync(saveDir)) {
    fs.mkdirSync(saveDir, { recursive: true });
  }

  await Promise.all(
    pluginsInfo.map(async (pluginInfo) => {
      try {
        const fileName = `${pluginInfo.name}.js`;
        const filePath = `${saveDir}/${fileName}`;

        if (fs.existsSync(filePath) === false) {
          await download(pluginInfo.url, saveDir, {
            filename: fileName,
          });
        }

        const fileContent = await import(`file://${filePath}`);

        const plugin: Plugin = fileContent.default as Plugin;
        plugins[pluginInfo.name] = plugin;
      } catch (e) {
        console.error('Failed to download plugin:', e);
      }
    }),
  );

  return plugins;
}
