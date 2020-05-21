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
