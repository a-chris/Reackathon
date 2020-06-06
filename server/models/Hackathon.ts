import mongoose from 'mongoose';
import { User } from './User';

// Schemas definition
const LocationSchema = new mongoose.Schema({
    street: String,
    number: Number,
    city: String,
    province: String,
    district: String,
    country: String,
    zip_code: Number,
    lat: Number,
    long: Number,
});

const GroupSchema = new mongoose.Schema({
    name: { type: String, unique: true, sparse: true },
    leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    teamSize: { type: Number, min: 1 },
});

const AttendantSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
    group: { type: Number, required: false },
    pendingGroups: { type: [Number], required: false },
});

const AttendantsRequirementsSchema = new mongoose.Schema({
    description: String,
    maxNum: { type: Number, required: false },
    minNum: { type: Number, required: false },
});

const PrizeSchema = new mongoose.Schema({
    amount: { type: Number, min: 0 },
    extra: String,
});

const HackathonSchema = new mongoose.Schema({
    name: String,
    description: String,
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    attendants: { type: [AttendantSchema], unique: true },
    attendantsRequirements: AttendantsRequirementsSchema,
    group: [GroupSchema],
    startDate: Date,
    endDate: Date,
    status: { type: String, enum: ['pending', 'started', 'finished'] },
    location: LocationSchema,
    prize: PrizeSchema,
});

// Types definition
export type Location = mongoose.Document & {
    street: string;
    number: number;
    city: string;
    province: string;
    district: string;
    country: string;
    zip_code: number;
    lat: number;
    long: number;
};

export type Prize = mongoose.Document & {
    amount: number;
    extra: string;
};

export type Group = mongoose.Document & {
    name: string;
    leader: User;
    teamSize: { type: number; min: 1 };
};

/*
 * Take care to this issue:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/issues/44752
 */
export type Attendant = mongoose.Document & {
    user: User;
    group?: number;
    pendingGroups?: number[];
};

export type Hackathon = mongoose.Document & {
    _id: string;
    name: string;
    description: string;
    organization: User;
    attendants: Attendant[];
    attendantsRequirements: {
        description: string;
        maxNum: number | undefined;
        minNum: number | undefined;
    };
    groups: Group[];
    startDate: Date;
    endDate: Date;
    status: string;
    location: Location;
    prize: Prize;
};

export const HackathonDb = mongoose.model<Hackathon>('Hackathon', HackathonSchema);
