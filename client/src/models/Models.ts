export enum UserRole {
    ORGANIZATION = 'ORGANIZATION',
    CLIENT = 'CLIENT',
}

export function isUserRole(value: string): value is keyof typeof UserRole {
    return value in UserRole;
}

export class Badge {
    private _win: number;
    private _partecipation: number;

    constructor(win: number, partecipation: number) {
        this._win = win;
        this._partecipation = partecipation;
    }

    public get win(): number {
        return this._win;
    }

    public get partecipation(): number {
        return this._partecipation;
    }
}

export class User {
    private _username: string;
    private _password: string;
    private _name: string;
    private _email: string;
    private _role: UserRole;
    private _badge: Badge;

    constructor(username: string, password: string, name: string, email: string, role: UserRole) {
        this._username = username;
        this._password = password;
        this._name = name;
        this._email = email;
        this._role = role;
        this._badge = this.badge;
    }

    public get username(): string {
        return this._username;
    }

    public get password(): string {
        return this._password;
    }

    public get name(): string {
        return this._name;
    }

    public get email(): string {
        return this._email;
    }

    public get role(): UserRole {
        return this._role;
    }
    public get badge(): Badge {
        return this._badge;
    }
}

export type Location =
    | {
          street: string;
          number: number;
          city: string;
          province: string;
          district: string;
          country: string;
          zip_code: number;
          lat: number;
          long: number;
      }
    | undefined;

export type Prize = {
    amount: number;
    extra: string;
};

export type Hackathon = {
    name: string;
    description: string;
    organization: User;
    attendants: User[];
    startDate: Date;
    endDate: Date;
    location: Location;
    prize: Prize;
};
