import mongoose, { Schema } from 'mongoose';
import { User } from './User';

const LocationSchema = new mongoose.Schema({
    lat: Number,
    long: Number,
});

const PrizeSchema = new mongoose.Schema({
    amount: Number,
    extra: String,
});

const HackathonSchema = new mongoose.Schema({
    name: String,
    organization: { type: Schema.Types.ObjectId, ref: 'User' },
    attendants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    startDate: Date,
    endDate: Date,
    status: { type: String, enum: ['started', 'finished'] },
    province: String,
    coords: LocationSchema,
    description: String,
    prize: PrizeSchema,
});

export type Location = mongoose.Document & {
    lat: number;
    long: number;
};

export type Prize = mongoose.Document & {
    amount: number;
    extra: string;
};

export type Hackathon = mongoose.Document & {
    name: string;
    description: string;
    organization: User;
    attendants: User[];
    startDate: Date;
    endDate: Date;
    status: string;
    province: string;
    coords: Location;
    prize: Prize;
};

export const HackathonDb = mongoose.model<Hackathon>('Hackathon', HackathonSchema);
