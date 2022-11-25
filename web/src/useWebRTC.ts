import { useEffect } from "react";
import { WEBRTC_SOCKET_EVENTS } from "./events";
import { IConnectionRequest, IPeer } from "./types/peer";
import { useSocket } from "./useSocket";

export const useWebRTC = () => {
  const { emit, on, socketId } = useSocket();

  useEffect(() => {
    if (socketId) {
      emit(WEBRTC_SOCKET_EVENTS.JOIN, {
        id: socketId,
      });

      on(WEBRTC_SOCKET_EVENTS.PEER_ADDED, (peer: IPeer) => {
        emit<IConnectionRequest>(WEBRTC_SOCKET_EVENTS.PEER_OFFER, {
          from: socketId,
          to: peer.id,
          sdp: "my sdp offer",
        });
        console.log({
          from: socketId,
          to: peer.id,
          sdp: "my sdp offer",
        });
      });

      on(WEBRTC_SOCKET_EVENTS.PEER_OFFER, (peerConnection: IConnectionRequest) => {
        emit<IConnectionRequest>(WEBRTC_SOCKET_EVENTS.PEER_ANSWER, {
          from: socketId,
          to: peerConnection.from,
          sdp: "my sdp answer",
        });
        console.log({
          from: socketId,
          to: peerConnection.from,
          sdp: "my sdp answer",
        });
      });
    }
  }, [socketId]);

  return {};
};
