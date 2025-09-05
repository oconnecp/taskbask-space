import { apiGet, apiPost } from './apiClientService';
import { NewTaskDTO, TaskDTO } from '../../shared/types/sharedTypes';

const TASK_API_BASE = 'task';
export const postNewTask = async (newTask: NewTaskDTO): Promise<TaskDTO | null> => {
    try {
        // Call the backend API to get user info and cache it
        const response = await apiPost<TaskDTO>(TASK_API_BASE, newTask);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching User: ", error);
        return null;
    }
}
