import { Request, Response } from 'express';

export function login(req: Request, res: Response): void {
    req.body();
    console.log('login user');
}
