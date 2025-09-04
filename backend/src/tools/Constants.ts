import { createHmac, randomBytes } from 'crypto';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

export const PORT = process.env.PORT || 5000;
export const HOSTNAME = process.env.HOSTNAME || 'localhost';
export const MODE = process.env.MODE || 'development';
console.log('MODE', process.env.MODE);
console.log('HOSTNAME:', HOSTNAME);

export const FRONTEND_ORIGIN = HOSTNAME === 'localhost' ? 'http://localhost:3000' : `https://${HOSTNAME}`;
export const BACKEND_ORIGIN = HOSTNAME === 'localhost' ? 'http://localhost:5000' : `https://${HOSTNAME}`;
export const ADD_CORS = process.env.ADD_CORS || HOSTNAME === 'localhost';

// Generate a random SHA-256 hash if SESSION_SECRET is not provided
const sessionSecretFromEnv = process.env.SESSION_SECRET;
export const SESSION_SECRET = process.env.SESSION_SECRET || createHmac('sha256', randomBytes(32)).digest('hex');
if (SESSION_SECRET !== sessionSecretFromEnv){
  console.warn('Using a randomly generated SESSION_SECRET, this will invalidate all existing sessions upon server restart!');
}

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID && readSecretFile(process.env.GOOGLE_CLIENT_ID) || 'test';
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET && readSecretFile(process.env.GOOGLE_CLIENT_SECRET) || 'test';

if (GOOGLE_CLIENT_ID === 'test' || GOOGLE_CLIENT_SECRET === 'test') {
  console.error('Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in environment');
}

export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID && readSecretFile(process.env.GITHUB_CLIENT_ID) || 'test';
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET && readSecretFile(process.env.GITHUB_CLIENT_SECRET) || 'test';

if (GITHUB_CLIENT_ID === 'test' || GITHUB_CLIENT_SECRET === 'test') {
  console.error('Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET in environment');
}

export const DB_HOST = process.env.DB_HOST || 'db';
export const DB_PORT = process.env.DB_PORT || '5432';
export const DB_USERNAME = process.env.DB_USERNAME || 'user';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'password';
export const DB_NAME = process.env.DB_NAME || 'mydb';

// Must be 32 characters for AES-256
export const DB_ENCRYPTION_KEY = process.env.DB_ENCRYPTION_KEY && readSecretFile(process.env.DB_ENCRYPTION_KEY) || 'secretsecretsecretsecretsecretse'; 
if (DB_ENCRYPTION_KEY.length !== 32) {
  throw new Error('ENCRYPTION_KEY must be 32 characters long for AES-256 encryption.');
}
if(DB_ENCRYPTION_KEY === 'secretsecretsecretsecretsecretse') {  
  console.error('Using default DB_ENCRYPTION_KEY, this is insecure for production!');
}

function readSecretFile(filePath: string): string {
  try {
    var filename = require.resolve(filePath);
    return fs.readFileSync(filename, 'utf8').trim();

  } catch (error) {
    console.error(`Error reading secret file at ${filePath}:`, error);
    return 'test';
  }
}