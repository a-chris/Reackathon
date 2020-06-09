enum SocketEvent {
    USER_SUB,
    USER_UNSUB,
}

export default SocketEvent;

export interface HackathonSocketData {
    id: string;
    event: SocketEvent;
}
