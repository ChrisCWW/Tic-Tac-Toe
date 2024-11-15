import dotenv from 'dotenv';
dotenv.config({path: './.env.local'});

import express, { Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { corsConfig } from './config/corsConfig';
import RoomContoller from './controllers/RoomContoller';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: corsConfig,
  pingInterval: 3000,
  pingTimeout: 10000,
});

io.on('connection', (socket) => {
    console.log(`User: ${socket.id} connected`);

    RoomContoller.online(socket);
    socket.on('disconnect', () => RoomContoller.disconnect(io, socket));
    socket.on('ttt-match', () => RoomContoller.match(io, socket));
    socket.on('ttt-nextTurn', (data) => RoomContoller.nextTurn(io, socket, data));
    socket.on('ttt-leave', () => RoomContoller.leave(io, socket));
});

app.all('*', (_, res: Response) => {
  res.sendStatus(404);
});
        
const port = process.env.SERVER_PORT || 8080;

server.listen(port, () => {
    console.log(`Server running at port: ${port}`)
});