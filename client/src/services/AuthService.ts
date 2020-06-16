import axios from 'axios';
import { User, UserRole } from '../models/Models';
import { setLocalUser } from './UserService';

export interface LoginData {
    username: string;
    password: string;
}

export interface SignupData extends LoginData {
    email: string;
    role: UserRole;
    name: string;
}

export function login(loginData: LoginData): Promise<User> {
    return new Promise((resolve, reject) =>
        axios
            .post('/login', loginData)
            .then((response: any) => resolve(response.data))
            .catch((error: any) => reject(error))
    );
}

export function signup(loginData: LoginData): Promise<User> {
    return new Promise((resolve, reject) =>
        axios
            .post('/signup', loginData)
            .then((response: any) => resolve(response.data))
            .catch((error: any) => reject(error))
    );
}

export function usernameAlreadyExists(username: string): Promise<boolean> {
    return new Promise((resolve, reject) =>
        axios
            .get('/users/exist', { params: { username } })
            .then((response: any) => resolve(response.data))
            .catch((error: any) => reject(error))
    );
}

export function logout(loginData: LoginData): Promise<boolean> {
    return new Promise((resolve, reject) =>
        axios
            .post('/logout', loginData)
            .then((response: any) => {
                console.log('TCL: response', response);
                setLocalUser(null);
                resolve(response.data);
            })
            .catch((error: any) => reject(error))
    );
}
