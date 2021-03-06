import './App.scss';
import { useCrosswordState } from './context';
import Form from './components/Form';
import React from 'react';
import CrosswordBoard from './components/CrosswordBoard';

const App = () => {
  const { wordsCollection } = useCrosswordState();
  return (
    <div className="crossword-app">
        <div className="container">
          <div className="row">
            <h1 className="crossword-app__title">Crossword App</h1>
          </div>
          <div className="row">
            <Form />
          </div>
          <div className="row">
          {
            wordsCollection.length > 0  ? (
              <CrosswordBoard />
            ) : null
          }
          </div>
        </div>
        
    </div>
  );
}

export default App;
