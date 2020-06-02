import axios from 'axios';
import { Hackathon, NewHackathon } from '../models/Models';

export function getHackathons(filters: {} = {}): Promise<Hackathon[]> {
    // TODO: add params
    return new Promise((resolve, reject) =>
        axios
            .get('http://localhost:5000/hackathons', { params: filters })
            .then((response: any) => resolve(response.data))
            .catch((error: any) => reject(error))
    );
}

export function getHackathon(id: string): Promise<Hackathon> {
    return new Promise((resolve, reject) =>
        axios
            .get('http://localhost:5000/hackathons/' + id)
            .then((response: any) => resolve(response.data))
            .catch((error: any) => reject(error))
    );
}

export function createHackathon(hackathonData: NewHackathon): Promise<NewHackathon> {
    return new Promise((resolve, reject) =>
        axios
            .post('http://localhost:5000/hackathons', hackathonData)
            .then((response: any) => resolve(response.data))
            .catch((error: any) => reject(error))
    );
}
