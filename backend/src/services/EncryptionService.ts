import crypto from 'crypto';

export const encrypt = (text: string, secret: string): string => {
  const iv = crypto.randomBytes(16); // Generate a random initialization vector
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secret, 'utf-8'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted; // Include IV with the encrypted text
};

export const decrypt = (encryptedText: string, secret: string): string => {
  const [ivHex, encryptedData] = encryptedText.split(':'); // Split IV and encrypted data
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secret, 'utf-8'), iv);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};