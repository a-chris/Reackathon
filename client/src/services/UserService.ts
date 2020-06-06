import axios from 'axios';
import { Experience, User } from '../models/Models';
import { BASE_URL } from './Constants';

const USERS_API = `${BASE_URL}/users`;

export function getUserDetail(username: string): Promise<User> {
    return new Promise((resolve, reject) =>
        axios
            .get(`${USERS_API}/${username}`)
            .then((response: any) => resolve(response.data))
            .catch((error: any) => reject(error))
    );
}

export function saveClientExperiences(username: string, experiences: Experience[]): Promise<User> {
    return new Promise((resolve, reject) =>
        axios
            .post(`${USERS_API}/${username}`, { experiences })
            .then((response: any) => resolve(response.data))
            .catch((error: any) => reject(error))
    );
}

export function saveClientSkills(username: string, skills: string[]): Promise<User> {
    return new Promise((resolve, reject) =>
        axios
            .post(`${USERS_API}/${username}`, { skills })
            .then((response: any) => resolve(response.data))
            .catch((error: any) => reject(error))
    );
}

export function uploadAvatar(username: string, avatar: any): Promise<User> {
    const formData = new FormData();
    formData.append('avatar', avatar);
    const options = {
        headers: { 'Content-Type': 'multipart/form-data' },
    };
    return new Promise((resolve, reject) =>
        axios
            .post(`${USERS_API}/${username}/avatar`, formData, options)
            .then((response: any) => resolve(response.data))
            .catch((error: any) => reject(error))
    );
}
