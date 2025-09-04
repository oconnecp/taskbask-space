#!/bin/sh

if [ "$MODE" = "production" ]; then
  echo "Starting the server in production mode..."
  npm run start
else
  echo "Starting the server in development mode..."
  npm run dev
fi