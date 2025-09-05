import express from 'express';
import passport from 'passport';

import { FRONTEND_ORIGIN } from '../tools/constants';

import { TBUser } from '../db/entities/tbUser';

export const baseAuthUrl = '/auth';
export const authRouter = express.Router()

authRouter.get('/authzero',
    passport.authenticate('auth0', { scope: 'openid email profile' }),
);

authRouter.get('/authzero/callback',
    passport.authenticate('auth0', { failureRedirect: `${FRONTEND_ORIGIN}/error` }),
    (req: express.Request, res: express.Response) => {
        req.session.save(() => {
            res.redirect(FRONTEND_ORIGIN);
        });
    });

authRouter.get('/user', (req: express.Request, res: express.Response) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        const thisUser = req.user as TBUser;
        console.log('Authenticated user:', thisUser);

        res.json(thisUser);
    }
    else {
        res.status(401).json({ user: null });
    }
});


authRouter.get('/logout', (req: express.Request, res: express.Response) => {
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