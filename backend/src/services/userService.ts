import { TBUser } from "../db/entities/tbUser";

import { UserDTO } from "../../shared/types/sharedTypes";
import { getAllUsers as fetchAllUsers } from "../db/repositories/tbUserRepository";

export const getAllUsers = async (): Promise<UserDTO[]> => {
    const users = await fetchAllUsers();
    return users.map(convertUserToDTO);
};

export const convertUserToDTO = (user: TBUser): UserDTO => {
    return {
        id: user.id,
        name: user.name || 'Unnamed User',
        email: user.email || 'No Email',
        profilePictureUrl: user.profilePictureUrl || '',
    };
};