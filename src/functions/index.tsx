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

export const isWordCanBeAdded = (word: string, crosswordBoard: string[][], direction: string, startX: number, startY: number, addedWords: AddedWordInfo[]): boolean => {
    let wordLength = word.length;
    let charIndex = 0;
    addedWords.forEach(addedWord => {
        if (word === addedWord.word) {
            return false;
        }
    });

    if (direction === 'down') {
        if (startY - 1 < 0) {
            return false;
        }

        if(crosswordBoard[startY - 1][startX] !== null) {
            return false;
        }

        if (startY + wordLength > crosswordBoard.length - 1) {
            return false;
        }

        if (startY + wordLength + 1 > crosswordBoard.length - 1) {
            return false;
        }

        if ([startY + wordLength + 1][startX] !== null) {
            return false;
        }

        while (charIndex < wordLength) {
            if (startY < crosswordBoard.length) {
                if (crosswordBoard[startY][startX] !== null && crosswordBoard[startY][startX] !== word[charIndex]) {
                    return false;
                }

                if (startX - 1 < 0) {
                    return false;
                }

                if (startX + 1 >= crosswordBoard.length) {
                    return false;
                }

                if (crosswordBoard[startY][startX] === null && (crosswordBoard[startY][startX - 1] !== null || crosswordBoard[startY][startX + 1] !== null)) {
                    return false;
                }

                charIndex++;
                startY++;
            } else {
                return false;
            }
        }
    } else {
        if (startX - 1 < 0) {
            return false;
        }

        if (crosswordBoard[startY][startX - 1] !== null) {
            return false;
        }

        if (startX + wordLength > crosswordBoard.length - 1) {
            return false;
        }

        if (startX + wordLength + 1 > crosswordBoard.length - 1) {
            return false;
        }

        if (crosswordBoard[startY][startX + wordLength + 1] !== null) {
            return false;
        }

        while (charIndex < wordLength) {
            if (startY < crosswordBoard.length && startX < crosswordBoard[startY].length) {
                if (crosswordBoard[startY][startX] !== null && crosswordBoard[startY][startX] !== word[charIndex]) {
                    return false;
                }

                if (startY - 1 < 0) {
                    return false;
                }

                if (startY + 1 >= crosswordBoard.length) {
                    return false;
                }

                if (crosswordBoard[startY][startX] === null && (crosswordBoard[startY - 1][startX] !== null || crosswordBoard[startY + 1][startX] !== null)) {
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

export const findInterceptions = (word: string, newWord: string): WordsIndexes[] => {
    let indexes: WordsIndexes[] = [];

    for (let charIndex = 0; charIndex < newWord.length; charIndex++) {
        const character = newWord[charIndex];
        if (word.includes(character)) {
            //console.log(`word - ${word} - ${word.indexOf(character)}`, `currentWord - ${newWord} - ${newWord.indexOf(character)}`);
            indexes.push({ wordIndex: word.indexOf(character), newWordIndex: newWord.indexOf(character)});
        }
        
    }

    return indexes;
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

  const getNewCordinates = (startX: number, startY: number, wordIndex: number, newWordIndex: number, direction: string) : CrossboardPosition => {
        if (direction === 'right') {
            startX -= newWordIndex;
            startY += wordIndex;
        } else {
            startX += wordIndex;
            startY -= newWordIndex;
        }

        return { xPosition: startX, yPosition: startY };
  }

  export const addWordsToBoard = (wordsCollection: string[], crosswordBoard: string[][], index: number, startX: number, startY: number, direction: string, dispatch: React.Dispatch<IAction>, addedWords: AddedWordInfo[]) => {
    // if (index < wordsCollection.length) {
        
    // }
    const currentWord = wordsCollection[index];
    let wordInfo: AddedWordInfo = { word: currentWord, startX, startY, direction};
    let currentWordAdded = false;

    if (index === 0) {
        addWordToBoard(currentWord, crosswordBoard, startX, startY, direction, dispatch);
        dispatch({ type: 'ADDED_WORD', payload: wordInfo});
        console.log(`Added word - ${currentWord} - startX: ${startX}, startY: ${startY}, direction: ${direction}`);
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
            //console.log(`Word - ${word} with Current Word ${currentWord} has following intersections - `);
            //interceptionsIndexes.forEach(interception => console.log(interception));
            while (interceptionCollectionIndex < interceptionsIndexes.length) {
                const {wordIndex, newWordIndex }: any = interceptionsIndexes[interceptionCollectionIndex];
                let {xPosition, yPosition} = getNewCordinates(startX, startY, wordIndex, newWordIndex, direction);

                if (isWordCanBeAdded(currentWord, crosswordBoard, direction, xPosition, yPosition, addedWords)) {
                    addWordToBoard(currentWord, crosswordBoard, xPosition, yPosition, direction, dispatch);
                    wordInfo = { word: currentWord, startX: xPosition, startY: yPosition, direction};
                    dispatch({ type: 'ADDED_WORD', payload: wordInfo});
                    console.log(`Added word - ${currentWord} - startX: ${xPosition}, startY: ${yPosition}, direction: ${direction}`);
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
            if (index < wordsCollection.length - 1) {
                console.log(`Word ${currentWord} was not aadded`);
                const wordsCollectionCopy = [...wordsCollection];
                const removedWord: string[]= wordsCollectionCopy.splice(index, 1);
                const newWordsCollection:string[] = [...wordsCollectionCopy, removedWord[0]];
            
                dispatch({ type: 'UPDATE_WORDS_COLLECTION', payload: newWordsCollection });
                return;
            } else {
                return console.log(`Word ${currentWord} can't be added on current board`);
            }
        }
    }
};