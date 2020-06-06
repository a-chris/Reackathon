export enum UserRole {
    ORGANIZATION = 'ORGANIZATION',
    CLIENT = 'CLIENT',
}

export enum HackathonStatus {
    PENDING = 'pending',
    STARTED = 'started',
    FINISHED = 'finished',
}

export function isUserRole(value: string): value is keyof typeof UserRole {
    return value in UserRole;
}

export type Badge = {
    win: number;
    partecipation: number;
};

export type User = {
    _id: string;
    username: string;
    password: string;
    name: string;
    email: string;
    role: UserRole;
    badge?: Badge;
};

export type Location = {
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

export type Prize = {
    amount: number;
    extra: string;
};

export type Group = {
    name: string;
    leader: User;
    teamSize: number;
};

export type Attendant = {
    user: User;
    group: Group | undefined;
    pendingGroups: Group[];
};

export type NewHackathon = {
    name: string;
    description: string;
    attendantsRequirements: {
        description: string;
        minNum?: number;
        maxNum?: number;
    };
    organization: User;
    startDate: Date;
    endDate: Date;
    location: Location;
    prize: Prize;
};

export type Hackathon = NewHackathon & {
    _id: string;
    attendants: Attendant[];
    groups: Group[];
    status: HackathonStatus;
};
