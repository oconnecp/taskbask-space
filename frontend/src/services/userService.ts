import { apiGet } from './apiClientService';
import { UserDTO } from '../../shared/types/sharedTypes';

export const getUser = async (): Promise<UserDTO | null> => {
  try {
    // Call the backend API to get user info and cache it
    const response = await apiGet<UserDTO>(`auth/user`, true);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching User: ", error);
    return null;
  }
}