enum SocketEvent {
    NEW_ATTENDANT,
    USER_UNSUB,
}

export default SocketEvent;

export interface HackathonSocketData {
    id: string;
    event: SocketEvent;
}
