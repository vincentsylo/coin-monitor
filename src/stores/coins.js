import randomColor from 'randomcolor';
import _ from 'lodash';

const ADD_COIN = 'ADD_COIN';
const UPDATE_COIN = 'UPDATE_COIN';
const REMOVE_COIN = 'REMOVE_COIN';

const initialState = {};

export default function coins(state = initialState, action) {
  switch (action.type) {
    case ADD_COIN:
      return {
        ...state,
        [action.symbol]: {
          amount: action.amount,
          value: action.value,
          name: action.name,
          color: randomColor(),
        },
      };

    case UPDATE_COIN:
      return {
        ...state,
        [action.symbol]: {
          ...state[action.symbol],
          amount: action.amount,
          value: action.value,
        },
      };

    case REMOVE_COIN:
      return _.omit(state, action.symbol);

    default:
      return state;
  }
}

export function addCoin(symbol, amount, value, name) {
  return { type: ADD_COIN, symbol, amount, value, name };
}

export function updateCoin(symbol, amount, value) {
  return { type: UPDATE_COIN, symbol, amount, value };
}

export function removeCoin(symbol) {
  return { type: REMOVE_COIN, symbol };
}
