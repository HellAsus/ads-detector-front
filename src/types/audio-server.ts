export interface AudioResponse {
    transcript: string | null;
    botAnswer: string | null;
    transcriptTime: number;
    botTime: number;
    requestIndex: number
}

export interface Transcription {
    key: number;
    text: string
    botAnswer: string | null;
    transcriptTime: number;
    botTime: number;
};

export interface BotResponse {
    botAnswer: string;
}

export interface ThreadResponse {
    threadId: string;
}

export enum BotAnswers {
    ADS = 'adsStarted',
    BROADCAST = 'broadcast',
    CHECK = 'inspection',
}