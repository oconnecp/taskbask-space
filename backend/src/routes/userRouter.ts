import express from 'express';

import { UserDTO } from '../../shared/types/sharedTypes';
import { getAllUsers} from '../services/userService';

import { ensureAuthenticated } from "../tools/ensureAuthenticatedMiddleware";

export const baseUserUrl = '/user';
export const userRouter = express.Router()

userRouter.get('/all', ensureAuthenticated, async (req: express.Request, res: express.Response) => {
    try{
        const allUsers: UserDTO[] = await getAllUsers();
        return res.status(200).json(allUsers);
    }catch(error){
        console.error("Error fetching users:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});