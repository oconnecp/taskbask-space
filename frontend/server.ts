import express, {Request, Response} from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { PORT, BACKEND_ORIGIN, ADD_CORS } from './server-constants.js';

const app = express();


// Define __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure CORS to allow requests from the backend
if (ADD_CORS) {
  console.log(`Adding CORS for ${BACKEND_ORIGIN}`);
  app.use(cors({
    origin: BACKEND_ORIGIN,
    credentials: true
  }));
}

// logger middleware
app.use((req: Request ,res:Response,next) =>{
  const time = new Date(Date.now()).toString();
  console.log(req.method,req.hostname, req.path, time);
  next();
});

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, '../dist')));

// Handle all other routes by serving the index.html file
app.get('*', (req, res) => {
  if(req.path !== '/'){
    console.log(`Request to ${req.path} is likely a bot trying to check for vulnerabilities`);
  }
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend server is running on port ${PORT}`);
});