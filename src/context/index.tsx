import React from 'react';
import { IState, IAction, CrossboardPosition } from '../interfaces';

const initialState: IState = {
    crosswordBoard: new Array(20).fill(new Array(20).fill(null)),
    wordsCollection: [],
    addedWords: [],
    direction: 'down',
    startX: 5, 
    startY: 5,
    lastAddedWordMap: new Map<string, CrossboardPosition>()
}

const defaultAction: React.Dispatch<IAction> = () => {};

const CrosswordStateContext = React.createContext<IState>(initialState);
const CrosswordDispatchContext = React.createContext<React.Dispatch<IAction>>(defaultAction)

function crosswordReducer(state: IState, action: IAction) {
    switch (action.type) {
        case 'RESET_BOARD':
            return initialState;
        case 'UPDATE_WORDS_COLLECTION':
            return { ...state, wordsCollection: [...action.payload]};
        case 'UPDATE_CROSSWORD_CELL':
            let crosswordBoard = Object.assign([...state.crosswordBoard], {
                [action.payload.startY]: Object.assign([...state.crosswordBoard[action.payload.startY]], {
                    [action.payload.startX]: action.payload.character
                })
            })
            return { ...state, crosswordBoard};
        case 'UPDATE_STARTING_POINTS':
            return { ...state, startX: action.payload.startX, startY: action.payload.startY };
        case 'UPDATE_DIRECTION':
            return { ...state, direction: action.payload.direction };
        case 'ADDED_WORD':
            return {...state, addedWords: [...state.addedWords, action.payload]}
        case 'LAST_ADDED_WORD_MAP':
            let lastAddedWordMap = action.payload;
            return { ...state, lastAddedWordMap };
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
};

function CrosswordProvider({children}:any) {
    const [state, dispatch] = React.useReducer(crosswordReducer, initialState)
    return (
      <CrosswordStateContext.Provider value={state}>
        <CrosswordDispatchContext.Provider value={dispatch}>
          {children}
        </CrosswordDispatchContext.Provider>
      </CrosswordStateContext.Provider>
    )
}

function useCrosswordState() {
    const context = React.useContext(CrosswordStateContext)
    if (context === undefined) {
      throw new Error('useCrosswordState must be used within a CrosswordProvider')
    }
    return context
}

function useCrosswordDispatch() {
    const context = React.useContext(CrosswordDispatchContext)
    if (context === undefined) {
      throw new Error('useCrosswordDispatch must be used within a CrosswordProvider')
    }
    return context
}
  
  export {CrosswordProvider, useCrosswordState, useCrosswordDispatch};