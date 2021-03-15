export interface IState {
    crosswordBoard: [][],
    wordsCollection: string[],
    addedWords: Array<AddedWordInfo>,
    rotatedWords: Array<AddedWordInfo>
    direction: string;
    startX: number;
    startY: number;
    errorMessage: string;
    collectionResorted: boolean;
}

export interface IAction {
    type: string;
    payload?: any
}

export interface CrossboardPosition {
    xPosition: number;
    yPosition: number;
}

export interface AddedWordInfo {
    word: string;
    startX: number;
    startY: number;
    direction: string;
}

export interface WordsIndexes {
    wordIndex: number;
    newWordIndex: number;
}