import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { User, UserDb } from '../models/User';

const DEFAULT_SALT_ROUNDS = 10;

export function isLogged(req: Request, res: Response, next: NextFunction) {
    console.log('TCL: isLogged -> req.session', req.session);
    if (req.session?.user) next();
    else return res.sendStatus(401);
}

export function isOrganization(req: Request, res: Response, next: NextFunction) {
    if (req.session?.user != null && req.session?.user?.role === 'organization') next();
    else return res.sendStatus(401);
}

export function login(req: Request, res: Response) {
    const { username, password } = req.body;
    if (username == null || password == null) {
        return res.sendStatus(400);
    }
    UserDb.findOne({ username: username }, (err, storedUser) => {
        if (storedUser == null || err != null) {
            return res.sendStatus(401);
        }
        if (!bcrypt.compareSync(password, storedUser.password)) {
            return res.sendStatus(401);
        }
        const sanitizedUser = sanitizeUser(storedUser);
        if (req.session) req.session.user = sanitizedUser;
        res.json(sanitizeUser(storedUser));
    });
}

export function signup(req: Request, res: Response) {
    const newUser = req.body;
    const { username, password } = newUser;
    if (newUser == null || username == null || password == null) {
        return res.sendStatus(400);
    }
    UserDb.create({ ...newUser, password: bcrypt.hashSync(password, DEFAULT_SALT_ROUNDS) })
        .then((storedUser: User) => {
            const sanitizedUser = sanitizeUser(storedUser);
            if (req.session) req.session.user = sanitizedUser;
            res.json(sanitizedUser);
        })
        .catch((err) => {
            const { code, errmsg } = err;
            if (code === 11000)
                res.status(400).json({
                    error: code !== 11000 ? errmsg : 'Username already taken.',
                });
        });
}

export function logout(req: Request, res: Response) {
    req.session?.destroy((err) => {
        if (err != null) return res.json({ error: err });
        res.sendStatus(200);
    });
}

/**
 * Hides private fields of User.
 */
function sanitizeUser(user: User) {
    return {
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
    };
}
