import _ from 'lodash';
import api from 'utils/api';

const FETCHING = 'FETCHING';
const FETCH_SUCCESS = 'FETCH_SUCCESS';
const FETCH_FAILED = 'FETCH_FAILED';
const UPDATE_CURRENCY = 'UPDATE_CURRENCY';

const pollInterval = 30000;

const initialState = {
  coins: [],
  fetching: false,
  error: null,
  currencyChanged: true,
  currency: 'aud',
};

export default function data(state = initialState, action) {
  switch (action.type) {
    case FETCHING:
      return {
        ...state,
        fetching: true,
        error: null,
      };

    case FETCH_SUCCESS:
      return {
        ...state,
        fetching: false,
        currencyChanged: false,
        coins: action.coins,
      };

    case FETCH_FAILED:
      return {
        ...state,
        fetching: false,
        currencyChanged: false,
        error: action.error,
      };

    case UPDATE_CURRENCY:
      return {
        ...state,
        currencyChanged: true,
        currency: action.currency,
      };

    default:
      return state;
  }
}

export function pollData() {
  return async (dispatch, getState) => {
    const fetchId = _.uniqueId();
    window.fetchId = fetchId;

    try {
      clearTimeout(window.timer);

      dispatch({ type: FETCHING });

      const coins = await api.get(`https://api.coinmarketcap.com/v1/ticker/?convert=${getState().data.currency}`);

      if (window.fetchId !== fetchId) return;

      dispatch({ type: FETCH_SUCCESS, coins });

      window.timer = setInterval(() => dispatch(pollData()), pollInterval);
    } catch (error) {
      if (window.fetchId !== fetchId) return;

      dispatch({ type: FETCH_FAILED, error });

      window.timer = setInterval(() => dispatch(pollData()), pollInterval);
    }
  };
}

export function updateCurrency(currency) {
  return (dispatch) => {
    dispatch({ type: UPDATE_CURRENCY, currency });
    dispatch(pollData());
  };
}
