import { Request, Response } from 'express';
import { HackathonDb } from '../models/Hackathon';

const HackathonAction = ['pending', 'started', 'finished'];

export function findHackathons(req: Request, res: Response) {
    HackathonDb.find((err, hackathons) => {
        res.json(hackathons);
    });
}

export function findHackathon(req: Request, res: Response) {
    const hackathonId = req.params?.id;
    if (hackathonId == null) {
        return res.sendStatus(400);
    }
    HackathonDb.find({ '_id': hackathonId }, (err, hackathon) => {
        if (hackathon == null) {
            return res.sendStatus(400);
        }
        res.json(hackathon);
    });
}

export function saveHackathons(req: Request, res: Response) {
    const hackathonBody = req.body;
    if (hackathonBody?._id != null) {
        //update already existing
        HackathonDb.updateOne(
            { '_id': hackathonBody._id },
            { ...hackathonBody },
            (err, hackathon) => {
                if (hackathon != null && err == null) {
                    return res.json(hackathonBody);
                } else {
                    console.log(err);
                }
            }
        );
    } else {
        // create new
        HackathonDb.create({ ...hackathonBody })
            .then((hackathon) => {
                res.json(hackathon);
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

export function changeHackathonStatus(req: Request, res: Response) {
    const hackathonId = req.params?.id;
    const action = req.query?.action?.toString();

    if (hackathonId == null || action == null || !HackathonAction.includes(action)) {
        return res.sendStatus(400);
    }
    const nextStatusIndex = HackathonAction.findIndex((v) => v === action);

    HackathonDb.findOne({ '_id': hackathonId }, (err, hackathon) => {
        if (err != null) return res.sendStatus(400);
        const currentStatusIndex = HackathonAction.findIndex((v) => v === hackathon?.status);
        if (currentStatusIndex > nextStatusIndex) return res.sendStatus(400);

        HackathonDb.findOneAndUpdate(
            { '_id': hackathonId },
            { 'status': action },
            { new: true },
            (err, newHackathon) => {
                if (err != null) return res.sendStatus(400);
                return res.json(newHackathon);
            }
        );
    });
}
