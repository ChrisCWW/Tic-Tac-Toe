import { Server, Socket } from 'socket.io';
import GameServices from '../services/GameServices';
import { RoomStatus } from '../types/types';
import { transfromBoard, whoIsWinner } from '../utils/GameUtils';

class RoomController {

  online = (socket: Socket) => {
    try {
      // Update the online list when user online
      GameServices.online(socket);
    } catch (error) {
      console.error('online', error);
    }
  };

  disconnect = (io: Server, socket: Socket) => {
    console.log(`User ${socket.id} disconnect`);

    try {
      // Get the related room and notify all room player to leave
      const rooms = GameServices.offline(socket);
      rooms.forEach((room) => {
        io.to(room).emit('tt-leave');
        io.socketsLeave(room);
      });
    } catch (error) {
      console.error('disconnect', error);
    }
  };

  match = (io: Server, socket: Socket) => {
    try {
      const room = GameServices.findAvailableRoom();

      if (room) {
        if (room.players.length === 1) {
          // Join game room if room available
          const player = room.players[0];
          if (player === socket.id) return;
          
          GameServices.joinRoom(socket, room,player);
          socket.join(room.room_id);
          const { room_id, players } = room;
          io.to(room.room_id).emit('tt-battle', { rid: room_id, players });
        } else {
          // Invalid Room, rematch
          room.status = RoomStatus.unknow;
          this.match(io, socket);
        }
      } else {
        // Create a new room if no available room and make sure no duplicates
        const rooms = GameServices.removeRoomBySID(socket.id);
        rooms.forEach((room) => io.socketsLeave(room));
        const rid = GameServices.createRoom(socket);
        socket.join(rid);
      }
    } catch (error) {
      console.error('match', error);
    }
  };

  nextTurn = (io: Server, socket: Socket, data: { rid: string, move: number }) => {
    try {
      const { rid, move } = data;
      
      const room = GameServices.findRoomByRID(rid);
      if (!room) {
        // Leave the game, if invalid room data
        socket.emit('tt-leave');
        return;
      }

      const { turn, board } = room;
      const updateBoard = transfromBoard(room.board, room.turn, move);
      const updateTurn = turn + 1;

      if (!updateBoard) {
        // Invalid move, send server data to user for restore
        socket.emit('tt-invalidMove', { data: { turn, board } })
        return;
      }

      const winner = whoIsWinner(updateBoard);

      room.turn = updateTurn;
      room.board = updateBoard;
  
      io.to(rid).emit('tt-nextTurn', { turn: updateTurn, board: updateBoard, winner });

      if (winner) {
        // Have winner, end game
        io.socketsLeave(room.room_id);
        GameServices.removeRoomByRID(rid);
      }
    } catch (error) {
      console.error('nextTurn', error);
    }
  };

  leave = (io: Server, socket: Socket) => {
    try {
      const rooms = GameServices.removeRoomBySID(socket.id);
      rooms.forEach((room) => {
        io.to(room).emit('tt-leave');
        io.socketsLeave(room);
      });
      console.log('Leave', rooms);
    } catch (error) {
      console.error('leave', error);
    }
  };
}

export default new RoomController();
