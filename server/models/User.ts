import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    firstname: String,
    lastname: String,
    role: { type: String, enum: ['client', 'organization'] },
});

export class UserView {
    username: string;
    firstname: string;
    lastname: string;

    constructor(username: string, firstname: string, lastname: string) {
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
    }

    public clean() {
        return {
            username: this.username,
            firstname: this.firstname,
            lastname: this.lastname,
        };
    }
}

export type User = mongoose.Document & {
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    role: string;
};

export const UserDb = mongoose.model<User>('User', userSchema);
