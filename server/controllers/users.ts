import { Request, Response } from 'express';
import fs from 'fs';
import * as _ from 'lodash';
import path from 'path';
import { UserDb, UserRole } from '../models/User';

const USER_SECTIONS = new Set(['skills', 'experiences']);

export function getUserDetail(req: Request, res: Response) {
    const username = req.params.username;
    // TODO: sort experiences by date FROM
    UserDb.findOne({ 'username': username }, (err, user) => {
        if (err != null) return res.status(400).json({ error: err });
        return res.json(user);
    });
}

export function usernameExists(req: Request, res: Response) {
    const username = req.query.username;
    if (typeof username !== 'string') {
        res.sendStatus(400);
    } else {
        UserDb.findOne({ 'username': username }).countDocuments((err, count) =>
            res.send(count > 0)
        );
    }
}

export function updateClient(req: Request, res: Response) {
    const username = req.session?.user?.username;
    let data = { ...req.body };

    if (username == null) {
        return res.status(400).json({ error: 'Missing username' });
    } else if (data == null || _.isEmpty(data)) {
        return res.status(400).json({ error: 'Missing data to update' });
    } else {
        const wrongSections = Object.keys(data).filter((k) => !USER_SECTIONS.has(k));
        if (wrongSections.length > 0) {
            return res.status(400).json({ error: `Bad sections: ${wrongSections.join(',')}` });
        } else {
            if (data?.experiences != null) {
                /*
                 * Sort experiences by 'from' descending before to save them
                 */
                data.experiences = _.orderBy(data.experiences, ['from'], ['desc']);
            }
            UserDb.findOneAndUpdate(
                { 'username': username },
                { ...data },
                { new: true },
                (err, user) => {
                    if (err != null) return res.status(400).json({ error: err });
                    return res.json(user);
                }
            );
        }
    }
}

export function updateOrganization() {}

export function uploadAvatar(req: Request, res: Response) {
    const username = req.session?.user?.username;
    const filename = req.file?.filename;
    if (filename == null) return res.status(400).json({ error: 'Invalid image.' });

    UserDb.findOne({ username: username }, (err, user) => {
        if (err != null) return res.status(400).json({ error: err });
        else if (user == null) return res.status(400).json({ error: 'User not found' });

        if (user.avatar != null) {
            // remove previous avatar if present
            fs.unlinkSync(path.resolve(__dirname, '../uploads/' + user.avatar));
        }

        UserDb.findOneAndUpdate(
            { username: username },
            { avatar: filename },
            { new: true },
            (err, user) => {
                if (err != null) return res.status(400).json({ error: err });
                return res.json(user);
            }
        );
    });
}

export function getUsersRanking(req: Request, res: Response) {
    const order = req.query.order;

    let sorting = {};
    if (order === 'partecipation') {
        sorting = { 'badge.partecipation': 'desc', 'badge.win': 'desc' };
    } else {
        sorting = { 'badge.win': 'desc', 'badge.partecipation': 'desc' };
    }

    UserDb.find({ role: UserRole.CLIENT })
        .sort(sorting)
        .exec((err, users) => {
            res.json(users);
        });
}
