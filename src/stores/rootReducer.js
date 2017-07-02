import { combineReducers } from 'redux';
import coins from './coins';
import data from './data';

export default combineReducers({
  coins,
  data,
});
