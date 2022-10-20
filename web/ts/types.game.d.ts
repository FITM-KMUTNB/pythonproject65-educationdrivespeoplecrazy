export interface GameController {
    mode: "short" | "medium" | "long" | "thicc",
    baseChar: number,
    correctChar: number,
    incorrectChar: number,
    totalChar: number,
    tempQuote: string,
    tempChar: string[],
    time: number,
    timeInterval: number,
    start: boolean
}

export type ModeSelectorList = ("short" | "medium" | "long" | "thicc")[];

export type eel = any