import { AppDataSource } from "../data-source";
import { ProjectRole, TBProjectMembership } from "../entities/TBProjectMembership";

const projectMembershiptRepository = AppDataSource.getRepository(TBProjectMembership);

export const insertProjectMemberships = async (projectId: string, role: ProjectRole, userIds: string[]): Promise<TBProjectMembership[] | null> => {
    const projectMembershipEntities = userIds.map((userId) =>
        projectMembershiptRepository.create({
            projectId,
            role,
            userId,
        })
    );
    return await projectMembershiptRepository.save(projectMembershipEntities);
};

export const getProjectMemberships = async (userId: string): Promise<TBProjectMembership[]> => {
    return await projectMembershiptRepository.find({
        where: { userId },
        order: { userId: "ASC" }
    });
}

