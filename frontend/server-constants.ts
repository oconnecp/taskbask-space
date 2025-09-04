import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const HOSTNAME = process.env.HOSTNAME || 'localhost';

console.log('HOSTNAME:', HOSTNAME);
console.log('MODE', process.env.MODE);
if(HOSTNAME === 'localhost') {
  console.log('Running in development mode'); 
}

export const FRONTEND_ORIGIN = HOSTNAME === 'localhost' ? 'http://localhost:3000' : `https://${HOSTNAME}`;
export const BACKEND_ORIGIN = HOSTNAME === 'localhost' ? 'http://localhost:5000' : `https://${HOSTNAME}`;
export const ADD_CORS = process.env.ADD_CORS || HOSTNAME === 'localhost';