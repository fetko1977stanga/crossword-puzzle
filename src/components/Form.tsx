import React, { FormEvent, useState } from 'react';
import './Form.scss';
import { splitWords, isInputValid, isWordCollectionValid } from '../functions';
import { useCrosswordDispatch } from '../context';
import { IAction } from '../interfaces';

const Form = () => {
  const [ wordsValue, setWordsValue ] = useState('');
  const dispatch:React.Dispatch<IAction> = useCrosswordDispatch();

  const handleChange = (e: FormEvent<HTMLTextAreaElement>) => {
    const target: HTMLTextAreaElement = e.target as HTMLTextAreaElement;
    const value: string = target.value;

    setWordsValue(value);
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(isInputValid(wordsValue)) {
      // TODO: Split into words adn dispatch array to update state.
      // TestCase: hello, world, madrid, interesting, task, programming, korea
      const wordsCollection: string[] = splitWords(wordsValue);

      if (isWordCollectionValid(wordsCollection)) {
           // Sort collection by word length desc
          wordsCollection.sort((a, b) => b.length - a.length);
          console.log(wordsCollection);
    
          dispatch({ type: 'UPDATE_WORDS_COLLECTION', payload: wordsCollection });
      } else {
        //TODO: implement error message to show if collection is not valid
          console.log('Not valid collection');
      }

     

      // Clear textarea input
      setWordsValue('');
    }
  }

  return (
    <div className="crossword-form-wrapper">
      <form className="crossword-form"  onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="wordsInput">Add your words</label>
            <textarea className="form-control" id="wordsInput" rows={3} onChange={handleChange} value={wordsValue} onBlur={() => dispatch({ type: 'RESET_BOARD' })}></textarea>
            <p className="crossword-form__legend">* Add your words separated by commas e.g ( word, other, new )</p>
          </div>
          <div className="form-group">
            <input type="submit" value="Submit" />
          </div>
      </form>
    </div>
  )
}

export default Form;
