import axios from 'axios';
import { User } from '../models/Models';

export type LoginData = {
    username: string;
    password: string;
};

export function login(loginData: LoginData): Promise<User> {
    return new Promise((resolve, reject) =>
        axios
            .post('http://localhost:5000/login', loginData)
            .then((response: any) => resolve(response))
            .catch((error: any) => reject(error))
    );
}
