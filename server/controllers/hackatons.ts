import { Request, Response } from 'express';
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
    const organizationId = req.query.organizationId;

    if (organizationId == null) {
        return res.sendStatus(400);
    }

    HackathonDb.find({ 'organization': organizationId as any })
        // .populate('organization') TODO adds populate?
        .exec((err, hackathons) => {
            res.json(hackathons);
        });
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

        HackathonDb.findOneAndUpdate({ '_id': hackathonId }, { 'status': action }, { new: true })
            .populate({
                path: 'attendants',
                populate: { path: 'user' },
            })
            .exec((err, newHackathon) => {
                if (err != null) return res.sendStatus(400);
                return res.json(newHackathon);
            });
    });
}

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

    const hackathon = await HackathonDb.findById(hackathonId);
    if (hackathon == null)
        return res.status(400).json({
            error: 'Can not find this hackathon',
        });
    // TODO: check if attendant already exist in this hackathon
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

// TODO: remove this
export async function unsubscribeUser(req: Request, res: Response) {
    const user = req.session?.user;
    const hackathonId = req.params?.id;

    const hackathon = await HackathonDb.findById(hackathonId)
        .populate('organization', 'username')
        .populate('attendants.user');
    if (hackathon == null) return res.status(400).json({ error: 'Can not find this hackathon' });
    if (hackathon?.attendants.find((a) => a.user._id == user._id) != null) {
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

export function organizationStats(req: Request, res: Response) {
    const user = req.session?.user;

    if (user._id == null || user.role != UserRole.ORGANIZATION) {
        return res.sendStatus(401);
    }

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
    // return res.json(stats);
}
