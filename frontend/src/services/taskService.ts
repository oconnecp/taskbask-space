import { apiPut, apiPost } from './apiClientService';
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

export const updateTask = async (task: TaskDTO): Promise<TaskDTO | null> => {
    if (!task.id) {
        console.error("Task ID is required for update");
        return null;
    }
    try {
        // Call the backend API to get user info and cache it
        const response = await apiPut<TaskDTO>(`${TASK_API_BASE}/${task.id}`, task);
        return response.data;
    } catch (error: any) {
        console.error("Error updating Task: ", error);
        return null;
    }
}
