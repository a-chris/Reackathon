export enum UserRole {
    ORGANIZATION,
    CLIENT,
}

export class User {
    private _username: string;
    private _firstname: string;
    private _lastname: string;
    private _role: UserRole;

    constructor(username: string, firstname: string, lastname: string, role: UserRole) {
        this._username = username;
        this._firstname = firstname;
        this._lastname = lastname;
        this._role = role;
    }

    public get username(): string {
        return this._username;
    }
    public get firstname(): string {
        return this._firstname;
    }

    public get lastname(): string {
        return this._lastname;
    }

    public get role(): UserRole {
        return this._role;
    }
}
