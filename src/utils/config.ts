import * as dotenv from 'dotenv';
import path from 'path';

export function initConfig() {
  dotenv.config();
  const __dirname = path.resolve();
  let auxPath;
  switch (process.env.NODE_ENV) {
    case 'production':
      auxPath = `${__dirname}/.env.production`;
      break;
    default:
      auxPath = `${__dirname}/.env.development`;
  }
  return dotenv.config({ path: auxPath });
}
