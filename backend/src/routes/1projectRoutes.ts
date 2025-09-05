import express from 'express';

import { ensureAuthenticated } from "../tools/1ensureAuthenticatedMiddleware";

import { TBUser } from '../db/entities/1tbUser';
import { ProjectDTO, ProjectPayloadDTO } from '../../shared/types/sharedTypes';

import { createNewProject, getAllProjectPayloadsByUserId, upsertMembershiptoProject } from '../services/1projectService';
import { ProjectRole } from '../db/entities/1tbProjectMembership';

export const baseProjectUrl = '/project';
export const projectRouter = express.Router()

//get all projects for the logged in user
projectRouter.get('/', ensureAuthenticated, async (req: express.Request, res: express.Response) => {
    const thisUser = req.user as TBUser;

    try {
        const allProjecctsFromThisUser: ProjectPayloadDTO[] = await getAllProjectPayloadsByUserId(thisUser.id);
        return res.status(200).json(allProjecctsFromThisUser);
    } catch (error) {
        console.error("Error fetching projects for user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

projectRouter.post('/', ensureAuthenticated, async (req: express.Request, res: express.Response) => {
    const thisUser = req.user as TBUser;
    const newProject = req.body as ProjectDTO;

    try {
        const projectPayload: ProjectPayloadDTO = await createNewProject(thisUser.id, newProject);

        return res.status(200).json(projectPayload);
    } catch (error) {
        console.error("Error creating project:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

projectRouter.post('/:projectId/membership/:role/:userId', ensureAuthenticated, async (req: express.Request, res: express.Response) => {
    const thisUser = req.user as TBUser;
    const { projectId, role, userId } = req.params;

    try{
        const allMembershipsForThisProject = await upsertMembershiptoProject(thisUser.id, projectId, role as ProjectRole, userId);
        return res.status(201).json(allMembershipsForThisProject);
    }catch(error){
        console.error("Error adding membership to project:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});