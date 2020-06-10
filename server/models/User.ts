import mongoose from 'mongoose';

export enum UserRole {
    ORGANIZATION = 'ORGANIZATION',
    CLIENT = 'CLIENT',
}

const BadgeSchema = new mongoose.Schema({
    win: {
        type: Number,
        default: 0,
        min: 0,
    },
    partecipation: {
        type: Number,
        default: 0,
        min: 0,
    },
});

export type Badge = mongoose.Document & {
    win: number;
    partecipation: number;
};

const ExperienceSchema = new mongoose.Schema({
    role: {
        type: String,
    },
    company: {
        type: String,
    },
    from: {
        type: Date,
    },
    to: {
        type: Date,
    },
});

export type Experience = mongoose.Document & {
    role: String;
    company: String;
    from: Date;
    to: Date;
};

export const UserSchema = new mongoose.Schema({
    username: { type: String, index: true, unique: true },
    password: String,
    name: String,
    email: String,
    avatar: { type: String, required: false },
    role: { type: String, enum: [UserRole.CLIENT, UserRole.ORGANIZATION] },
    badge: {
        type: BadgeSchema,
        required: function (this: User) {
            return this.role === UserRole.CLIENT;
        },
        default: function (this: User) {
            if (this.role === UserRole.CLIENT) return BadgeSchema;
        },
    },
    skills: {
        type: [String],
    },
    experiences: {
        type: [ExperienceSchema],
    },
});

/**
 * Remove the password field when the user is serialized to JSON
 * https://github.com/Automattic/mongoose/issues/1020
 */
UserSchema.method('toJSON', function (this: User) {
    const user: User = this.toObject();
    delete user.password;
    delete user.__v;
    return user;
});

export type User = mongoose.Document & {
    username: string;
    password: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    badge?: Badge;
    skills: string[];
    experiences: Experience[];
};

export const UserDb = mongoose.model<User>('User', UserSchema);
