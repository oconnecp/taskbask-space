import { ProjectDTO } from "../../../shared/types/sharedTypes";
import { appDataSource } from "../data-source";
import { TBProject } from "../entities/tbProject";

const projectRepository = appDataSource.getRepository(TBProject);

export const getProjectById = async (id: string): Promise<TBProject | null> => {
    if (!id) {
        return null;
    }
    const project = await projectRepository.findOneBy({ id });
    if (!project) {
        return null;
    }
    return project;
};

export const upsertProject = async (project: ProjectDTO): Promise<TBProject> => {
    const existingProject = await getProjectById(project.id);

    if (!existingProject) {
        const projectEntity = projectRepository.create({
            name: project.name,
            description: project.description || null,
        });
        return await projectRepository.save(projectEntity);
    }

    existingProject.name = project.name || existingProject.name;
    existingProject.description = project.description || existingProject.description;

    return await projectRepository.save(existingProject);
}

export const deleteProject = async (id: string): Promise<void> => {
    await projectRepository.delete({ id });
}