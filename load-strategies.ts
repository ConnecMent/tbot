import { Strategy } from './types/strategy.js';
import { strategySchema } from './validations/strategy-schema.js';
import { readFileSync } from 'fs';
import config from './config.js';

export const loadStrategies = async (): Promise<Strategy[]> => {
  const loadedStrategies: Strategy[] = [];

  try {
    const loadedFile = readFileSync(config.strategiesFilePath, 'utf-8');
    const importedJson: Strategy[] = JSON.parse(loadedFile);

    importedJson.forEach((strategy) => {
      const isValid = Object.keys(strategySchema).every((key) => {
        const typedKey = key as keyof Strategy;
        return strategySchema[typedKey](strategy[typedKey]);
      });

      if (!isValid) {
        throw new Error('Invalid strategy file');
      }
      loadedStrategies.push(strategy as Strategy);
    });
  } catch (error) {
    console.error(
      `Error loading a strategy file ${config.strategiesFilePath}: ${error}`,
    );
  }

  return loadedStrategies;
};
