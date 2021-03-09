import { AddedWordInfo, IAction, WordsIndexes } from "../interfaces";

export const splitWords = (input: string): string[] => {
    const re = /\s*(?:,|$)\s*/
    const words: string[] = input.split(re);
    return words;
}

export const isInputValid = (input: string): boolean => {
    const words: string[] = splitWords(input);
    return words.length < 2 || words.includes('') ? false : true;
}

export const checkHorisontal = (word: string, crosswordBoard: string[][], startX: number, startY: number): any => {
    let wordLength = word.length;
    for (let index = 0; index < wordLength; index++) {
        if (startX + index < crosswordBoard[startY].length) {
            if (crosswordBoard[startY][startX + index] === null || 
                crosswordBoard[startY][startX + index] === word[index]) {
                crosswordBoard[startY][startX + index] = word[index];
            } else {
                return false;
            }
        } else {
            return false;
        }
        
    }
    return true;
}

export const checkVertical = (word: string, crosswordBoard: string[][], startX: number, startY: number): boolean => {
    let wordLength = word.length;
    for (let index = 0; index < wordLength; index++) {
        if (startY + index < crosswordBoard.length) {
            if (crosswordBoard[startY + index][startX] === null || 
                crosswordBoard[startY + index][startX] === word[index]) {
                crosswordBoard[startY + index][startX] = word[index];
            } else {
                return false;
            }
        } else {
            return false;
        }
        
        
    }
    return true;
}

export const isWordCanBeAdded = (word: string, crosswordBoard: string[][], direction: string, startX: number, startY: number): boolean => {
    let wordLength = word.length;
    let charIndex = 0;
    //console.log('isWordCanBeAdded is called with', crosswordBoard);
    if (direction === 'down') {
        while (charIndex < wordLength) {
            if (startY < crosswordBoard.length) {
                if (crosswordBoard[startY][startX] !== null && crosswordBoard[startY][startX] !== word[charIndex]) {
                    return false;
                }
                charIndex++;
                startY++;
            } else {
                return false;
            }
        }
    } else {
        while (charIndex < wordLength) {
            if (startY < crosswordBoard.length && startX < crosswordBoard[startY].length) {
                if (crosswordBoard[startY][startX] !== null && crosswordBoard[startY][startX] !== word[charIndex]) {
                    return false;
                }
                charIndex++;
                startX++;
            } else {
                return false;
            }
            
        }
    }

    return true;
}

export const findFirstInterception = (word: string, newWord: string): WordsIndexes | number => {
    let index = -1;

    for (let charIndex = 0; charIndex < newWord.length; charIndex++) {
        const character = newWord[charIndex];
        if (word.includes(character)) {
            //console.log(`word - ${word} - ${word.indexOf(character)}`, `currentWord - ${newWord} - ${newWord.indexOf(character)}`);
            return { wordIndex: word.indexOf(character), newWordIndex: newWord.indexOf(character)};
        }
        
    }

    return index;
}

export const isWordCollectionValid = (wordCollection: string[]) => {
    for (let outerIndex = 0; outerIndex < wordCollection.length; outerIndex++) {
        const outerWord = wordCollection[outerIndex];
        let intercepting = false;
        for (let innerIndex = 0; innerIndex < wordCollection.length; innerIndex++) {
            const innerWord = wordCollection[innerIndex];

            if (outerIndex === innerIndex) {
                continue;
            }

            if (findFirstInterception(outerWord, innerWord) !== -1) {
                break;
            }

            if (innerIndex === wordCollection.length - 1 && intercepting === false) {
                return false;
            }
        }
        
    }

    return true;
}

export const addWordToBoard = (word: string, crosswordBoard: string[][], startX: number, startY: number, direction: string, dispatch: any) => {
    let wordLength = word.length;
    let charIndex = 0;

    while (charIndex < wordLength) {
        if (crosswordBoard[startY][startX] === null) {
            dispatch({ type: 'UPDATE_CROSSWORD_CELL', payload: { character: word[charIndex], startX, startY }});
        }
        charIndex++;
        direction === 'down' ? startY++ : startX++;

    }
  };

  export const addWordsToBoard = (wordsCollection: string[], crosswordBoard: string[][], index: number, startX: number, startY: number, direction: string, dispatch: React.Dispatch<IAction>) => {
    if (index < wordsCollection.length) {
        const currentWord = wordsCollection[index];
        let wordInfo: AddedWordInfo = { word: currentWord, startX, startY};
        
        if (direction === 'down') {
            if (isWordCanBeAdded(currentWord, crosswordBoard, direction, startX, startY)) {
                addWordToBoard(currentWord, crosswordBoard, startX, startY, direction, dispatch);
                dispatch({ type: 'ADDED_WORD', payload: wordInfo});

                if (index < wordsCollection.length - 1) {
                    let indexes: WordsIndexes | number = findFirstInterception(currentWord, wordsCollection[index + 1]);
                    if (indexes === -1) {
                        return;
                    }
                    const {wordIndex, newWordIndex }: any = indexes;
                    console.log(`Added word is ${currentWord} at X - ${startX} and at Y - ${startY}`);
                    startX -= newWordIndex;
                    startY += wordIndex;
                    dispatch({ type: 'UPDATE_STARTING_POINTS', payload: { startX, startY }});
                    
                    console.log(`New word to be added is ${wordsCollection[index + 1]} at X - ${startX} and at Y - ${startY}`);
                    dispatch({ type: 'UPDATE_DIRECTION', payload: { direction: 'right' }});
                }
            } else {
                return console.log('Cannot be added');
            }
        } else {
            if (isWordCanBeAdded(currentWord, crosswordBoard, direction, startX, startY)) {
                addWordToBoard(currentWord, crosswordBoard, startX, startY, direction, dispatch);
                dispatch({ type: 'ADDED_WORD', payload: wordInfo});
                if (index < wordsCollection.length - 1) {
                    let indexes: WordsIndexes | number = findFirstInterception(currentWord, wordsCollection[index + 1]);
                        if (indexes === -1) {
                            return;
                        }
                    const {wordIndex, newWordIndex }: any = indexes;
                    console.log(`Added word is ${currentWord} at X - ${startX} and at Y - ${startY}`);
                    startX += wordIndex;
                    startY -= newWordIndex;

                    dispatch({ type: 'UPDATE_STARTING_POINTS', payload: { startX, startY }});
                    console.log(`New word to be added is ${wordsCollection[index + 1]} at X - ${startX} and at Y - ${startY}`);
                    dispatch({ type: 'UPDATE_DIRECTION', payload: { direction: 'down' }});
                }
            } else {
                console.log('Cannot be added');
            }
          
        }
        

    }
};