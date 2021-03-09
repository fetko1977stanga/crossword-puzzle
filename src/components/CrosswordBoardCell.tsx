import './CrosswordBoard.scss';

const CrosswordBoardCell = ({ value } : any) => {
  
  return (
    <div className="crossword-board__cell">
        { value }
    </div>
  )
}

export default CrosswordBoardCell;
