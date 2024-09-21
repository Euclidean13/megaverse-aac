import { Logger } from 'tslog';
import { initConfig } from './config.js';

export const logger = new Logger({
  minLevel: getTSLogLevel(),
});

function getTSLogLevel(): number | undefined {
  initConfig();
  switch (process.env.MIN_LOG_LEVEL) {
    case 'silly':
      return 0;
    case 'trace':
      return 1;
    case 'debug':
      return 2;
    case 'info':
      return 3;
    case 'warn':
      return 4;
    case 'error':
      return 5;
    case 'fatal':
      return 6;
    default:
      return undefined;
  }
}
