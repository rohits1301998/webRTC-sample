import { Socket } from "socket.io";


export interface ISocketEvent<T = any> {
  socket: Socket;
  event: string;
  data: T;
}
