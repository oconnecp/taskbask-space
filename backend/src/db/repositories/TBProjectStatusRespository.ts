import { AppDataSource } from "../data-source";
import { TBProjectStatus } from "../entities/TBProjectStatus";

const projectStatusRepository = AppDataSource.getRepository(TBProjectStatus);

export const insertProjectStatuses = async (projectId: string, statuses: string[]): Promise<TBProjectStatus[] | null> => {
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
        order: { order: "ASC" }
    });
};

export const deleteProjectStatuses = async (projectId: string, statusId:string): Promise<void> => {
    await projectStatusRepository.delete({ projectId, id: statusId });
}