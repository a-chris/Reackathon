import { Request, Response } from 'express';
import * as _ from 'lodash';
import { AttendantDb } from '../models/Attendant';
import { HackathonDb } from '../models/Hackathon';
import SocketEvent from '../models/SocketEvent';

const INVITE_STATUSES = new Set(['pending', 'accepted', 'declined']);

export function testWs(req: Request, res: Response) {
    (req.app.get('io') as SocketIO.Server).to('org').emit(SocketEvent.NEW_ATTENDANT, {});
    return res.sendStatus(200);
}

export async function inviteAttendantToGroup(req: Request, res: Response) {
    const attendantIdTo = req.params?.attendantId;
    const attendantIdFrom = req.body?.from;

    if (attendantIdFrom == null)
        return res.status(400).json({
            error: 'Cannot find attendant sender of the invite',
        });

    const attendant = await AttendantDb.findById(attendantIdTo)
        .populate('user')
        .populate('hackathon');
    if (attendant == null)
        return res.status(400).json({
            error: 'Can not find this attendant',
        });

    if (attendant.invites?.find((invite) => invite.from == attendantIdFrom) == null) {
        attendant.invites?.push({
            from: attendantIdFrom,
            status: 'pending',
            date: new Date(),
        } as any);
    }
    await attendant.save();
    (req.app.get('io') as SocketIO.Server).to(attendant.user.username).emit(SocketEvent.NEW_INVITE);
    return res.sendStatus(200);
}

export async function replyToInvite(req: Request, res: Response) {
    const inviteId = req.params?.inviteId;
    const newStatus = req.query?.status;

    if (inviteId == null) return res.status(400).json({ error: 'Cannot find inviteId' });
    if (newStatus == null) return res.status(400).json({ error: 'Cannot find new status' });
    if (!INVITE_STATUSES.has(newStatus.toString())) {
        return res.status(400).json({ error: `Invalid new status ${newStatus}` });
    }

    const attendantReceiver = await AttendantDb.findOne({ 'invites._id': inviteId })
        .populate('from')
        .populate('hackathon');
    if (attendantReceiver == null) return res.sendStatus(400);
    const invite = attendantReceiver?.invites?.find((i) => i._id == inviteId);
    const hackathon = await HackathonDb.findById(attendantReceiver?.hackathon).populate(
        'attendants'
    );
    const attendantSender = await AttendantDb.findById(invite!.from._id);

    if (hackathon?.attendantsRequirements.maxGroupComponents)
        if (attendantSender?.group == null) {
            // create the group for both attendants
            const newGroupNumber = (_.max(hackathon?.attendants?.map((a) => a.group)) || 0) + 1;
            attendantSender!.group = newGroupNumber;
            attendantReceiver!.group = newGroupNumber;
            // remove other invites for this hackathon
            attendantSender!.invites = [];
            attendantReceiver!.invites = [];
        } else {
            // assign to the receiver the sender's group
            const groupMembersCountOfSender = hackathon.attendants.filter(
                (a) => a.group === attendantSender.group
            ).length;
            if (groupMembersCountOfSender < hackathon.attendantsRequirements.maxGroupComponents) {
                attendantReceiver!.group = attendantSender.group;
                // remove other invites for this hackathon
                attendantReceiver!.invites = [];
            } else {
                return res
                    .status(400)
                    .json({ error: 'Max components number reached for this group' });
            }
        }
    invite!.status = newStatus.toString();
    await attendantSender!.save();
    return res.json(await attendantReceiver?.save());
}

export async function getUserAttendants(req: Request, res: Response) {
    const userId = req.params?.userId;
    if (userId == null) return res.status(400).json({ error: 'Missing userId' });
    const attendants = await AttendantDb.find({ 'user': userId as any })
        .populate({
            path: 'invites',
            populate: { path: 'from', populate: { path: 'user', select: 'username' } },
        })
        .populate('hackathon', 'name');
    return res.status(200).json(attendants);
}
