import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    name: String,
    role: { type: String, enum: ['CLIENT', 'ORGANIZATION'] },
});

export class UserView {
    username: string;
    name: string;

    constructor(username: string, name: string) {
        this.username = username;
        this.name = name;
    }

    public clean() {
        return {
            username: this.username,
            name: this.name,
        };
    }
}

export type User = mongoose.Document & {
    username: string;
    password: string;
    name: string;
    role: string;
};

export const UserDb = mongoose.model<User>('User', userSchema);
