# This is the project for [TaskBask.space](https://taskbask.space/)
This was created as a profile specifically at the request of [CommunityShare.org](https://www.communityshare.org/)

If you can't absolutely BASK in your TASKS, then what are you really doing with your space?
[Video Walkthrough](https://drive.google.com/file/d/1qDZhJ6RRUQ_bpxKkQl-hPqi_Z9AKk7i3/view?usp=drive_link)

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

## Technology choices and rationale

### Backend
I decided to use Node.js with Typscript for the backend along with TypeORM and Express.js.  I am quite familiar with this stack as my other project that I wrote this year is using it.  It's one of my strongest skills that is an industry standard.  I knew that I could pull some tools over easily like some of my Authorization code that uses Passport.  Passport uses Oauth2 standards to easily implement authentication.  I already had the code for Google and Github but decded to try out Auth0 to work with the CommunityShare.org standard.  TypeORM made it easy to map SQL queries to Typescript Classes.  I was able to make the relationships required for the project here.  It supports migration scripts and more for easy production management.

Security is important so having something like OAuth for Auth0 was a great choice.  We are encrypting any keys at rest to ensure that someone gaining access to our database wouldn't have anything of use.  We are using industry sessions that should keep our users safe.

We created database objects and also data transfer objects and only send DTOs back to the user to ensure that no data that they can't see anything they aren't supposed to.  Each endpoint is protected by authorization.

The database was implemented with PostgreSQL.  Really anything would work with a project like this in it's infancy but we are ready to scale the application as user base grows.  I created optimized relationships that should allow for quick retreival of data.  While there are definitely some improvements that can be made as far as effeciency, for now things should load very quickly.

### Frontend
The frontend has also borrowed from a project of mine.  I figured with such a short amount of time to get a project up and running, we should borrow from what works.  I had a hamburger menu that I already wrote myself and a folder structure that works.  Compiling the typescript is being handled by Vite.  Production is build and optimized and can be deployed via either vite production or via expressjs.  It allows us to either move to a unified project or to deploy containers separately so that we can scale in the future. 

React is my favorite front end framework and we were able to share types between the frontend and the backend.  In the future I would like to build our shared library instead of copying the code into the 2 projects.

We haven't yet made it to accessibility but we are using semantic html whenever possible and that is the first step to making it accessible.  We haven't coded ourselves into a corner the way some projects can and accessiblilty should be fairly easy to get working.

The toasts for errors haven't been implemented yet but the toast system has been put in.  4 lines of code should unify our error messages.

### Deployment
Right now we have github actions handling the image building.  We deploy our images to docker hub and they are pulled down in production via Watchtower.  Watchtower will check every 5 minutes for new images but we also have a webhook set up in github actions that will deploy immediately.  This should keep us safe from a lot of securtiy threats.  We should implemnt monitoring though incase there is a problem we can get to it before users have a problem.

## Architecture
As of now we have a standard docker compose stack to deploy our project.  This is a great way to start any small project but in the future we would probably want to deploy via kubernetes for autoscaling of resources.  When you have a quick project, just getting anything working in some sort of container can be a challenge and this is a great starting point.

## Assumptions made
We started with a dashboard to fit the minimum MVP but we have built a platform that can create so many visuals.  For now we have given the bare minimum, where users can create a project, and add tasks.  The tasks are being displayed in a list for everyone to see.  It would really be nice to get multiple views like swimlanes based on priority, assignee, or status.  That way they can be the source of truth in different meetings and discussions.  I assumed that users would need to have easy support for both desktop and mobile because tasks are done everywhere and having a mobile first model was important.

## Future improvements
I really wish I had more time to make this project look good.  We are missing some features and I think it could look really fun.  I do love dark themes and minimal design but having some color would do well for us.  I wanted to build a status indicator into the system but only got the similar priority indicator working so far.

We do support custom statuses for each project in the database, but haven't implemented them yet as it was a lot of scope creep.  The database is ready to create large workflow projects, we just need to implement it in the frontend.

Storybook is a must moving forward.  Now that we have the base of our project we will need to create a lot of complicated views and storybook will improve our development speed.

I wrote a very quick modal component for this project but using a modal system out of the box should make our code more readable.  Right now the Task creation code needs to be broken out to it's own file but that would be difficult with how basic our modal is.

We need some more linting rules to help with development.  Enforcing semicolons and types would be a good start.  There is some enforment but not as strict as it should be.

Versioning is always great.  Having versions update with git commits is a wonderful system that I love.

The user selector has some tech debt as far as efficiency and caching.  It definitely needs some work before we can scale in production

I would probably change my deployment to kubernets under AWS or something industry standard.  Right now we are going for cheap and self deployed but we can save some headaches by going with an inustry standard going forward.

## ER Diagram
[ER Diagram](./documentation/mermaid-diagram.png)

[Live Mermaid Editor for ER Diagram](https://mermaid.live/edit#pako:eNqtVm1P4kAQ_iubTUwkqYb3Qr8Z6Ck5RQ_hvFxImqUdYZV2e9tdo1L_-223tFQoSu5M4MPsPPPsPDPTaVfYZR5gCwPvUzLnxJ8GCImZIyPgEYrjkxO2SmxBoscIWWiKSRTReQDgUA8d39pjNJxcXlam-NNAlwMR4Dmzlz2hIWcP4Iry6LVTh_bObntnffvDyAwfCSJUToeTbCLK0kidmmBk345Hg974oDR88GeqMAsaHpDJdg33kSS4HYZ3HKvEQkhKhVK_m--p_US4uyAcESkWzitwlrBM8WQ4-DGxDbSEANVbrTSfDTogPihU4q3Vq4bu3jYGfEKXa5CiSEEGGgz79q8MK-BZIKXpni7BCakrJAdH8iSsSPkQsWCW4xJrC5CrcF2IojF7hGBX3g1nT9QDvr6a-qBa6IfiFWXzSMSuT4ZewfeWVzXv8CeFLZaqUy3T70HkchoKuiPri3LczPGeXLVdmMNv-zV0qllyNBCI8byeR0doEtA_EiIrPzjecBqapILSwUJPlCC5lZ-TIMpj9T0fB-epbOSnz-rBmpXCd83RiOKO05CSKdbAzTrYZcrqKKhYFobhH6bAk-AkvS5PBALpK02UcSpeFOTy-i6-svuDyVV8MTi_iCejc3s4Rsce3BO5FCj1VcrkvF_R-5R_1YAW19n_9StbhLtuXRzOdAOu74b2KFbqx9ej-OfAvrNHm6qkx5UsLh_sPXO9vnFrOlNFTpj8U7BWjg0859TDluASDOwDV1tSmVirnmKxAPUM4GSle4Q_JjkkMSEJfjPmZ2GcyfkCW_dkGSkrLe76pZ2fcgjUA9FjMhDYqjXbTc2CrRV-xlbTPDXNdrteN816vdbuGPgFWycKdWo2u41Wt9aodlrdRufNwK_63tpptauAjUa1YbZrrW7LwOBRwfhV-tGgvx3e_gK4hLQc)

## API Documentation

[![Raw OpenAPI documentation](https://img.shields.io/badge/OpenAPI-Spec-blue)](./docs/openapi.yaml)

[Open in a Swagger Editor](https://editor.swagger.io/?url=https://raw.githubusercontent.com/oconnecp/taskbask-space/blob/main/documentation/openapi.yaml)
