import mongoose from 'mongoose';

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

export const UserSchema = new mongoose.Schema({
    username: { type: String, index: true, unique: true },
    password: String,
    name: String,
    email: String,
    role: { type: String, enum: ['CLIENT', 'ORGANIZATION'] },
    badge: {
        type: BadgeSchema,
        required: function (this: User) {
            return this.role === 'CLIENT';
        },
        default: function (this: User) {
            if (this.role === 'CLIENT') return BadgeSchema;
        },
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
    role: string;
    badge?: Badge;
};

export const UserDb = mongoose.model<User>('User', UserSchema);
