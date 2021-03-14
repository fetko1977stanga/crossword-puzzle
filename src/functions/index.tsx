import { AddedWordInfo, CrossboardPosition, IAction, WordsIndexes } from "../interfaces";

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
    if (startX - 1 >= 0 && crosswordBoard[startY][startX - 1] !== null) {
        return false;
    }

    if (startX + wordLength < crosswordBoard.length && crosswordBoard[startY][startX + wordLength] !== null) {
        return false;
    }

    for (let index = 0; index < wordLength; index++) {
        if (startX + index < crosswordBoard[startY].length) {
            if (((crosswordBoard[startY][startX + index] === null) && (startY - 1 > 0 &&
                 crosswordBoard[startY - 1][startX + index] === null) && 
                 (startY + 1 < crosswordBoard.length - 1 && crosswordBoard[startY + 1][startX + index] === null))  || 
                crosswordBoard[startY][startX + index] === word[index]) {
                // TODO: log character can be added
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

    if (startY - 1 >= 0 && crosswordBoard[startY - 1][startX] !== null) {
        return false;
    }

    if (startY + wordLength  < crosswordBoard.length && crosswordBoard[startY + wordLength][startX] !== null) {
        return false;
    }

    for (let index = 0; index < wordLength; index++) {
        if (startY + index < crosswordBoard.length) {
            if (((crosswordBoard[startY + index][startX] === null) &&
                (startX - 1 > 0 && crosswordBoard[startY + index][startX - 1] === null) && 
                (startX + 1 < crosswordBoard.length - 1 && crosswordBoard[startY + index][startX + 1] === null)) || 
                crosswordBoard[startY + index][startX] === word[index]) {
                // TODO: log character can be added
            } else {
                return false;
            }
        } else {
            return false;
        }
        
        
    }
    return true;
}

export const isWordCanBeAdded = (word: string, crosswordBoard: string[][], direction: string, startX: number, startY: number, addedWords: AddedWordInfo[]): boolean => {
    addedWords.forEach(addedWord => {
        if (word === addedWord.word) {
            return false;
        }
    });

    if (direction === 'down') {
        return checkVertical(word, crosswordBoard, startX, startY);   
    }

    return checkHorisontal(word, crosswordBoard, startX, startY);
}

export const findInterceptions = (word: string, newWord: string): WordsIndexes[] => {
    let indexes: WordsIndexes[] = [];
    let indexesMap = new Map<string, string>();

    for (let wordIndex = 0; wordIndex < word.length; wordIndex++) {
        const wordCharacter = word[wordIndex];
        for (let newWordIndex = 0; newWordIndex < newWord.length; newWordIndex++) {
            const newWordCharacter = newWord[newWordIndex];

            if (wordCharacter === newWordCharacter) {
                let mapKey = `${wordIndex}${newWordIndex}`;
                if (indexesMap.get(mapKey) === undefined) {
                    indexesMap.set(mapKey, wordCharacter);
                    indexes.push({ wordIndex, newWordIndex});
                }
            }
            
        }
    }

    return indexes;
}

export const sortWordsCollectionByWordsInterceptions = (wordsCollection: string[]): string[] => {
    let minIterceptions = Number.MAX_SAFE_INTEGER;

    for (let outerIndex = 0; outerIndex < wordsCollection.length; outerIndex++) {
        const outerWord = wordsCollection[outerIndex];
        let intercepting = false;
        for (let innerIndex = 0; innerIndex < wordsCollection.length; innerIndex++) {
            const innerWord = wordsCollection[innerIndex];

            if (outerIndex === innerIndex) {
                continue;
            }

            let interceptions:WordsIndexes[] = findInterceptions(outerWord, innerWord)
            
            if (innerIndex === wordsCollection.length - 1 && intercepting === false) {
                if (interceptions.length < minIterceptions) {
                    minIterceptions = interceptions.length;
                    wordsCollection.splice(wordsCollection.indexOf(innerWord), 1);
                    wordsCollection.splice(wordsCollection.indexOf(outerWord), 1);
                    wordsCollection = [outerWord, innerWord, ...wordsCollection];
                }
            }
        }
        
    }

    return wordsCollection;

}

export const isWordCollectionValid = (wordCollection: string[]) => {
    for (let outerIndex = 0; outerIndex < wordCollection.length; outerIndex++) {
        const outerWord = wordCollection[outerIndex];
        let intercepting = false;
        for (let innerIndex = 0; innerIndex < wordCollection.length; innerIndex++) {
            const innerWord = wordCollection[innerIndex];

            if (outerIndex === innerIndex) {
                if (innerIndex === wordCollection.length - 1 && intercepting === false) {
                    return false;
                } else {
                    continue;
                }
            }

            if (outerWord.length < 3 || innerWord.length < 3) {
                return false;
            }



            let interception:WordsIndexes[] = findInterceptions(outerWord, innerWord)
            
            if (interception.length > 0) {
                break;
            }

            if (innerIndex === wordCollection.length - 1 && intercepting === false) {
                return false;
            }
        }
        
    }

    return true;
}

export const removeWordFromBoard = (word: string, crosswordBoard: string[][], startX: number, startY: number, direction: string, dispatch: any) => {
    let wordLength = word.length;
    let charIndex = 0;
    
    while (charIndex < wordLength) {
        if (direction === 'down') {
            if (crosswordBoard[startY][startX - 1] === null && crosswordBoard[startY][startX + 1] === null) {
                dispatch({ type: 'UPDATE_CROSSWORD_CELL', payload: { character: null, startX, startY }});
            }
            startY++;
            charIndex++;
        } else {
            if (crosswordBoard[startY - 1][startX] === null && crosswordBoard[startY + 1][startX] === null) {
                dispatch({ type: 'UPDATE_CROSSWORD_CELL', payload: { character: null, startX, startY }});
            }
            startX++;
            charIndex++;
        }

    }
};

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

const getNewCordinates = (startX: number, startY: number, wordIndex: number, newWordIndex: number, direction: string, boardLength: number) : CrossboardPosition => {
    if (direction === 'right') {
        startX = startX - newWordIndex < 0 ? startX : startX - newWordIndex;
        startY = startY + wordIndex > boardLength - 1 ? startY : startY + wordIndex;
    } else {
        startX = startX + wordIndex > boardLength - 1 ? startX : startX + wordIndex;
        startY = startY - newWordIndex < 0 ? startY : startY - newWordIndex;
    }

    return { xPosition: startX, yPosition: startY };
}

export const addWordsToBoard = (wordsCollection: string[], crosswordBoard: string[][], index: number, startX: number, startY: number, direction: string, dispatch: React.Dispatch<IAction>, addedWords: AddedWordInfo[], rotatedWords: AddedWordInfo[]) => {
    if (index < wordsCollection.length) {
        const currentWord = wordsCollection[index];
        let wordInfo: AddedWordInfo = { word: currentWord, startX, startY, direction};
        let currentWordAdded = false;

        if (index === 0) {
            addWordToBoard(currentWord, crosswordBoard, startX, startY, direction, dispatch);
            dispatch({ type: 'ADDED_WORD', payload: wordInfo});
            // console.log(`Added word - ${currentWord} - startX: ${startX}, startY: ${startY}, direction: ${direction}`);
            dispatch({ type: 'UPDATE_STARTING_POINTS', payload: { startX, startY }});
            direction = direction === 'down' ? 'right' : 'down';
            dispatch({ type: 'UPDATE_DIRECTION', payload: { direction }});
            currentWordAdded = true;
        } else {
            for(let index = addedWords.length - 1; index >= 0; index--) {
                let { word, startX, startY, direction: wordDirection } = addedWords[index];
                
                let interceptionsIndexes: WordsIndexes[] = findInterceptions(word, currentWord);

                if (interceptionsIndexes.length === 0) {
                    continue;
                }

                if (wordDirection === direction) {
                    direction = direction === 'down' ? 'right' : 'down';
                }

                let interceptionCollectionIndex:number = 0;

                while (interceptionCollectionIndex < interceptionsIndexes.length) {
                    const {wordIndex, newWordIndex }: any = interceptionsIndexes[interceptionCollectionIndex];
                    let {xPosition, yPosition} = getNewCordinates(startX, startY, wordIndex, newWordIndex, direction, crosswordBoard.length);

                    if (isWordCanBeAdded(currentWord, crosswordBoard, direction, xPosition, yPosition, addedWords)) {
                        addWordToBoard(currentWord, crosswordBoard, xPosition, yPosition, direction, dispatch);
                        wordInfo = { word: currentWord, startX: xPosition, startY: yPosition, direction};
                        dispatch({ type: 'ADDED_WORD', payload: wordInfo});
                        // console.log(`Added word - ${currentWord} - startX: ${xPosition}, startY: ${yPosition}, direction: ${direction}`);
                        dispatch({ type: 'UPDATE_STARTING_POINTS', payload: { startX: xPosition, startY: yPosition }});
                        direction = direction === 'down' ? 'right' : 'down';
                        dispatch({ type: 'UPDATE_DIRECTION', payload: { direction }});
                        currentWordAdded = true;
                        return;
                    } else {
                        interceptionCollectionIndex++;
                    }
                }
            }

            if (!currentWordAdded) {
                //TODO: If word is not added we move it in the back of the collection and start again
                if (rotatedWords.length < wordsCollection.length - addedWords.length) {
                    // console.log(`Word ${currentWord} was not aadded`);
                    const wordsCollectionCopy = [...wordsCollection];
                    const removedWord: string[]= wordsCollectionCopy.splice(index, 1);
                    const newWordsCollection:string[] = [...wordsCollectionCopy, removedWord[0]];
                    dispatch({ type: 'UPDATE_ROTATED_WORDS_COLLECTION', payload: wordInfo });
                    dispatch({ type: 'UPDATE_WORDS_COLLECTION', payload: newWordsCollection });
                    return;
                } else {
                    if (addedWords.length < wordsCollection.length - 1) {
                        let { word, startX, startY, direction } = addedWords[addedWords.length - 1];
                        removeWordFromBoard(word, crosswordBoard, startX, startY, direction, dispatch);
                        const wordsCollectionCopy = [...wordsCollection];
                        wordsCollectionCopy.splice(wordsCollection.indexOf(word), 1);
                        const newWordsCollection:string[] = [...wordsCollectionCopy, word];
                        dispatch({ type: 'RESET_ROTATED_WORDS_COLLECTION'});
                        dispatch({ type: 'UPDATE_WORDS_COLLECTION', payload: newWordsCollection });
                        return;
                    } else {
                        const sortedArray = wordsCollection.sort((a, b) => b.length - a.length);
                        dispatch({ type: 'RESET_BOARD'});
                        dispatch({ type: 'UPDATE_WORDS_COLLECTION', payload: sortedArray });
                        return; // console.log(`one word is left - ${currentWord} and index is ${index} and words collection is ${wordsCollection}`);
                    }
                }
            }
        }
    }
};