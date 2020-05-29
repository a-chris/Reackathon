import mongoose from 'mongoose';
import { User } from './User';

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

const PrizeSchema = new mongoose.Schema({
    amount: {
        type: Number,
        min: 0,
    },
    extra: String,
});

const HackathonSchema = new mongoose.Schema({
    name: String,
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    attendants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    startDate: Date,
    endDate: Date,
    status: { type: String, enum: ['pending', 'started', 'finished'] },
    location: LocationSchema,
    description: String,
    prize: PrizeSchema,
});

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

export type Hackathon = mongoose.Document & {
    name: string;
    description: string;
    organization: User;
    attendants: User[];
    startDate: Date;
    endDate: Date;
    status: string;
    location: Location;
    prize: Prize;
};

export const HackathonDb = mongoose.model<Hackathon>('Hackathon', HackathonSchema);
