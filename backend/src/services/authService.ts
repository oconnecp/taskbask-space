import passport from 'passport';
import { Strategy as Auth0Strategy } from 'passport-auth0';
import { Application } from 'express';
import { BACKEND_ORIGIN, AUTH_ZERO_DOMAIN, AUTH_ZERO_CLIENT_ID, AUTH_ZERO_CLIENT_SECRET } from '../tools/constants';
import { upsertUser, getUserById } from '../db/repositories/tbUserRepository';

export const initializeAuthService = (app: Application) => {
    app.use(passport.initialize());
    app.use(passport.session());

    // Configure Auth0 OAuth strategy
    const authZeroCallbackURL = `${BACKEND_ORIGIN}/api/auth/authzero/callback`;

    passport.use(new Auth0Strategy({
        domain: AUTH_ZERO_DOMAIN || '',
        clientID: AUTH_ZERO_CLIENT_ID || '',
        clientSecret: AUTH_ZERO_CLIENT_SECRET || '',
        callbackURL: authZeroCallbackURL,
        state: true
    },
        async (accessToken: string, _refreshToken: string, extraParams: any, profile: any, done: (error: any, user?: any) => void) => {
            try {

                const saveableUser = {
                    name: profile.displayName,
                    authZeroId: profile.id,
                    profilePictureUrl: profile.picture || null,
                    email: profile.emails[0].value || null,
                    accessToken,
                    profileJson: profile,
                    authProvider: profile.provider,
                };

                console.log('login detected from: ', saveableUser.name);

                const user = await upsertUser(saveableUser);
                if (!user) {
                    return done(new Error("Error saving user to database"));
                }
                return done(null, user);
            } catch (err) {
                console.error("Error in AuthZeroStrategy:", err);
                return done(err);
            }
        }));


    passport.serializeUser((user: any, done) => {
        console.log('Serializing user:', user);
        done(null, user.id);
    });

    passport.deserializeUser(async (id: number, done) => {
        console.log('Deserializing user with id:', id);
        const user = await getUserById(id.toString());
        done(null, user);
    });
}
