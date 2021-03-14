import React, { FormEvent, useState } from 'react';
import './Form.scss';
import { splitWords, isInputValid, isWordCollectionValid, sortWordsCollectionByWordsInterceptions } from '../functions';
import { useCrosswordDispatch, useCrosswordState } from '../context';
import { IAction, IState } from '../interfaces';

const Form = () => {
  const [ wordsValue, setWordsValue ] = useState('');
  const dispatch:React.Dispatch<IAction> = useCrosswordDispatch();
  const { errorMessage }:IState = useCrosswordState();

  const handleChange = (e: FormEvent<HTMLTextAreaElement>) => {
    const target: HTMLTextAreaElement = e.target as HTMLTextAreaElement;
    const value: string = target.value;

    setWordsValue(value);
  }

  const clearInput = () => {
      setWordsValue('');
      dispatch({ type: 'SET_ERROR_MESSAGE'});
  }

  const renderErrorMessage = ():JSX.Element | null => {
      if (errorMessage) {
        return <div className="alert alert-danger">{errorMessage}</div>;
      }

      return null;
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(isInputValid(wordsValue)) {
      
      const wordsCollection: string[] = splitWords(wordsValue).map(word => word.toUpperCase());

      // We check here if words collection length is less than 10 and if it is we set error
      if (wordsCollection.length < 10) {
          dispatch({ type: 'SET_ERROR_MESSAGE', payload: `The minimum words to build the crossword board is 10. You've added just ${wordsCollection.length}`})
          return;
      }

      if (isWordCollectionValid(wordsCollection)) {
          // Sort collection by words interceptions by ascending order
          const sortedArray = sortWordsCollectionByWordsInterceptions(wordsCollection);
    
          dispatch({ type: 'UPDATE_WORDS_COLLECTION', payload: sortedArray });
      } else {
        //TODO: implement error message to show if collection is not valid
         dispatch({ type: 'SET_ERROR_MESSAGE', payload: `Words collection is not valid, one or more words doesn't intercepting with the other words.`})
      }

     

      // Clear textarea input
      setWordsValue('');
    }
  }

  return (
    <div className="crossword-form-wrapper">
      { 
          renderErrorMessage()
      }
      <form className="crossword-form"  onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="wordsInput">Add your words</label>
            <textarea className="form-control" id="wordsInput"
                rows={3} onChange={handleChange}
                value={wordsValue} 
                onBlur={() => dispatch({ type: 'RESET_BOARD'})}
                onFocus={clearInput}
            ></textarea>
            <p className="crossword-form__legend">* Add at least 10 words separated by commas e.g ( word, other, new )</p>
          </div>
          <div className="form-group">
            <input type="submit" value="Add words" className="crossword-form__submit" disabled={wordsValue === ''} />
          </div>
      </form>
    </div>
  )
}

export default Form;
