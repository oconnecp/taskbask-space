import express from 'express';

import { ensureAuthenticated } from "../tools/ensureAuthenticatedMiddleware";

import { TBUser } from '../db/entities/tbUser';
import { ProjectDTO, ProjectPayloadDTO, TaskDTO , NewTaskDTO} from '../../shared/types/sharedTypes';

import { getTasksForProject } from '../services/taskService';
import { createNewProject, getAllProjectPayloadsByUserId, upsertMembershiptoProject } from '../services/projectService';
import { ProjectRole } from '../db/entities/tbProjectMembership';

export const baseProjectUrl = '/project';
export const projectRouter = express.Router()

//get all projects for the logged in user
projectRouter.get('/', ensureAuthenticated, async (req: express.Request, res: express.Response) => {
    const thisUser = req.user as TBUser;

    try {
        const allProjectsFromThisUser: ProjectPayloadDTO[] = await getAllProjectPayloadsByUserId(thisUser.id);
        return res.status(200).json(allProjectsFromThisUser);
    } catch (error) {
        console.error("Error fetching projects for user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

projectRouter.post('/', ensureAuthenticated, async (req: express.Request, res: express.Response) => {
    const thisUser = req.user as TBUser;
    const newProject = req.body as ProjectDTO;

    console.log("woop woop", newProject);
    try {
        const projectPayload: ProjectPayloadDTO = await createNewProject(thisUser.id, newProject);

        return res.status(200).json(projectPayload);
    } catch (error) {
        console.error("Error creating project:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


projectRouter.get('/:projectId/tasks', ensureAuthenticated, async (req: express.Request, res: express.Response) => {
    try{
        const { projectId } = req.params;
        const tasksForThisProject: TaskDTO[] = await getTasksForProject(projectId);
        return res.status(200).json(tasksForThisProject);
    }catch(error){
        console.error("Error fetching tasks for project:", error);
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