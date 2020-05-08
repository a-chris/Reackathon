import { Request, Response } from 'express';
import { UserDb } from '../models/User';

export function signup(req: Request, res: Response): void {
    console.log('register');
}

export function getUsers(req: Request, res: Response): void {
    UserDb.find((err, users) => {
        res.json(users);
    });
}

export function usernameExists(req: Request, res: Response): void {
    const paramUsername = req.query.username;
    if (typeof paramUsername !== 'string') {
        res.sendStatus(400);
    } else {
        UserDb.findOne({ 'username': paramUsername }).countDocuments((err, count) =>
            res.send(count > 0)
        );
    }
}
