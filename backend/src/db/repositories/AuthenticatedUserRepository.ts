import { AppDataSource } from "../data-source";
import { AuthenticatedUser } from "../entities/AuthenticatedUser";
import { DB_ENCRYPTION_KEY } from "../../tools/Constants";
import { encrypt, decrypt } from "../../services/EncryptionService"

const userRepository = AppDataSource.getRepository(AuthenticatedUser);

console.log('DB_ENCRYPTION_KEY:', DB_ENCRYPTION_KEY);
if (DB_ENCRYPTION_KEY.length !== 32) {
  throw new Error('ENCRYPTION_KEY must be 32 characters long for AES-256 encryption.');
} else {
  console.log('DB_ENCRYPTION_KEY is valid length:', DB_ENCRYPTION_KEY.length);
}

export const getUserByEmail = async (email: string): Promise<AuthenticatedUser | null> => {
  const user = await userRepository.findOneBy({ email });
  if (!user) {
    return null;
  }

  user.accessToken = decrypt(user.accessToken, DB_ENCRYPTION_KEY);
  user.refreshToken = decrypt(user.refreshToken, DB_ENCRYPTION_KEY);

  return user;
};

export const getUserById = async (id: string): Promise<AuthenticatedUser | null> => {
  const user = await userRepository.findOneBy({ id });
  if (!user) {
    return null;
  }
  user.accessToken = decrypt(user.accessToken, DB_ENCRYPTION_KEY);
  user.refreshToken = decrypt(user.refreshToken, DB_ENCRYPTION_KEY);
  return user;
};


export const upsertUser = async (user: AuthenticatedUser | Required<Omit<AuthenticatedUser, 'id'>>): Promise<AuthenticatedUser> => {
  const existingUser = await getUserByEmail(user.email);

  if (existingUser) {
    existingUser.firstName = user.firstName || existingUser.firstName;
    existingUser.lastName = user.lastName || existingUser.firstName;
    existingUser.profilePic = user.profilePic || existingUser.profilePic; // <-- Add this line
    existingUser.accessToken = encrypt(user.accessToken || existingUser.accessToken || '', DB_ENCRYPTION_KEY);
    existingUser.refreshToken = encrypt(user.refreshToken || existingUser.refreshToken || '', DB_ENCRYPTION_KEY);
    existingUser.authProvider = user.authProvider || existingUser.authProvider;
    return await userRepository.save(existingUser);
  } else {
    user.accessToken = encrypt(user.accessToken || '', DB_ENCRYPTION_KEY);
    user.refreshToken = encrypt(user.refreshToken || '', DB_ENCRYPTION_KEY);
    return await userRepository.save(user);
  }
}

