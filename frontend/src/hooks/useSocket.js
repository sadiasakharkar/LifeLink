import { useEffect } from "react";
import { io } from "socket.io-client";
import { API_URL } from "../api/client.js";

export const useSocket = (events) => {
  useEffect(() => {
    const socket = io(API_URL, {
      transports: ["websocket"],
    });

    Object.entries(events).forEach(([eventName, handler]) => {
      socket.on(eventName, handler);
    });

    return () => {
      Object.entries(events).forEach(([eventName, handler]) => {
        socket.off(eventName, handler);
      });
      socket.disconnect();
    };
  }, [events]);
};
