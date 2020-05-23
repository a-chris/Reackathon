import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    name: String,
    role: { type: String, enum: ['CLIENT', 'ORGANIZATION'] },
});

/**
 * Remove the password field when the user is serialized to JSON
 * https://github.com/Automattic/mongoose/issues/1020
 */
UserSchema.method('toJSON', function () {
    const user: User = this.toObject();
    delete user.password;
    delete user.__v;
    return user;
});

export type User = mongoose.Document & {
    username: string;
    password: string;
    name: string;
    role: string;
};

export const UserDb = mongoose.model<User>('User', UserSchema);
