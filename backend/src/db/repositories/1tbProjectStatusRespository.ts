import { In } from "typeorm";
import { appDataSource } from "../1data-source";
import { TBProjectStatus } from "../entities/1tbProjectStatus";

const projectStatusRepository = appDataSource.getRepository(TBProjectStatus);

export const insertProjectStatuses = async (projectId: string, statuses: string[]): Promise<TBProjectStatus[]> => {
    const statusEntities = statuses.map((name, idx) =>
        projectStatusRepository.create({
            projectId, 
            name,
            order: idx,
        })
    );
    return await projectStatusRepository.save(statusEntities);
};

export const getProjectStatuses = async (projectId: string): Promise<TBProjectStatus[]> => {
    return await projectStatusRepository.find({
        where: { projectId },
        order: { order: "ASC" },
    });
};

export const getProjectStatusesWithProjectHydration = async (projectIds: string[]): Promise<TBProjectStatus[]> => {
    return await projectStatusRepository.find({
        where: { 
            projectId: In(projectIds)
         },
        order: { order: "ASC" },
        relations: ["project"],
    });
};

export const deleteProjectStatuses = async (projectId: string, statusId:string): Promise<void> => {
    await projectStatusRepository.delete({ projectId, id: statusId });
}