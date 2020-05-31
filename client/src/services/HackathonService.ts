import axios from 'axios';
import { Hackathon } from '../models/Models';

export function getHackathons(filters: {} = {}): Promise<Hackathon[]> {
    // TODO: add params
    return new Promise((resolve, reject) =>
        axios
            .get('http://localhost:5000/hackathons', filters)
            .then((response: any) => resolve(response.data))
            .catch((error: any) => reject(error))
    );
}

export function createHackathon(hackathonData: Hackathon): Promise<Hackathon> {
    return new Promise((resolve, reject) =>
        axios
            .post('http://localhost:5000/hackathons', hackathonData)
            .then((response: any) => resolve(response.data))
            .catch((error: any) => reject(error))
    );
}