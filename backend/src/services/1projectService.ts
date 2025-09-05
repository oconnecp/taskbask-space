import { ProjectDTO, ProjectMembershipDTO, ProjectPayloadDTO, ProjectStatusDTO } from "../../shared/types/sharedTypes";

import { TBProject } from "../db/entities/1tbProject";
import { ProjectRole, TBProjectMembership } from "../db/entities/1tbProjectMembership";
import { TBProjectStatus } from "../db/entities/1tbProjectStatus";

import { upsertProject } from "../db/repositories/1tbProjectRepository";
import { insertProjectMemberships, upsertProjectMembership, getProjectMembershipsByUserId, getProjectMembershipsByProjectId, getAllProjectMembershipsByProjectIds } from "../db/repositories/1tbProjectMembershipRepository";
import { insertProjectStatuses, getProjectStatusesWithProjectHydration } from "../db/repositories/1tbProjectStatusRespository";

//create the project
export const createNewProject = async (userId: string, projectDTO: ProjectDTO): Promise<ProjectPayloadDTO> => {
    const project: TBProject = await upsertProject(projectDTO)
    // removing scope for now, we will add custom statuses later
    const statusInsertPromise = insertProjectStatuses(project.id, ["To Do", "In Progress", "Done"]);
    const membershipInsertPromise = insertProjectMemberships(project.id, ProjectRole.OWNER, [userId]);

    const [statuses, memberships] = await Promise.all([statusInsertPromise, membershipInsertPromise]);

    return convertToProjectPayloadDTO(project, memberships, statuses);
}

//This is going to be fairly expensive.  This will make the frontend simpler for now
// as we can just load all the data for the user's projects in one go
// If this becomes a performance issue we can optimize later
// at least for now we only loop once over each datapoint that we fetch from the DB
export const getAllProjectPayloadsByUserId = async (userId: string): Promise<ProjectPayloadDTO[]> => {
    // get all project memberships for the user
    // this function doesn't hydrate the project relation on purpose because we will need to fetch
    // the statuses and memberships for each project separately to populate all data
    const thisUserMembershipProjectIds: string[] = (await getProjectMembershipsByUserId(userId)).map(m => m.projectId);
    const allProjectStatusesWithProjectHydration: TBProjectStatus[] = await getProjectStatusesWithProjectHydration(thisUserMembershipProjectIds);
    const allProjectMemberships: TBProjectMembership[] = await getAllProjectMembershipsByProjectIds(thisUserMembershipProjectIds);

    // map of projectId to { project, statuses[] }
    const allProjectsAndStatusesMap: Record<string, { project: TBProject, statuses: TBProjectStatus[] }> = allProjectStatusesWithProjectHydration.reduce((acc, hydratedProjectStatus: TBProjectStatus) => {
        const projectId = hydratedProjectStatus.projectId;
        if (!acc[projectId]) {
            acc[projectId] = { project: hydratedProjectStatus.project, statuses: [hydratedProjectStatus] };
        } else {
            acc[projectId].statuses.push(hydratedProjectStatus);
        }
        return acc;
    }, {} as Record<string, { project: TBProject, statuses: TBProjectStatus[] }>);

    // map of projectId to memberships[]
    const allProjectPayloads: Record<string, TBProjectMembership[]> = allProjectMemberships.reduce((acc, membership: TBProjectMembership) => {
        const projectId = membership.projectId;
        if (!acc[projectId]) {
            acc[projectId] = [membership];
        } else {
            acc[projectId].push(membership);
        }
        return acc;
    }, {} as Record<string, TBProjectMembership[]>);

    // construct the final payloads
    const projectPayloads: ProjectPayloadDTO[] = thisUserMembershipProjectIds.map(projectId => {
        const projectAndStatuses = allProjectsAndStatusesMap[projectId];
        const memberships = allProjectPayloads[projectId];
        
        return convertToProjectPayloadDTO(projectAndStatuses.project, memberships, projectAndStatuses.statuses);
    });

    return projectPayloads;
};


export const upsertMembershiptoProject = async (thisUserId: string, projectId: string, role: ProjectRole, userId: string): Promise<ProjectMembershipDTO[]> => {
    upsertProjectMembership(thisUserId, projectId, role, userId);
    //after adding the new membership, return all memberships for this project
    const allMembershipsForThisProject = await getProjectMembershipsByProjectId(projectId);
    return convertToProjectMembershipDTOs(allMembershipsForThisProject);

};

export const convertToProjectDTO = (project: TBProject): ProjectDTO => {
    return {
        id: project.id,
        name: project.name,
        description: project.description,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
    };
}

export const convertToProjectMembershipDTOs = (projectMemberships: TBProjectMembership[]): ProjectMembershipDTO[] => {
    return projectMemberships.map(membership => ({
        id: membership.id,
        projectId: membership.projectId,
        userId: membership.userId,
        role: membership.role
    }));
}
export const convertToProjectStatusDTOs = (projectStatuses: TBProjectStatus[]): ProjectStatusDTO[] => {
    return projectStatuses.map(status => ({
        id: status.id,
        projectId: status.projectId,
        name: status.name,
        order: status.order
    }));
}

export const convertToProjectPayloadDTO = (project: TBProject, memberships: TBProjectMembership[], statuses: TBProjectStatus[]): ProjectPayloadDTO => {
    return {
        project: convertToProjectDTO(project),
        memberships: convertToProjectMembershipDTOs(memberships),
        statuses: convertToProjectStatusDTOs(statuses)
    };
}