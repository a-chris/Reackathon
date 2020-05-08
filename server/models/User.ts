import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    firstname: String,
    lastname: String,
});

export type User = mongoose.Document & {
    username: String;
    password: String;
    firstname: String;
    lastname: String;
};

export const UserDb = mongoose.model<User>('User', userSchema);
