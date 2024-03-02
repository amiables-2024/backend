import {Server} from "socket.io";

let io: Server = null;

export const initSocketIOServer = (initIo: Server) => {
    io = initIo;
}

export const getIo = () => {
    return io;
}