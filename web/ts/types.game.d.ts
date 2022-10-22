export interface GameController {
    mode: "short" | "medium" | "long" | "thicc";
    baseChar: number;
    correctChar: number;
    incorrectChar: number;
    totalChar: number;
    tempQuote: string;
    tempChar: string[];
    time: number;
    timeInterval: number;
    start: boolean;
}

export interface ModeSelector {
    short: HTMLElement;
    medium: HTMLElement;
    long: HTMLElement;
    thicc: HTMLElement;
    selector: ("short" | "medium" | "long" | "thicc")[];
}

export type Mode = "short" | "medium" | "long" | "thicc";