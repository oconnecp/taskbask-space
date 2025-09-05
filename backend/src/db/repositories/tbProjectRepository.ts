import { ProjectDTO } from "../../../shared/types/sharedTypes";
import { appDataSource } from "../data-source";
import { TBProject } from "../entities/tbProject";

const projectStatusRepository = appDataSource.getRepository(TBProject);

export const getProjectById = async (id: string): Promise<TBProject | null> => {
    const project = await projectStatusRepository.findOneBy({ id });
    if (!project) {
        return null;
    }
    return project;
};

export const upsertProject = async (project: ProjectDTO): Promise<TBProject> => {
    const existingProject = await getProjectById(project.id);

    if (!existingProject) {
        const projectEntity = projectStatusRepository.create({
            name: project.name,
            description: project.description || null,
        });
        return await projectStatusRepository.save(projectEntity);
    }

    existingProject.name = project.name || existingProject.name;
    existingProject.description = project.description || existingProject.description;

    return await projectStatusRepository.save(existingProject);
}

export const deleteProject = async (id: string): Promise<void> => {
    await projectStatusRepository.delete({ id });
}