import './CrosswordBoard.scss';

const CrosswordBoardCell = ({ value, index } : any) => {
  
  return (
    <div className="crossword-board__cell" style={{ content: index }}>
        { value }
    </div>
  )
}

export default CrosswordBoardCell;
