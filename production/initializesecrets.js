const fs = require('fs');
const path = require('path');

const secretsDir = path.join(__dirname, 'secrets');
const secretFiles = [
  'auth_zero_domain.txt',
  'auth_zero_client_id.txt',
  'auth_zero_client_secret.txt',
  'session_secret.txt',
  'db_encryption_key.txt',
  'watchtower_webhook_secret.txt'
];

// Create the secrets directory if it doesn't exist
if (!fs.existsSync(secretsDir)) {
  fs.mkdirSync(secretsDir, { recursive: true });
  console.log('Created secrets directory.');
} else {
  console.log('Secrets directory already exists.');
}

// Create each secret file if it doesn't exist
secretFiles.forEach(filename => {
  const filePath = path.join(secretsDir, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '', { encoding: 'utf-8' });
    console.log(`Created empty secret file: ${filename}`);
  } else {
    console.log(`Secret file already exists: ${filename}`);
  }
});