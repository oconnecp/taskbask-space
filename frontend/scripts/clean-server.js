import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, '../server-dist');

const cleanServer = () => {
  if (fs.existsSync(src)) {
    // Remove all files and directories in the server directory
    console.log(`Cleaning server directory: ${src}`);
    fs.readdirSync(src).forEach(file => {
      const filePath = path.join(src, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        fs.rmSync(filePath, { recursive: true });
      } else {
        fs.unlinkSync(filePath);
      } 
    });
    console.log(`Cleaned server directory: ${src}`);
  } else {
    console.log(`Server directory does not exist: ${src}`);
  }
};

cleanServer();