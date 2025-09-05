## This is the project for TaskBask.space

This was created as a profile specifically at the request of CommunityShare.org

Instructions for use:
Create an application inside Auth0

# To Deploy to localhost for testing:
Set the Allowed Callback URL inside Auth0 to http://localhost:5000/api/auth/authzero/callback
Set the Allowed Web Origins to http://localhost:3000

Pull down the project via github
Add your secrets by adding a .env file to the backend folder, adding them to the environment, or adding them as docker compose secrets.  You will need the following variables
AUTH_ZERO_DOMAIN
AUTH_ZERO_CLIENT_ID
AUTH_ZERO_CLIENT_SECRET
SESSION_SECRET

the SESSION_SECRET will need to be 64 characters long.  if no session secret is provided, one will be generated but all sessions will be invalid upon backend server restart

in the base directory you can run:
docker compose build
docker compose up -d
docker compose logs -f

please note, you can also run backend or frontend separately.  if you run docker compose down [frontend | backend], that server will go down and you can go run it individually inside the project
both frontend and backend projects support `npm run build && npm run start`
for frontend development running `npm run dev` will run vite in dev mode for hot reloading.  running `npm run start` will start it in production mode running the express server instead


# To Deploy to a server:
Right now the only way I have tested deployment to a server running ssl has been running a docker compose natively however any docker compose compatible container should be able to run things

Copy the production folder to the server
Run Node initialize secrets to make secrets easier or write your secrets directly into the docker compose yaml
You will need to change your ssl hostname to your own domain

todo: ssl setup.  setting up certbot usually requires a specific command to get it working but i haven't set it up yet.  i will update with instructions as i run them

Run docker compose up -d

Anytime a new image is deployed, watchtower should redeploy the latest version for you automatically.  you can control this by forking the project and creating your own images
