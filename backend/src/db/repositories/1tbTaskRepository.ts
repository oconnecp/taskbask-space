import { TaskDTO } from "../../../shared/types/sharedTypes";
import { appDataSource } from "../1data-source";
import { TaskPriority, TBTask } from "../entities/1tbTask";

const taskrepository = appDataSource.getRepository(TBTask);

export const insertTasks = async (taskDTOs: TaskDTO[]): Promise<TBTask[] | null> => {
    const tasks = taskDTOs.map(dto => {
        return taskrepository.create({
            ...dto,
            priority: dto.priority as TaskPriority || "MEDIUM",
        });
    });

    return await taskrepository.save(tasks);
};

export const getTasksByProjectId = async (projectId: string): Promise<TBTask[]> => {
    return await taskrepository.find({
        where: { projectId },
    });
}

export const getTaskById = async (taskId: string): Promise<TBTask | null> => {
    return await taskrepository.findOne({
        where: { id: taskId },
    });
};

export const upsertTask = async (taskDTO: TaskDTO): Promise<TBTask | null> => {
    const existingTask = await getTaskById(taskDTO.id!);
    
    if(!existingTask) {
        const newTask = taskrepository.create({
            ...taskDTO,
            priority: taskDTO.priority as TaskPriority || "MEDIUM",
        });
        return await taskrepository.save(newTask);
    }

    existingTask.title = taskDTO.title || existingTask.title;
    existingTask.description = taskDTO.description || existingTask.description;
    existingTask.dueDate = taskDTO.dueDate || existingTask.dueDate;
    existingTask.priority = taskDTO.priority as TaskPriority || existingTask.priority;
    existingTask.statusId = taskDTO.statusId || existingTask.statusId;
    existingTask.assigneeId = taskDTO.assigneeId || existingTask.assigneeId;
    existingTask.projectId = taskDTO.projectId || existingTask.projectId;

    return taskrepository.save(existingTask);
};