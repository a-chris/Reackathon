import mongoose from 'mongoose';
import { Hackathon } from './Hackathon';
import { User } from './User';

const InviteGroupSchema = new mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'Attendant' },
    date: Date,
    status: { type: String, enum: ['pending', 'accepted', 'declined'] },
});

export const AttendantSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    hackathon: { type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon' },
    group: { type: Number, required: false },
    invites: { type: [InviteGroupSchema], required: false },
});

export type InviteGroup = mongoose.Document & {
    from: Attendant;
    date: Date;
    status: string;
};

/*
 * Take care to this issue:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/issues/44752
 */
export type Attendant = mongoose.Document & {
    user: User;
    hackathon: Hackathon;
    group?: number;
    invites?: InviteGroup[];
};

export const AttendantDb = mongoose.model<Attendant>('Attendant', AttendantSchema);
