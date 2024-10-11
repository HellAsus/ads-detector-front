export interface AudioResponse {
    transcript: string | null;
}

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