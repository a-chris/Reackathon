import { Request, Response } from 'express';
import { HackathonDb } from '../models/Hackathon';

const HackathonAction = ['pending', 'started', 'finished'];

type FilterType = {
    city?: string;
    country?: string;
    state?: string;
    name?: string;
};

const mapFiltersToString = (filterName: string) => {
    switch (filterName) {
        case 'city':
            return 'location.city';
        case 'country':
            return 'location.country';
        case 'name':
            return 'name';
        default:
            return undefined;
    }
};

const HACKATHON_FIELDS = new Set(['city', 'country', 'name']);

const sanitizeFilters = (filters: any): FilterType => {
    const sanitizedFilters: any = {};
    if (filters) {
        Object.entries(filters)
            .filter((e) => HACKATHON_FIELDS.has(e[0]))
            .forEach((e) => {
                const key = mapFiltersToString(e[0]);
                if (key != undefined) {
                    sanitizedFilters[key] = e[1];
                }
            });
    }
    return sanitizedFilters as FilterType;
};

export function findHackathons(req: Request, res: Response) {
    const query = req.query;
    let filters = sanitizeFilters(query);

    HackathonDb.find(filters, (err, hackathons) => {
        res.json(hackathons);
    });
}

export function findHackathon(req: Request, res: Response) {
    const hackathonId = req.params?.id;
    if (hackathonId == null) {
        return res.sendStatus(400);
    }
    HackathonDb.findOne({ '_id': hackathonId }, (err, hackathon) => {
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

export async function subscribeUser(req: Request, res: Response) {
    const user = req.session?.user;
    const hackathonId = req.params?.id;

    const hackathon = await HackathonDb.findById(hackathonId);
    if (hackathon?.attendants.find((a) => a.user._id == user._id) == null) {
        /*
         * as any required due to:
         * https://github.com/DefinitelyTyped/DefinitelyTyped/issues/44752
         */
        hackathon?.attendants.push({
            user: { _id: user._id },
        } as any);
        return res.json(await hackathon?.save());
    } else {
        return res.json(hackathon);
    }
}

export async function unsubscribeUser(req: Request, res: Response) {
    const user = req.session?.user;
    const hackathonId = req.params?.id;

    const hackathon = await HackathonDb.findById(hackathonId);
    if (hackathon != null) {
        hackathon.attendants = hackathon.attendants.filter((a) => a.user._id != user._id);
        return res.json(await hackathon?.save());
    }
    return res.json(hackathon);
}
