import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { User, UserDb } from '../models/User';
import sendWelcomeEmail from '../utils/email';

const DEFAULT_SALT_ROUNDS = 10;

export function isLogged(req: Request, res: Response, next: NextFunction) {
    console.log('TCL: isLogged: ', req.session?.user != null);
    if (req.session?.user) next();
    else return res.sendStatus(401);
}

export function isOrganization(req: Request, res: Response, next: NextFunction) {
    if (req.session?.user?.role === 'ORGANIZATION') next();
    else return res.sendStatus(401);
}

export function isClient(req: Request, res: Response, next: NextFunction) {
    if (req.session?.user?.role === 'CLIENT') next();
    else return res.sendStatus(401);
}

export function info(req: Request, res: Response) {
    const { username } = req.body;
    if (username == null) {
        return res.sendStatus(400);
    }
    UserDb.findOne({ username: username }, (err, storedUser) => {
        if (storedUser == null || err != null) {
            return res.sendStatus(401);
        }
        if (req.session) req.session.user = storedUser;
        console.log('TCL: info -> req.session', req.session);
        res.json(storedUser);
    });
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
        if (req.session) req.session.user = storedUser;
        res.json(storedUser);
    });
}

export function signup(req: Request, res: Response) {
    const newUser = req.body;
    const { username, password } = newUser;
    if (username == null || password == null) {
        return res.sendStatus(400);
    }
    UserDb.create({ ...newUser, password: bcrypt.hashSync(password, DEFAULT_SALT_ROUNDS) })
        .then((storedUser: User) => {
            if (req.session) req.session.user = storedUser;
            sendWelcomeEmail(storedUser.email);
            res.json(storedUser);
        })
        .catch((err) => {
            const { code, errmsg } = err;
            res.status(400).json({
                error: code !== 11000 ? errmsg : 'Username already taken.',
            });
        });
}

export function logout(req: Request, res: Response) {
    req.session?.destroy((err) => {
        if (err != null) return res.json({ error: err });
        res.status(200).clearCookie('reackathon_session');
    });
}
