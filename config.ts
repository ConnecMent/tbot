// import env file with 'dotenv'

import dotenv from 'dotenv';
dotenv.config({ path: ['.env.local', '.env'] });

const config = {
  logDir: process.env.LOG_DIR!,
  logFrequency: process.env.LOG_FREQUENCY!,
  strategiesFilePath: process.env.STRATEGIES_FILE_PATH as string,
  mnemonic: process.env.MNEMONIC!,
};

export default config;
