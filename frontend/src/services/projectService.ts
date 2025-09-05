import { apiGet, apiPost } from './apiClientService';
import { ProjectPayloadDTO, ProjectDTO } from '../../shared/types/sharedTypes';

const PROJECT_API_BASE = '/project';
export const getAllProjectsForUser = async (): Promise<ProjectPayloadDTO[] | null> => {
    try {
        // Call the backend API to get user info and cache it
        const response = await apiGet<ProjectPayloadDTO[]>(PROJECT_API_BASE, false);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching User: ", error);
        return null;
    }
}

export const postNewProject = async (newProject: ProjectDTO): Promise<ProjectPayloadDTO | null> => {
    try {
        const response = await apiPost<ProjectPayloadDTO>(PROJECT_API_BASE, newProject);
        return response.data;
    } catch (error: any) {
        console.error("Error creating new project: ", error);
        return null;
    }
}

export const upsertMembershiptoProject = async (projectId: string, role: string, userId: string): Promise<any[] | null> => {
    const upsertMembershiptoProjectUrl = `${PROJECT_API_BASE}/${projectId}/membership/${role}/${userId}`;
    try {
        const response = await apiPost<any[]>(upsertMembershiptoProjectUrl, {});
        return response.data;
    }
    catch (error: any) {
        console.error("Error adding membership to project: ", error);
        return null;
    }

}
