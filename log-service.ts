import { join } from 'path';
import { pino } from 'pino';

import config from './config.js';

const logger = pino({
  level: 'info',

  transport: {
    targets: [
      {
        target: 'pino-pretty',
        options: {
          translateTime: 'yyyy-mm-dd HH:MM:ss',
          ignore: 'pid,hostname',
        },
      },
      {
        target: 'pino-roll',
        options: {
          file: join(config.logDir, 'log'),
          frequency: parseInt(config.logFrequency),
          mkdir: true,
        },
      },
    ],
  },
});

export default logger;
