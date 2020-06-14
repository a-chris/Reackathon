import axios from 'axios';
import { Attendant, Invite } from '../models/Models';
import { BASE_URL } from './Constants';

const ATTENDANTS_API = `${BASE_URL}/attendants`;

export function inviteAttendantToGroup(attendantIdFrom: string, attendantIdTo: string) {
    return new Promise((resolve, reject) =>
        axios
            .post(`${ATTENDANTS_API}/${attendantIdTo}/invite`, { from: attendantIdFrom })
            .then((response: any) => resolve(response.data))
            .catch((error: any) => reject(error))
    );
}

export function getUserAttendants(userId: string): Promise<Attendant[]> {
    return new Promise((resolve, reject) =>
        axios
            .get(`${ATTENDANTS_API}/${userId}`)
            .then((response: any) => resolve(response.data))
            .catch((error: any) => reject(error))
    );
}

export function acceptInvite(inviteId: string): Promise<Invite> {
    return respondToInvite(inviteId, 'accepted');
}

export function declineInvite(inviteId: string): Promise<Invite> {
    return respondToInvite(inviteId, 'declined');
}

function respondToInvite(inviteId: string, newStatus: string): Promise<Invite> {
    return new Promise((resolve, reject) =>
        axios
            .put(`${ATTENDANTS_API}/invites/${inviteId}`, null, { params: { status: newStatus } })
            .then((response: any) => resolve(response.data))
            .catch((error: any) => reject(error))
    );
}
