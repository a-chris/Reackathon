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

export class Location {
    private _street: string;
    private _number: number;
    private _city: string;
    private _province: string;
    private _district: string;
    private _country: string;
    private _zip_code: number;
    private _lat: number;
    private _long: number;

    constructor(
        street: string,
        number: number,
        city: string,
        province: string,
        district: string,
        country: string,
        zip_code: number,
        lat: number,
        long: number
    ) {
        this._street = street;
        this._number = number;
        this._city = city;
        this._province = province;
        this._district = district;
        this._country = country;
        this._zip_code = zip_code;
        this._lat = lat;
        this._long = long;
    }

    public get street(): string {
        return this._street;
    }

    public get number(): number {
        return this._number;
    }

    public get city(): string {
        return this._city;
    }

    public get province(): string {
        return this._province;
    }

    public get district(): string {
        return this._district;
    }

    public get country(): string {
        return this._country;
    }

    public get zip_code(): number {
        return this._zip_code;
    }

    public get lat(): number {
        return this._lat;
    }

    public get long(): number {
        return this._long;
    }
}

export class Prize {
    private _amount: number;
    private _extra: string;

    constructor(amount: number, extra: string) {
        this._amount = amount;
        this._extra = extra;
    }

    public get amount(): number {
        return this._amount;
    }

    public get extra(): string {
        return this._extra;
    }
}

export class Hackathon {
    private _name: string;
    private _description: string;
    private _organization: User;
    private _attendants: User[];
    private _startDate: Date;
    private _endDate: Date;
    private _location: Location;
    private _prize: Prize;

    constructor(
        name: string,
        description: string,
        organization: User,
        attendants: User[],
        startDate: Date,
        endDate: Date,
        location: Location,
        prize: Prize
    ) {
        this._name = name;
        this._description = description;
        this._organization = organization;
        this._attendants = attendants;
        this._startDate = startDate;
        this._endDate = endDate;
        this._location = location;
        this._prize = prize;
    }

    public get name(): string {
        return this._name;
    }
    public get description(): string {
        return this._description;
    }

    public get organization(): User {
        return this._organization;
    }

    public get attendants(): User[] {
        return this._attendants;
    }

    public get startDate(): Date {
        return this._startDate;
    }

    public get endDate(): Date {
        return this._endDate;
    }

    public get location(): Location {
        return this._location;
    }

    public get prize(): Prize {
        return this._prize;
    }
}
