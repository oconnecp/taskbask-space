import express from 'express';
import passport from 'passport';
import { FRONTEND_ORIGIN } from '../tools/Constants';
import { TBUser } from '../db/entities/TBUser';

const AuthRouter = express.Router()

// base url /auth from the server.ts file

AuthRouter.get('/authzero',
    passport.authenticate('auth0', { scope: 'openid email profile' }),
);
AuthRouter.get('/authzero/callback',
    passport.authenticate('auth0', { failureRedirect: `${FRONTEND_ORIGIN}/error` }),
    (req: express.Request, res: express.Response) => {
        req.session.save(() => {
            res.redirect(FRONTEND_ORIGIN);
        });
    });

AuthRouter.get('/user', (req: express.Request, res: express.Response) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        const thisUser = req.user as TBUser;
        console.log('Authenticated user:', thisUser);

        res.json(thisUser);
    }
    else {
        res.status(401).json({ user: null });
    }
});


AuthRouter.get('/logout', (req: express.Request, res: express.Response) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.redirect(FRONTEND_ORIGIN);
    }
    );
});

export default AuthRouter;