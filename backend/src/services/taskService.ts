import { TBTask } from "../db/entities/tbTask";
import { NewTaskDTO, TaskDTO } from "../../shared/types/sharedTypes";

import { getTasksByProjectId, insertTasks, upsertTask } from "../db/repositories/tbTaskRepository"

export const getTasksForProject = async (projectId: string): Promise<TaskDTO[]> => {
    const tasks = await getTasksByProjectId(projectId);
    return convertTasksToDTO(tasks);
}

export const createTask = async (createdById:string, newTaskDTO: NewTaskDTO): Promise<TaskDTO> => {
    const newTasks = await insertTasks(createdById, [newTaskDTO]);
    const taskDTOs =  convertTasksToDTO(newTasks);
    return taskDTOs[0];
};

export const updateTask = async (userId: string, taskDTO: TaskDTO): Promise<TaskDTO | null> => {
    //in the future we will check permissions here
    console.log('Updating task:', taskDTO);
    // In a real application, you would check if the user has permission to update the task
    const updatedTask = await upsertTask(taskDTO, userId);
    console.log('Updated task:', updatedTask);
    return convertTasksToDTO([updatedTask])[0];

}

export const convertTasksToDTO = (tasks: TBTask[]): TaskDTO[] => {
    const taskDTOs: TaskDTO[] =  tasks.map(task => ({
        id: task.id,
        projectId: task.projectId,
        assigneeId: task.assigneeId,
        statusId: task.statusId,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        createdById: task.createdById,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
    }));

    return taskDTOs;
}