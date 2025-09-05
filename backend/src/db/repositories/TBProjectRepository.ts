import { AppDataSource } from "../data-source";
import { TBProject } from "../entities/TBProject";

const projectStatusRepository = AppDataSource.getRepository(TBProject);

export const getProjectById = async (id: string): Promise<TBProject | null> => {
    const project = await projectStatusRepository.findOneBy({ id });
    if (!project) {
        return null;
    }
    return project;
};

export const upsertProject = async (project: TBProject): Promise<TBProject> => {
    const existingProject = await getProjectById(project.id);

    if (!existingProject) {
        return await projectStatusRepository.save(project);
    }

    existingProject.name = project.name || existingProject.name;
    existingProject.description = project.description || existingProject.description;

    return await projectStatusRepository.save(existingProject);
}

export const deleteProject = async (id: string): Promise<void> => {
    await projectStatusRepository.delete({ id });
}