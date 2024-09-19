export type ChatItem = {
    _id: string;
    isGroup: boolean;
    messages: [];
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
    sender: {
        _id: string;
        username: string;
        profilePicture: string;
    };
    receiver: {
        _id: string;
        username: string;
        profilePicture: string;
    };
    senderName: string;
    receiverName?: string;
    text: string;
    createdAt: string;
};