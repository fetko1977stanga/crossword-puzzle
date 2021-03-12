import React, { useEffect } from 'react';
import { useCrosswordDispatch, useCrosswordState } from '../context';
import { addWordsToBoard } from '../functions';
import { IAction } from '../interfaces';
import './CrosswordBoard.scss';
import CrosswordBoardCell from './CrosswordBoardCell';

const CrosswordBoard = () => {
  const dispatch:React.Dispatch<IAction> = useCrosswordDispatch();
  const { wordsCollection, crosswordBoard, addedWords, rotatedWords, direction, startX, startY } = useCrosswordState();

  const renderCrosswordBoardCell = () => {
    const rows = crosswordBoard.map(row => {
      return row.map((cellValue, index) => <CrosswordBoardCell key={index} value={cellValue} />)
    });

    return rows;
  }

  useEffect(() => {
    let index = addedWords.length;
    addWordsToBoard(wordsCollection, crosswordBoard, index, startX, startY, direction, dispatch, addedWords, rotatedWords);
}, [wordsCollection, addedWords, rotatedWords, crosswordBoard, dispatch, startX, startY, direction ]);

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
