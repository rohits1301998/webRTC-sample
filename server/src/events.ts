import { peersController } from "./controllers/peers";
import { ISocketEvent } from "./types/socket";

export const WEBRTC_EVENTS = {
  PEER_ADDED: "peer_added",
  PEER_REMOVED: "peer_removed",
  PEER_OFFER: "peer_offer",
  PEER_ANSWER: "peer_answer",
  JOIN: "join",
  LEAVE: "leave",
  JOINED: "joined",
  DISCONNECT: "disconnect",
} as const;

export const WEBRTC_EVENT_HANDLERS: Readonly<
  Partial<Record<string, (socketEvent: ISocketEvent) => void>>
> = {
  [WEBRTC_EVENTS.JOIN]: peersController.joinChannel,
  [WEBRTC_EVENTS.PEER_OFFER]: peersController.exchangeSdp,
  [WEBRTC_EVENTS.PEER_ANSWER]: peersController.exchangeSdp,
  [WEBRTC_EVENTS.LEAVE]: peersController.leaveChannel,
  [WEBRTC_EVENTS.DISCONNECT]: ({ data, socket, event }: ISocketEvent) => {
    peersController.leaveChannel({
      data: socket.id,
      socket,
      event,
    });
  },
};
