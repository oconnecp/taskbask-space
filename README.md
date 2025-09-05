# This is the project for [TaskBask.space](https://taskbask.space/)
This was created as a profile specifically at the request of [CommunityShare.org](https://www.communityshare.org/)

If you can't absolutely BASK in your TASKS, then what are you really doing with your space?

## Instructions for use:
Create an application inside Auth0

### To Deploy to localhost for testing:
Set the Allowed Callback URL inside Auth0 to http://localhost:5000/api/auth/authzero/callback
Set the Allowed Web Origins to http://localhost:3000

Pull down the project via github
Add your secrets by adding a .env file to the backend folder, adding them to the environment, or adding them as docker compose secrets.  You will need the following variables:
- AUTH_ZERO_DOMAIN
- AUTH_ZERO_CLIENT_ID
- AUTH_ZERO_CLIENT_SECRET
- SESSION_SECRET

the SESSION_SECRET will need to be 64 characters long.  if no session secret is provided, one will be generated but all sessions will be invalid upon backend server restart

in the base directory you can run:
docker compose build
docker compose up -d
docker compose logs -f

please note, you can also run backend or frontend separately.  if you run docker compose down [frontend | backend], that server will go down and you can go run it individually inside the project
both frontend and backend projects support `npm run build && npm run start`
for frontend development running `npm run dev` will run vite in dev mode for hot reloading.  running `npm run start` will start it in production mode running the express server instead


### To Deploy to a server:
Right now the only way I have tested deployment to a server running ssl has been running a docker compose natively however any docker compose compatible container should be able to run things
in this case allowed Callback Url should https://taskbask.space/api/auth/authzero/callback
and the allowed web origin should be https://taskbask.space

Copy the production folder to the server
Run Node initialize secrets to make secrets easier or write your secrets directly into the docker compose yaml
You will need to change your ssl hostname to your own domain

#### SSL setup
- After you have copied the production folder, make a backup of nginx\conf\app.conf to app.conf.bak
- delete everything below the first server.  this will allow nginx to boot up for the first time
- run `docker compose up nginx certbot -d` (from inside the production folder)
- then run `docker compose run --rm   --entrypoint ""   certbot certbot certonly   --webroot -w /var/www/certbot   -d yourdomain.com  --email youremail@yourprovider.com --agree-tos --no-eff-email`
- this will have everything initialized for you and you can delete your edited app.conf and restore from backup
- you probably want to run `docker compose down`


Run `docker compose up -d`

Anytime a new image is deployed, watchtower should redeploy the latest version for you automatically.  you can control this by forking the project and creating your own images


## What I would do differently with more time
I definitely would spend time with some input validation.  Inputs on my routes are not well validated and are relying on the frontend sending the right information.  It will throw and handle errors where it needs to but I could make it more eligant.

I originally had the idea of having custom statuses for each project but had to cut that due to scope creep.  It's definitely nice to have so that a project can be more customizeable.

I would definitely implement storybook to help prototype my project.  I was missing it on this go around

I would implement Styled to better create cleaner components with readable styling.  The styling is not industry standard but I was pressed for time.

I would create a more robust modal system or find one I liked off the shelf

we desperately need more linting rules

we should implement versioning

clean up the user selector tech debt

i'd probably change my deployment to kubernetes.  this is great for a small project and getting off the ground but we should let a real service handle ssl certs and container management for us