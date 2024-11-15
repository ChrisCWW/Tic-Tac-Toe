'use client';

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Socket } from "socket.io-client";
import { SocketIO } from '@/app/socket';
import { updateIsConnect } from "@/lib/store/features/IndexSlice";

export default function useSocket() {
    
    const dispatch = useDispatch();
    const [socket, setSocket] = useState<Socket>();

    useEffect(() => {
        const socketIO = SocketIO();
        setSocket(socketIO);

        function onConnect() {
            dispatch(updateIsConnect({ connect: true, uid: socketIO.id }));
        }
        function onDisconnect() {
            dispatch(updateIsConnect({ connect: false }));
        }

        socketIO.on('connect', onConnect);
        socketIO.on('disconnect', onDisconnect);

        return () => {
            socketIO.off('connect', onConnect);
            socketIO.off('disconnect', onDisconnect);
        }
    }, []);

    return socket;
}