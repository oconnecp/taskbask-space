import express from 'express';
import { ensureAuthenticated } from "../tools/ensureAuthenticatedMiddleware";

import { createTask } from '../services/taskService';
import { TBUser } from '../db/entities/tbUser';
import { NewTaskDTO, } from '../../shared/types/sharedTypes';


export const baseTaskUrl = '/task';
export const taskRouter = express.Router()

taskRouter.post('/', ensureAuthenticated, async (req: express.Request, res: express.Response) => {
    const thisUser = req.user as TBUser;
    try {
        const newTask = req.body as NewTaskDTO;
        const createdTask = await createTask(thisUser.id, newTask);
        return res.status(201).json(createdTask);
    } catch (error) {
        console.error("Error creating task for project:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});