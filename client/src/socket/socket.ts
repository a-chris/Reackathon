import socketIOClient from 'socket.io-client';

const socketClient = socketIOClient('http://localhost:5000');
export default socketClient;
