import { WEBRTC_EVENTS } from "../events";
import { IConnectionRequest, IPeer } from "../types/peers";
import { ISocketEvent } from "../types/socket";

const CONNECTED_PEERS = new Map<string, IPeer>();

const joinChannel = async ({ data: newPeer, event, socket }: ISocketEvent<IPeer>) => {
    socket.broadcast.emit(WEBRTC_EVENTS.PEER_ADDED, newPeer);
    CONNECTED_PEERS.set(newPeer.id, newPeer);
    socket.emit(WEBRTC_EVENTS.JOINED, CONNECTED_PEERS.size);
    socket.join(newPeer.id);
}

const exchangeSdp = async ({ data: connectionRequest, event, socket }: ISocketEvent<IConnectionRequest>) => {
    socket.to(connectionRequest.to).emit(event, connectionRequest);
}


export const peersController =  {
    joinChannel,
    exchangeSdp
}