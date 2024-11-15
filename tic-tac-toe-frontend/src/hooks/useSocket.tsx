'use client';

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Socket } from "socket.io-client";
import { SocketIO } from '@/app/socket';
import { updateIsConnect } from "@/lib/store/features/indexSlice";

export default function useSocket() {
    console.log("Socket");
    
    const dispatch = useDispatch();
    const socket = useRef<Socket>();

    useEffect(() => {
        const socketIO = SocketIO();
        socket.current = socketIO;

        function onConnect() {
            dispatch(updateIsConnect(true));
        }
        function onDisconnect() {
            dispatch(updateIsConnect(false));
        }

        socketIO.on('connect', onConnect);
        socketIO.on('disconnect', onDisconnect);

        return () => {
            socketIO.off('connect', onConnect);
            socketIO.off('disconnect', onDisconnect);
        }
    }, []);

    return socket.current;
}