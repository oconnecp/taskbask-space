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

//this is not ideal.  we should build this into a dropdown, cache on the backend as well
export const getAllUsers = async (): Promise<UserDTO[] | null> => {
  try {
    // Call the backend API to get user info and cache it
    const response = await apiGet<UserDTO[]>(`user/all`, true);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching all Users: ", error);
    return null;
  }
}