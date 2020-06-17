import socketIOClient from 'socket.io-client';

const socketClient = socketIOClient('/');
export default socketClient;
