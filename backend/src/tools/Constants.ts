import { createHmac, randomBytes } from 'crypto';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

function isValidSHA256Hex(str: string): boolean {
  return /^[a-fA-F0-9]{64}$/.test(str);
}

function ensureSecretOrSecretFileRead(secretData: string): string| null {
  if (secretData.startsWith('/run/secrets/')) {
    return readSecretFile(secretData);
  }
  return secretData;
}

function readSecretFile(filePath: string): string | null {
  try {
    var filename = require.resolve(filePath);
    return fs.readFileSync(filename, 'utf8').trim();

  } catch (error) {
    console.error(`Error reading secret file at ${filePath}:`, error);
    return null;
  }
}

// Application constants and configuration
export const PORT = process.env.PORT || 5000;
export const HOSTNAME = process.env.HOSTNAME || 'localhost';
export const MODE = process.env.MODE || 'development';
console.log('MODE', process.env.MODE);
console.log('HOSTNAME:', HOSTNAME);

export const FRONTEND_ORIGIN = HOSTNAME === 'localhost' ? 'http://localhost:3000' : `https://${HOSTNAME}`;
export const BACKEND_ORIGIN = HOSTNAME === 'localhost' ? 'http://localhost:5000' : `https://${HOSTNAME}`;
export const ADD_CORS = process.env.ADD_CORS || HOSTNAME === 'localhost';

// Generate a random SHA-256 hash if SESSION_SECRET is not provided
const sessionSecretFromEnv = process.env.SESSION_SECRET && ensureSecretOrSecretFileRead(process.env.SESSION_SECRET);
export const SESSION_SECRET = process.env.SESSION_SECRET || createHmac('sha256', randomBytes(32)).digest('hex');

if (!isValidSHA256Hex(SESSION_SECRET)) {
  console.error('SESSION_SECRET must be a valid SHA-256 hex string (64 hex characters).');
  process.exit(1);
}

if (SESSION_SECRET !== sessionSecretFromEnv) {
  console.warn('Using a randomly generated SESSION_SECRET, this will invalidate all existing sessions upon server restart!');
}


export const AUTH_ZERO_DOMAIN = process.env.AUTH_ZERO_DOMAIN && ensureSecretOrSecretFileRead(process.env.AUTH_ZERO_DOMAIN) || 'test';
export const AUTH_ZERO_CLIENT_ID = process.env.AUTH_ZERO_CLIENT_ID && ensureSecretOrSecretFileRead(process.env.AUTH_ZERO_CLIENT_ID) || 'test';
export const AUTH_ZERO_CLIENT_SECRET = process.env.AUTH_ZERO_CLIENT_SECRET && ensureSecretOrSecretFileRead(process.env.AUTH_ZERO_CLIENT_SECRET) || 'test';

if (AUTH_ZERO_DOMAIN === 'test' || AUTH_ZERO_CLIENT_ID === 'test' || AUTH_ZERO_CLIENT_SECRET === 'test') {
  console.error('Missing AUTH_ZERO_DOMAIN or AUTH_ZERO_AUDIENCE in environment');
}

export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = process.env.DB_PORT || '5432';
export const DB_USERNAME = process.env.DB_USERNAME || 'user';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'password';
export const DB_NAME = process.env.DB_NAME || 'mydb';

// Must be 32 characters for AES-256
export const DB_ENCRYPTION_KEY = process.env.DB_ENCRYPTION_KEY && ensureSecretOrSecretFileRead(process.env.DB_ENCRYPTION_KEY) || 'secretsecretsecretsecretsecretse'; 
if (DB_ENCRYPTION_KEY.length !== 32) {
  throw new Error('ENCRYPTION_KEY must be 32 characters long for AES-256 encryption.');
}
if(DB_ENCRYPTION_KEY === 'secretsecretsecretsecretsecretse') {  
  console.error('Using default DB_ENCRYPTION_KEY, this is insecure for production!');
}