import axios from 'axios';
import { Hackathon } from '../models/Models';

export function creation(hackathonData: Hackathon): Promise<Hackathon> {
    return new Promise((resolve, reject) =>
        axios
            .post('http://localhost:5000/hackathons/create', hackathonData)
            .then((response: any) => resolve(response.data))
            .catch((error: any) => reject(error))
    );
}
