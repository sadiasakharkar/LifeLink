let io;

export const registerSocketServer = (socketServer) => {
  io = socketServer;
};

export const emitEvent = (eventName, payload) => {
  if (!io) return;
  io.emit(eventName, payload);
};
