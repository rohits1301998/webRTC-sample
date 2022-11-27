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

const leaveChannel = ({ data: peerId, event, socket }: ISocketEvent<string>) => {
    socket.broadcast.emit(WEBRTC_EVENTS.PEER_REMOVED, peerId);
    socket.leave(peerId);
}


export const peersController =  {
    joinChannel,
    leaveChannel,
    exchangeSdp
}