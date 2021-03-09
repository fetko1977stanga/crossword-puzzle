import React, { useEffect } from 'react';
import { useCrosswordDispatch, useCrosswordState } from '../context';
import { addWordsToBoard } from '../functions';
import { IAction } from '../interfaces';
import './CrosswordBoard.scss';
import CrosswordBoardCell from './CrosswordBoardCell';

const CrosswordBoard = () => {
  const dispatch:React.Dispatch<IAction> = useCrosswordDispatch();
  const { wordsCollection, crosswordBoard, addedWords, direction, startX, startY } = useCrosswordState();

  // const addWordsToBoard = useCallback((index: number, startX: number, startY: number, direction: string) => {
  //     if (index < wordsCollection.length) {
  //         const currentWord = wordsCollection[index];
  //         let wordInfo: AddedWordInfo = { word: currentWord, startX, startY};
          
  //         if (direction === 'down') {
  //             if (isWordCanBeAdded(currentWord, crosswordBoard, direction, startX, startY)) {
  //                 addWordToBoard(currentWord, crosswordBoard, startX, startY, direction, dispatch);
  //                 dispatch({ type: 'ADDED_WORD', payload: wordInfo});

  //                 if (index < wordsCollection.length - 1) {
  //                     let indexes: WordsIndexes | number = findFirstInterception(currentWord, wordsCollection[index + 1]);
  //                     if (indexes === -1) {
  //                         return;
  //                     }
  //                     const {wordIndex, newWordIndex }: any = indexes;
  //                     console.log(`Added word is ${currentWord} at X - ${startX} and at Y - ${startY}`);

  //                     startX -= newWordIndex;
  //                     startY += wordIndex;
  //                     console.log(`New word to be added is ${wordsCollection[index + 1]} at X - ${startX} and at Y - ${startY}`);
  //                 }
  //                 addWordsToBoard(index + 1, startX, startY, 'right');
  //             } else {
  //                 return console.log('Cannot be added');
  //             }
  //         } else {
  //             if (isWordCanBeAdded(currentWord, crosswordBoard, direction, startX, startY)) {
  //                 addWordToBoard(currentWord, crosswordBoard, startX, startY, direction, dispatch);
  //                 dispatch({ type: 'ADDED_WORD', payload: wordInfo});
  //                 if (index < wordsCollection.length - 1) {
  //                     let indexes: WordsIndexes | number = findFirstInterception(currentWord, wordsCollection[index + 1]);
  //                         if (indexes === -1) {
  //                             return;
  //                         }
  //                     const {wordIndex, newWordIndex }: any = indexes;
  //                     console.log(`Added word is ${currentWord} at X - ${startX} and at Y - ${startY}`);
  //                     startX += wordIndex;
  //                     startY -= newWordIndex;
  //                     console.log(`New word to be added is ${wordsCollection[index + 1]} at X - ${startX} and at Y - ${startY}`);
  //                 }
                  
  //                 addWordsToBoard(index + 1, startX, startY, 'down');
  //             } else {
  //                 console.log('Cannot be added');
  //             }
            
  //         }
          

  //     }
  // }, [crosswordBoard, dispatch, wordsCollection]);

  const renderCrosswordBoardCell = () => {
    const rows = crosswordBoard.map(row => {
      return row.map((cellValue, index) => <CrosswordBoardCell key={index} value={cellValue} />)
    });

    return rows;
  }

  useEffect(() => {
    let index = addedWords.length;
    addWordsToBoard(wordsCollection, crosswordBoard, index, startX, startY, direction, dispatch);
}, [wordsCollection, addedWords, crosswordBoard, dispatch, startX, startY, direction ]);

  return (
    <div className="crossword-board">
        <div className="row">
          {
              renderCrosswordBoardCell()
          }
        </div>
    </div>
  )
}

export default CrosswordBoard;
