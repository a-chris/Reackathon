import { Request, Response } from 'express';
import SocketEvent from '../models/Events';
import { Attendant, HackathonDb } from '../models/Hackathon';

const HackathonAction = ['pending', 'started', 'finished', 'archived'];

type FilterType = {
    city?: string;
    province?: string;
    district?: string;
    country?: string;
    from?: string;
    to?: string;
    status?: string;
};

const mapFiltersToString = (filterName: string) => {
    switch (filterName) {
        case 'city':
        case 'province':
        case 'district':
        case 'country':
            return 'location.' + filterName;
        default:
            return filterName;
    }
};

const HACKATHON_FIELDS = new Set([
    'city',
    'province',
    'district',
    'country',
    'state',
    'from',
    'to',
    'status',
]);

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
    const filters = sanitizeFilters(query);

    HackathonDb.find(filters)
        .populate('organization')
        .exec((err, hackathons) => {
            res.json(hackathons);
        });
}

export function findHackathon(req: Request, res: Response) {
    const hackathonId = req.params?.id;
    if (hackathonId == null) {
        return res.sendStatus(400);
    }
    HackathonDb.findOne({ '_id': hackathonId })
        .populate('attendants.user')
        .populate('organization')
        .exec((err, hackathon) => {
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
    const action = req.body.params?.action?.toString();

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

    const hackathon = await HackathonDb.findById(hackathonId).populate('organization', 'username');
    if (hackathon != null && hackathon?.attendants.find((a) => a.user._id == user._id) == null) {
        /*
         * as any required due to:
         * https://github.com/DefinitelyTyped/DefinitelyTyped/issues/44752
         */
        hackathon.attendants.push({
            user: { _id: user._id },
        } as Attendant);
        /*
         * Notify hackathon organization using socket
         */
        req.app.get('io').emit(hackathon.organization.username, {
            id: hackathon._id,
            event: SocketEvent.USER_SUB,
        });

        await hackathon?.save();
        return res.json(await HackathonDb.findById(hackathonId).populate('attendants.user'));
    } else {
        return res.json(hackathon?.populate('attendants.user'));
    }
}

export async function unsubscribeUser(req: Request, res: Response) {
    const user = req.session?.user;
    const hackathonId = req.params?.id;

    const hackathon = await HackathonDb.findById(hackathonId)
        .populate('organization', 'username')
        .populate('attendants.user');
    if (hackathon != null && hackathon?.attendants.find((a) => a.user._id == user._id) != null) {
        hackathon.attendants = hackathon.attendants.filter((a) => a.user._id != user._id);
        /*
         * Notify hackathon organization using socket
         */
        req.app.get('io').emit(hackathon.organization.username, {
            id: hackathon._id,
            event: SocketEvent.USER_UNSUB,
        });
        return res.json(await hackathon?.save());
    } else {
        return res.json(hackathon);
    }
}
