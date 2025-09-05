import { AppDataSource } from "../data-source";
import { TBUser } from "../entities/TBUser";

import { DB_ENCRYPTION_KEY } from "../../tools/Constants";
import { encrypt, decrypt } from "../../services/EncryptionService"

const userRepository = AppDataSource.getRepository(TBUser);

export const getUserByAuthZeroId = async (authZeroId: string): Promise<TBUser | null> => {
    const user = await userRepository.findOneBy({ authZeroId });
    if (!user) {
        return null;
    }

    user.accessToken = decrypt(user.accessToken, DB_ENCRYPTION_KEY);

    return user;
};

export const getUserById = async (id: string): Promise<TBUser | null> => {
    const user = await userRepository.findOneBy({ id });
    if (!user) {
        return null;
    }

    user.accessToken = decrypt(user.accessToken, DB_ENCRYPTION_KEY);
    return user;
};


export const upsertUser = async (user: TBUser | Required<Omit<TBUser, 'id' | 'createdAt' | 'updatedAt'>>): Promise<TBUser> => {
    const existingUser = await getUserByAuthZeroId(user.authZeroId);

    if (existingUser) {
        existingUser.name = user.name || existingUser.name;
        existingUser.accessToken = encrypt(user.accessToken || existingUser.accessToken || '', DB_ENCRYPTION_KEY);
        existingUser.profilePictureUrl = user.profilePictureUrl || existingUser.profilePictureUrl;
        existingUser.email = user.email || existingUser.email;
        existingUser.accessToken = user.accessToken || existingUser.accessToken;
        existingUser.profileJson = user.profileJson || existingUser.profileJson;
        existingUser.authProvider = user.authProvider || existingUser.authProvider;
        
        return await userRepository.save(existingUser);
    } else {

        user.accessToken = encrypt(user.accessToken || '', DB_ENCRYPTION_KEY);
        return await userRepository.save(user);
    }
}

