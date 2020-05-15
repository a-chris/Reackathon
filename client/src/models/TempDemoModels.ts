import { User, UserRole, Prize, Location, Hackathon } from './Models';

export const fakeUser = new User(
    'John_Doe',
    '123456',
    'John Doe',
    'john_doe@email.com',
    UserRole.CLIENT
);

export const fakeOrganization = new User(
    'VeryBigOrganization',
    '123456',
    'Very Big Organization',
    'organization@email.com',
    UserRole.ORGANIZATION
);

export const fakeLocation = new Location('', 1, '', '', '', '', 1, 1, 1);

export const fakePrize = new Prize(5000, 'Premio da dividere tra i primi tre classificati.');

export const fakeHackathon = new Hackathon(
    '',
    '',
    fakeOrganization,
    [fakeUser],
    new Date(),
    new Date(),
    fakeLocation,
    fakePrize
);
