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
    text: string;
    sender: {
        _id: string;
        username: string;
        profilePicture: string;
    };
    createdAt: string;
};