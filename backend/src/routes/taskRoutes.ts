import express from 'express';
import { ensureAuthenticated } from "../tools/ensureAuthenticatedMiddleware";

import { createTask, updateTask } from '../services/taskService';
import { TBUser } from '../db/entities/tbUser';
import { NewTaskDTO, TaskDTO, } from '../../shared/types/sharedTypes';


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

taskRouter.put('/:taskId', ensureAuthenticated, async (req: express.Request, res: express.Response) => {
    const thisUser = req.user as TBUser;
    const { taskId } = req.params;
    try {
        const taskUpdates = req.body as TaskDTO;
        if (taskId !== taskUpdates.id) {
            return res.status(400).json({ error: "Task ID in URL does not match Task ID in body" });
        }
        console.log("Received task update request:", taskUpdates);
        const updatedTask = await updateTask(thisUser.id, taskUpdates);
        if (!updatedTask) {
            console.log("Task not found or not authorized:", taskId);
            return res.status(404).json({ error: "Task not found or not authorized" });
        }
        return res.status(200).json(updatedTask);
    } catch (error) {
        console.error("Error updating task:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});