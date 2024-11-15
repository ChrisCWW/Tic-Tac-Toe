'use client';

import { io, Socket } from 'socket.io-client';

let socketIO: Socket;

export const SocketIO = () => {
  if (!socketIO) {
    socketIO = io(process.env.SOCKET_URI, {
      autoConnect: false,
      reconnection: false,
    });
  }
  return socketIO;
}