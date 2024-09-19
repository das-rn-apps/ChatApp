export type ChatItem = {
    _id: string;
    name: string;
    isGroup: boolean;
    lastMessage?: {
        text: string;
        createdAt: string;
    };
    participants: {
        _id: string;
        username: string;
        profilePicture: string;
    }[];
};

export type Message = {
    _id: string;
    sender: string;
    receiver: string;
    senderName: string;
    receiverName?: string;
    text: string;
    createdAt: string;
};