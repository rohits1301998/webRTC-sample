export interface IPeer {
    id: string;
}

export interface IConnectedPeer extends IPeer {
    connection: RTCPeerConnection;
    dataChannel: RTCDataChannel;
}

export interface IConnectionRequest {
    from: string;
    to: string;
    sdp: string;
}

export interface IMessage {
    peerId: string;
    message: string;
    id: string;
}