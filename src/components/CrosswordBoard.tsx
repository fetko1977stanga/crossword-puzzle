import React, { useEffect } from 'react';
import { useCrosswordDispatch, useCrosswordState } from '../context';
import { addWordsToBoard } from '../functions';
import { IAction, IState } from '../interfaces';
import './CrosswordBoard.scss';
import CrosswordBoardCell from './CrosswordBoardCell';

const CrosswordBoard = () => {
  const dispatch:React.Dispatch<IAction> = useCrosswordDispatch();
  const { wordsCollection, crosswordBoard, addedWords, rotatedWords, direction, startX, startY }:IState = useCrosswordState();

  const renderCrosswordBoardCell = ():JSX.Element[] => {
    const rows:JSX.Element[] = crosswordBoard.map((row, index) => {
      return <div className="crossword-board__row" key={index}>
        { row.map((cellValue, index) => <CrosswordBoardCell key={index} value={cellValue} />) }
      </div>
    });

    return rows;
  }

  useEffect(() => {
    let index:number = addedWords.length;
    addWordsToBoard(wordsCollection, crosswordBoard, index, startX, startY, direction, dispatch, addedWords, rotatedWords);
}, [wordsCollection, addedWords, rotatedWords, crosswordBoard, dispatch, startX, startY, direction ]);

  return (
    <div className="crossword-board">
        {
            renderCrosswordBoardCell()
        }
    </div>
  )
}

export default CrosswordBoard;
