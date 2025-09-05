import { appDataSource } from "../1data-source";
import { ProjectRole, TBProjectMembership } from "../entities/1tbProjectMembership";
import { In } from "typeorm";

const projectMembershiptRepository = appDataSource.getRepository(TBProjectMembership);

export const insertProjectMemberships = async (projectId: string, role: ProjectRole, userIds: string[]): Promise<TBProjectMembership[]> => {
    const projectMembershipEntities = userIds.map((userId) =>
        projectMembershiptRepository.create({
            projectId,
            role,
            userId,
        })
    );
    return await projectMembershiptRepository.save(projectMembershipEntities);
};

export const upsertProjectMembership = async (thisUserId: string, projectId: string, role: ProjectRole, userId: string): Promise<TBProjectMembership> => {
    //check if this user is allowed to do this
    const thisUserMembership = await projectMembershiptRepository.findOneBy({ projectId, userId: thisUserId });
    if (!thisUserMembership || (thisUserMembership.role !== ProjectRole.OWNER)) {
        throw new Error("Not authorized to add members to this project");
    }

    const existingMembership = await projectMembershiptRepository.findOneBy({ projectId, userId });
    if (existingMembership) {
        existingMembership.role = role;
        return await projectMembershiptRepository.save(existingMembership);
    } else {
        const newMembership = projectMembershiptRepository.create({
            projectId,
            role,
            userId,
        });
        return await projectMembershiptRepository.save(newMembership);
    }
};

export const getProjectMembershipsByUserId = async (userId: string): Promise<TBProjectMembership[]> => {
    return await projectMembershiptRepository.find({
        where: { userId },
        order: { userId: "ASC" },
    });
};

export const getProjectMembershipsByProjectId = async (projectId: string): Promise<TBProjectMembership[]> => {
    return await projectMembershiptRepository.find({
        where: { projectId },
        order: { userId: "ASC" },
    });
};

export const getAllProjectMembershipsByProjectIds = async (projectIds: string[]): Promise<TBProjectMembership[]> => {
    return await projectMembershiptRepository.find({
        where: { projectId: In(projectIds) },
        order: { userId: "ASC" },
    });
};