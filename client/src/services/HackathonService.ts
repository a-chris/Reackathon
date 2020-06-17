import axios from 'axios';
import { Hackathon, HackathonStatus, NewHackathon, Statistics } from '../models/Models';

export function getHackathons(filters: {} = {}): Promise<Hackathon[]> {
    return new Promise((resolve, reject) =>
        axios
            .get('/hackathons', { params: filters })
            .then((response: any) => resolve(response.data))
            .catch((error: any) => reject(error))
    );
}

export function getHackathon(id: string): Promise<Hackathon> {
    return new Promise((resolve, reject) =>
        axios
            .get(`/hackathons/${id}`)
            .then((response: any) => resolve(response.data))
            .catch((error: any) => reject(error))
    );
}

export function createHackathon(hackathonData: NewHackathon): Promise<Hackathon> {
    return new Promise((resolve, reject) =>
        axios
            .post('/hackathons', hackathonData)
            .then((response: any) => resolve(response.data))
            .catch((error: any) => reject(error))
    );
}

export function subscribeToHackathon(hackathonId: string): Promise<Hackathon> {
    return new Promise((resolve, reject) =>
        axios
            .put(`/hackathons/${hackathonId}/sub`)
            .then((response: any) => resolve(response.data))
            .catch((error: any) => reject(error))
    );
}

export function changeHackathonStatus(
    hackathonId: string,
    status: HackathonStatus,
    winner?: number
): Promise<Hackathon> {
    return new Promise((resolve, reject) =>
        axios
            .put(`/hackathons/${hackathonId}/status`, null, {
                params: {
                    winner,
                    action: status,
                },
            })
            .then((response: any) => resolve(response.data))
            .catch((error: any) => reject(error))
    );
}

export function getStatistics(): Promise<Statistics> {
    return new Promise((resolve, reject) =>
        axios
            .get(`/stats`)
            .then((response: any) => resolve(response.data))
            .catch((error: any) => reject(error))
    );
}

export function getOrganizationHackathons(organizationId: string): Promise<Hackathon[]> {
    return new Promise((resolve, reject) =>
        axios
            .get('/hackathons/org', { params: { organizationId } })
            .then((response: any) => resolve(response.data))
            .catch((error: any) => reject(error))
    );
}
