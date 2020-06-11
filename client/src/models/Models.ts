export enum UserRole {
    ORGANIZATION = 'ORGANIZATION',
    CLIENT = 'CLIENT',
}

export enum HackathonStatus {
    PENDING = 'pending',
    STARTED = 'started',
    FINISHED = 'finished',
    ARCHIVED = 'archived',
}

export function isUserRole(value: string): value is keyof typeof UserRole {
    return value in UserRole;
}

export type Badge = {
    win: number;
    partecipation: number;
};

export type Experience = {
    role: string;
    company: string;
    from?: Date;
    to?: Date;
};

export type User = {
    _id: string;
    username: string;
    password: string;
    name: string;
    email: string;
    avatar?: string;
    role: UserRole;
    badge?: Badge;
    skills?: string[];
    experiences?: Experience[];
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

export type Attendant = {
    user: User;
    group: number;
    pendingGroups: number[];
};

export type NewHackathon = {
    name: string;
    description: string;
    attendantsRequirements: {
        description: string;
        minNum?: number;
        maxNum?: number;
        minGroupComponents?: number;
        maxGroupComponents?: number;
    };
    organization: User | undefined;
    startDate: Date;
    endDate: Date;
    location: Location;
    prize: Prize;
};

export type Hackathon = NewHackathon & {
    _id: string;
    attendants: Attendant[];
    status: HackathonStatus;
    organization: User;
};
