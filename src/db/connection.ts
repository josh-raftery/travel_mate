import path from 'path';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

const ENV: string = process.env.NODE_ENV || 'development';

const envPath = `${__dirname}/../../.env.${ENV}`.replace(/\\/g, '/');

dotenv.config({ path: path.resolve(__dirname, `../../.env.${ENV}`) });

// console.log(process.env.PGDATABASE, '<---- database url');
// console.log(envPath, '<---- env path');

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE not set');
}

interface Config {
  connectionString?: string;
  max?: number;
}
const config: Config = {};

if (ENV === 'production') {
  config.connectionString = process.env.DATABASE_URL!;
  config.max = 2;
}

export default new Pool(config);
