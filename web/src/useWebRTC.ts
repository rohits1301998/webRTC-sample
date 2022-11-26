import { useCallback, useEffect, useRef } from "react";
import { WEBRTC_SOCKET_EVENTS } from "./events";
import { IConnectedPeer, IConnectionRequest, IPeer } from "./types/peer";
import { useSocket } from "./useSocket";

export const useWebRTC = () => {
  const { emit, on, socketId } = useSocket();
  const peers = useRef<Map<string, IConnectedPeer>>(new Map());

  const createPeerOffer = useCallback((peerId: string) => {
    return new Promise(async (resolve, reject) => {
      const newPeerConnection = new RTCPeerConnection();
      newPeerConnection.onicecandidate = (e) => {
        resolve(newPeerConnection.localDescription);
      };
      const dataChannel = newPeerConnection.createDataChannel("testChannel");
      dataChannel.onmessage = (e) => {
        console.log(e.data);
      };
      dataChannel.onopen = (e) => console.log("Opened");
      dataChannel.onclose = (e) => removePeer(peerId);
      const sdpOffer = await newPeerConnection.createOffer();
      await newPeerConnection.setLocalDescription(sdpOffer);
      peers.current.set(peerId, {
        connection: newPeerConnection,
        dataChannel,
        id: peerId,
      });
    });
  }, []);

  const createPeerAnswer = useCallback(async (peerId: string, sdpOffer: string) => {
    return new Promise(async (resolve, reject) => {
      const newPeerConnection = new RTCPeerConnection();
      newPeerConnection.onicecandidate = (e) => {
        resolve(newPeerConnection.localDescription);
      };
      let dataChannel: RTCDataChannel;
      newPeerConnection.ondatachannel = (e) => {
        dataChannel = e.channel;
        dataChannel.onmessage = (e) => {
          console.log(e.data);
        };
        dataChannel.onopen = (e) => console.log("Opened");
        dataChannel.onclose = (e) => removePeer(peerId);
        peers.current.set(peerId, {
          connection: newPeerConnection,
          dataChannel,
          id: peerId,
        });
      };
      newPeerConnection.setRemoteDescription(JSON.parse(sdpOffer));
      const sdpAnswer = await newPeerConnection.createAnswer();
      await newPeerConnection.setLocalDescription(sdpAnswer);
    });
  }, []);

  const openPeerConnection = useCallback((peerId: string, sdpAnswer: string) => {
    if (peers.current.has(peerId)) {
      peers.current.get(peerId)?.connection.setRemoteDescription(JSON.parse(sdpAnswer));
    }
  }, []);

  const removePeer = useCallback((peerId: string) => {
    peers.current.delete(peerId);
  }, []);

  const sendMessage = useCallback((message: string) => {
    for (const peer of Array.from(peers.current.values())) {
      peer.dataChannel.send(message);
    }
  }, []);

  useEffect(() => {
    if (socketId) {
      emit(WEBRTC_SOCKET_EVENTS.JOIN, {
        id: socketId,
      });

      on(WEBRTC_SOCKET_EVENTS.PEER_ADDED, async (peer: IPeer) => {
        const sdpOffer = await createPeerOffer(peer.id);
        emit<IConnectionRequest>(WEBRTC_SOCKET_EVENTS.PEER_OFFER, {
          from: socketId,
          to: peer.id,
          sdp: JSON.stringify(sdpOffer),
        });
      });

      on(WEBRTC_SOCKET_EVENTS.PEER_ANSWER, (peerConnection: IConnectionRequest) => {
        openPeerConnection(peerConnection.from, peerConnection.sdp);
      });

      on(WEBRTC_SOCKET_EVENTS.PEER_OFFER, async ({ from, sdp, to }: IConnectionRequest) => {
        const sdpAnswer = await createPeerAnswer(from, sdp);
        emit<IConnectionRequest>(WEBRTC_SOCKET_EVENTS.PEER_ANSWER, {
          from: to,
          to: from,
          sdp: JSON.stringify(sdpAnswer),
        });
      });
    }
  }, [socketId]);

  return {
    sendMessage,
  };
};
