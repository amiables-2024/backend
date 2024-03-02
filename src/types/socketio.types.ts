export type JoinRoomData = {
    projectId: string;
}

export type UserSendMessageData = {
    user: {
        id: string;
        name: string;
    }
    content: string;
    projectId: string;
}

export type BroadcastMessageData = {
    id: string;
    content: string;
    createdAt: Date;

    user: {
        id: string;
        name: string;
    }
}