export interface IPeer {
    id: string;
}

export interface IConnectionRequest {
    from: string;
    to: string;
    sdp: string;
}