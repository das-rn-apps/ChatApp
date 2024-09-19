export type Theme = {
    backgroundColor: string;
    textColor: string;
    headerColor: string;
    inputBackgroundColor: string;
    userMessageColor: string;
    otherMessageColor: string;
    sendButtonColor: string;
    userMessageTextColor: string;
    otherMessageTextColor: string;
    borderColor: string;
    headerTextColor: string;
    headerBackButtonColor: string;
    headerBackButtonIconColor: string;
    textSecondaryColor: string;
};

export const lightTheme: Theme = {
    backgroundColor: '#ECE5DD',
    textColor: '#000000',
    headerColor: '#075E54',
    inputBackgroundColor: '#F0F0F0',
    userMessageColor: '#DCF8C6',
    otherMessageColor: '#FFFFFF',
    sendButtonColor: '#075E54',
    userMessageTextColor: '#000000',
    otherMessageTextColor: '#000000',
    borderColor: '#075E54',
    headerTextColor: '#FFFFFF',
    headerBackButtonColor: '#FFFFFF',
    headerBackButtonIconColor: '#FFFFFF',
    textSecondaryColor: '#8696A0',
};

export const darkTheme: Theme = {
    backgroundColor: '#121B22',
    textColor: '#FFFFFF',
    headerColor: '#1F2C34',
    inputBackgroundColor: '#2A3942',
    userMessageColor: '#005C4B',
    otherMessageColor: '#202C33',
    sendButtonColor: '#00A884',
    userMessageTextColor: '#FFFFFF',
    otherMessageTextColor: '#FFFFFF',
    borderColor: '#075E54',
    headerTextColor: '#FFFFFF',
    headerBackButtonColor: '#FFFFFF',
    headerBackButtonIconColor: '#FFFFFF',
    textSecondaryColor: '#8696A0',
};