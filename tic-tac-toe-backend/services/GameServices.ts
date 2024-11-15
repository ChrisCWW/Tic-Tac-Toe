import { Socket } from 'socket.io';
import { v7 as uuid } from 'uuid';
import { GameBoard, Players, RoomStatus } from '../types/types';
import { initialBoard } from '../utils/GameUtils';

interface Online {
  socket_id: string;
}

interface GameRoom {
  status: RoomStatus;
  room_id: string;
  players: Players;
  board: GameBoard;
  turn: number;
}

class GameServices {
  private onlineUsers: Online[] = [];
  private gameRooms: GameRoom[] = [];


  online = (socket: Socket) => {
    const sid = socket.id
    this.removeUser(sid);
    this.onlineUsers.push({ socket_id: sid });
    console.log('Online: ', this.onlineUsers)
  };

  offline = (socket: Socket): string[] => {
    const sid = socket.id;
    // Remove user in online List
    this.removeUser(sid);
    const rooms =  this.removeRoomBySID(sid);

    console.log('Offline: ', this.onlineUsers)
    // return the room id for notify room player if user gaming
    return rooms;
  };

  findAvailableRoom = () => {
    return this.gameRooms.find((room) => room.status === RoomStatus.matching);
  }

  joinRoom = (socket: Socket, room: GameRoom, player: string) => {
    const whoFirst = Math.random() > 0.5;
    const p1 = whoFirst ? socket.id : player;
    const p2 = whoFirst ? player : socket.id;

    room.status = RoomStatus.gaming;
    room.players = [p1, p2];
    room.board = initialBoard(3);
    room.turn = 0;

    console.log('Join Room: ', this.gameRooms)
  }

  createRoom = (socket: Socket) => {
    const rid = uuid();          
    const newRoom: GameRoom = {
      status: RoomStatus.matching,
      room_id: rid,
      players: [socket.id],
      board: [],
      turn: 0,
    } 
    this.gameRooms.push(newRoom);

    console.log('Create Room: ', this.gameRooms)
    return rid;
  }

  findRoomBySID = (sid: string) => {
    return this.gameRooms.find((room) => room.players.includes(sid));
  }

  findRoomByRID = (rid: string) => {
    return this.gameRooms.find((room) => room.room_id === rid);
  }

  removeUser = (sid: string) => {
    for (let i = this.onlineUsers.length - 1; i >= 0; i--) {
      if (this.onlineUsers[i].socket_id === sid) {
        this.onlineUsers.splice(i, 1);
      }
    }
  }

  removeRoomBySID = (sid: string): string[] => {
    let rooms = [];
    for (let i = this.gameRooms.length - 1; i >= 0; i--) {
      const room = this.gameRooms[i];

      if (room.players.includes(sid)) {
        rooms.push(room.room_id);
        this.gameRooms.splice(i, 1);
      }
    }
    return rooms;
  }

  removeRoomByRID = (rid: string) => {
    for (let i = this.gameRooms.length - 1; i >= 0; i--) {
      const room = this.gameRooms[i];

      if (room.room_id === rid) {
        this.gameRooms.splice(i, 1);
      }
    }
  }
}

export default new GameServices();
