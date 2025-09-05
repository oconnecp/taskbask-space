import express from 'express';

import { getProjectMemberships } from '../db/repositories/TBProjectMembershipRepository';

import { TBUser } from '../db/entities/TBUser';
import { TBProject } from '../db/entities/TBProject';


const ProjectRoutes = express.Router()

// base url /project from the server.ts file

//get all projects for the logged in user
ProjectRoutes.get('/', (req: express.Request, res: express.Response) => {
    if (!req.isAuthenticated && !req.isAuthenticated()) {
        return res.status(401).json({ user: null });
    }

    const thisUser = req.user as TBUser;
    const projectMemberships = getProjectMemberships(thisUser.id);
    console.log(projectMemberships);
});

ProjectRoutes.post('/', (req: express.Request, res: express.Response) => {
    if (!req.isAuthenticated && !req.isAuthenticated()) {
        return res.status(401).json({ user: null });
    }
    const thisUser = req.user as TBUser;
    const newProject = req.body as TBProject;

export default ProjectRoutes;