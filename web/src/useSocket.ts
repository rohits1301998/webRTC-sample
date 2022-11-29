import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { WEBRTC_SOCKET_EVENTS } from "./events";

export const useSocket = () => {
  const [socketId, setSocketId] = useState("");  
  const socketRef = useRef<Socket>();

  useEffect(() => {
    socketRef.current = io("ws://localhost:7000", {
        reconnectionAttempts: 3,
        transports: ["websocket"]
    });
    socketRef.current.once("connect", () => {
        setSocketId(socketRef.current!.id);
    });
  }, []);

  const emit = useCallback(<T>(event: WEBRTC_SOCKET_EVENTS, data: T) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  }, []);

  const on = useCallback((event: WEBRTC_SOCKET_EVENTS, callback: (...args: any[]) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  }, []);

  return {
    emit,
    on,
    socketId
  };
};
