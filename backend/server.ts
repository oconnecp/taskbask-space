import express, { Request, Response } from 'express';
import cors from 'cors';
import session from 'express-session';
import connectPGSimple from 'connect-pg-simple';

// Environment variables
import {
  ADD_CORS, PORT, FRONTEND_ORIGIN, SESSION_SECRET, MODE,
  DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME
} from './src/tools/constants';
//Services
import { initializeAuthService } from './src/services/authService';
import { appDataSource } from "./src/db/data-source";

//Routers
import {baseAuthUrl, authRouter} from './src/routes/authRouter';
import { baseImageProxyUrl, imageProxyRouter } from './src/routes/imageProxyRouter';
import { baseProjectUrl, projectRouter } from './src/routes/projectRoutes';
import { baseTaskUrl, taskRouter } from './src/routes/taskRoutes';
import { baseUserUrl, userRouter } from './src/routes/userRouter';


const app = express();
const baseUrl = '/api';

app.set('trust proxy', true); // Trust first proxy for secure cookies if behind a reverse proxy

// Configure CORS to allow requests from the frontend
// If we are in production with our current setup, we won't need to use CORS
// because the frontend and backend will be served from the same domain.
if (ADD_CORS) {
  console.log(`Adding CORS for ${FRONTEND_ORIGIN}`);
  app.use(cors({
    origin: FRONTEND_ORIGIN,
    credentials: true
  }));
}

// logger middleware
app.use((req: Request, res: Response, next) => {
  const time = new Date(Date.now()).toString();
  console.log(req.method, req.hostname, req.path, time);
  next();
});

app.use(express.json());
// app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: true }));

const PgStore = connectPGSimple(session);


const pgConnectionString = process.env.DATABASE_URL ||
  `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

app.use(
  session({
    store: new PgStore({
      conString: pgConnectionString,
      tableName: "session",
      createTableIfMissing: true,

    }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: MODE === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 8, // 8 hours
    },
  })
);

initializeAuthService(app);



app.use(`${baseUrl}${baseAuthUrl}`, authRouter);
app.use(`${baseUrl}${baseImageProxyUrl}`, imageProxyRouter);
app.use(`${baseUrl}${baseProjectUrl}`, projectRouter);
app.use(`${baseUrl}${baseTaskUrl}`, taskRouter);
app.use(`${baseUrl}${baseUserUrl}`, userRouter);

app.get(`${baseUrl}/healthcheck`, async (req: Request, res: Response) => {
  console.log('Health check endpoint hit');
  // Check the TypeORM connection
  try {
    await appDataSource.query('SELECT 1');
    console.log('Database connection is healthy');
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ error: 'Database connection error' });
  }

  res.send('All good!');
});

appDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
