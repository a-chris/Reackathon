import { Request, Response } from 'express';
import * as _ from 'lodash';
import { AttendantDb } from '../models/Attendant';
import SocketEvent from '../models/Events';
import { HackathonDb } from '../models/Hackathon';
import { UserRole } from '../models/User';

const HackathonAction = ['pending', 'started', 'finished', 'archived'];

type FilterType = {
    city?: string;
    province?: string;
    region?: string;
    country?: string;
    from?: string;
    to?: string;
    status?: string;
};

export type Statistic = {
    totalHackathons: number;
    pendingHackathons: number;
    totalPrize: number;
    totalAttendants: number;
};

const mapFiltersToString = (filterName: string) => {
    switch (filterName) {
        case 'city':
        case 'province':
        case 'region':
        case 'country':
            return 'location.' + filterName;
        default:
            return filterName;
    }
};

const HACKATHON_FIELDS = new Set(['city', 'province', 'country', 'state', 'from', 'to', 'status']);

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
        .populate({
            path: 'attendants',
            populate: { path: 'user' },
        })
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

export function findOrganizationHackathons(req: Request, res: Response) {
    const user = req.session?.user;

    if (user._id == null || user.role != UserRole.ORGANIZATION) {
        return res.sendStatus(401);
    }

    HackathonDb.find({ 'organization': user._id })
        .populate('organization')
        .exec((err, hackathons) => {
            res.json(hackathons);
        });
}

export async function changeHackathonStatus(req: Request, res: Response) {
    const hackathonId = req.params?.id;
    const winnerGroup = req.query?.winner;
    const action = req.query?.action?.toString();

    if (hackathonId == null || action == null || !HackathonAction.includes(action)) {
        return res.sendStatus(400);
    }
    if (action === 'finished' && winnerGroup == null) {
        return res.status(400).json({ error: 'Cannot finish a hackathon without a winner' });
    }

    const nextStatusIndex = HackathonAction.findIndex((v) => v === action);

    const hackathon = await HackathonDb.findById(hackathonId).populate({
        path: 'attendants',
        populate: {
            path: 'user',
        },
    });
    if (hackathon == null) return res.sendStatus(400);

    const currentStatusIndex = HackathonAction.findIndex((v) => v === hackathon?.status);
    if (currentStatusIndex > nextStatusIndex) return res.sendStatus(400);

    if (action === 'started') {
        // create group for every attendant
        const attendantsWithoutGroup = hackathon.attendants.filter((a) => a.group == null);
        let maxGroupCount = _.max(hackathon.attendants.map((a) => a.group)) || 0;
        await attendantsWithoutGroup.forEach(async (a) => {
            a.group = ++maxGroupCount;
            await a.save();
        });
    } else if (action === 'finished') {
        // we already checked winnerGroup is not null
        hackathon.winnerGroup = parseInt(winnerGroup!.toString());

        await hackathon.attendants.forEach(async (a) => {
            // adds partecipation badge for all the attendants
            a.user.badge!.partecipation += 1;
            if (a.group?.toString() == winnerGroup!.toString()) {
                // adds win badge for winners only
                a.user.badge!.win += 1;
            }
            await a.user.save();
        });
    }

    hackathon.status = action;
    await hackathon.save();

    const newHackathon = await HackathonDb.findById(hackathonId)
        .populate('organization')
        .populate({
            path: 'attendants',
            populate: { path: 'user', select: 'username' },
        });
    return res.json(newHackathon);
}

// TODO: remove this function
export async function deleteAttendant(req: Request, res: Response) {
    const hackathonId = req.params?.id;
    const hackathon = await HackathonDb.findById(hackathonId);
    hackathon!.attendants = [];
    hackathon!.save();

    await AttendantDb.remove({});
    res.sendStatus(200);
}

export async function subscribeUser(req: Request, res: Response) {
    const user = req.session?.user;
    const hackathonId = req.params?.id;

    const hackathon = await HackathonDb.findById(hackathonId).populate({
        path: 'attendants',
        populate: { path: 'user' },
    });
    if (hackathon == null)
        return res.status(400).json({
            error: 'Can not find this hackathon',
        });

    if (hackathon.attendants.find((a) => a.user === user._id) != null) {
        return res.status(400).json({ error: 'User already subscribed to this hackathon' });
    }
    const newAttendant = await AttendantDb.create({
        user: user._id,
        hackathon: hackathon._id,
    });
    hackathon.attendants.push(newAttendant._id as any);
    await hackathon.save();
    /*
     * Notify hackathon organization using socket
     */
    req.app.get('io').emit(hackathon.organization.username, {
        id: hackathon._id,
        event: SocketEvent.NEW_ATTENDANT,
    });
    return res.json(
        await HackathonDb.findById(hackathon._id).populate({
            path: 'attendants',
            populate: { path: 'user' },
        })
    );
}

export function organizationStats(req: Request, res: Response) {
    const user = req.session?.user;

    if (user._id == null) return res.sendStatus(401);

    const stats = {
        totalHackathons: 0,
        pendingHackathons: 0,
        totalAttendants: 0,
        totalPrize: 0,
    };

    HackathonDb.find({ organization: user._id }).exec((err, results) => {
        if (results.length > 0) {
            stats.totalHackathons = results.length;
            stats.pendingHackathons = results.filter(
                (hackathon) => hackathon.status === 'pending'
            ).length;
            stats.totalAttendants = results
                .map((hackathon) => hackathon.attendants.length)
                .reduce((numAttendantsA, numAttendantsB) => numAttendantsA + numAttendantsB);
            stats.totalPrize = results
                .map((hackathon) => hackathon.prize.amount)
                .reduce((amountA, amountB) => amountA + amountB);
        }
        return res.json(stats);
    });
    return res.json({});
}
