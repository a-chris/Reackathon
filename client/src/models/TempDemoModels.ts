import { User, UserRole, Location } from './Models';

// export const fakeUser = new User(
//     'John_Doe',
//     '123456',
//     'John Doe',
//     'john_doe@email.com',
//     UserRole.CLIENT
// );

export const fakeOrganization: User = {
    username: 'VeryBigOrganization',
    password: '123456',
    name: 'Very Big Organization',
    email: 'organization@email.com',
    role: UserRole.ORGANIZATION,
    badge: undefined,
};

export const fakeLocation: Location = {
    street: 'via Brusi',
    number: 20,
    city: 'Cesena',
    province: 'FC',
    district: 'FC',
    country: 'Italy',
    zip_code: 47521,
    lat: 44.147317,
    long: 12.239908,
};
