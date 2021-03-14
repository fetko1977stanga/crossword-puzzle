import './CrosswordBoard.scss';

const CrosswordBoardCell = ({ value, index } : any) => {
  const classValue:string = value === null ? 'crossword-board__cell' : 'crossword-board__cell crossword-board__cell--with-value';
  return (
    <div className={classValue}>
        { value }
    </div>
  )
}

export default CrosswordBoardCell;
