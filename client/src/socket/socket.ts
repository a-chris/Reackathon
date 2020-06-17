import io from 'socket.io-client';

const socketClient = io.connect('/', { autoConnect: false });
export default socketClient;
