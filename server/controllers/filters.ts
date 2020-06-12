import { Request, Response } from 'express';
import { HackathonDb } from '../models/Hackathon';

export function getAvailableCities(req: Request, res: Response) {
    HackathonDb.find({})
        .sort({ 'location.city': 'asc' })
        .distinct('location.city')
        .exec((err, cities) => {
            res.json(cities);
        });
}
