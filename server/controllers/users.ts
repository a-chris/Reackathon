import { Request, Response } from 'express';
import { UserDb } from '../models/User';

const ACCESS_TOKEN_SECRET = 'cesena2020';

export function getUsers(req: Request, res: Response) {
    UserDb.find((err, users) => {
        // TODO: sanitize users data
        res.json(users);
    });
}

export function usernameExists(req: Request, res: Response) {
    const paramUsername = req.query.username;
    if (typeof paramUsername !== 'string') {
        res.sendStatus(400);
    } else {
        UserDb.findOne({ 'username': paramUsername }).countDocuments((err, count) =>
            res.send(count > 0)
        );
    }
}

export function updateUser(req: Request, res: Response) {}
