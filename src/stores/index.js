import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import _ from 'lodash';
import localStorage from 'utils/localStorage';
import rootReducer from './rootReducer';

export function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, applyMiddleware(thunk));

  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      store.replaceReducer(require('./rootReducer')); // eslint-disable-line
    });
  }

  return store;
}

function updateLocalStorageIfNeeded(key, previous, current) {
  if (!_.isEqual(previous, current)) {
    _.debounce(() => {
      localStorage.save(key, current);
    })();
  }
}

export function subscribeStore(store) {
  let currentCoins;

  store.subscribe(() => {
    const previousCoins = currentCoins;
    currentCoins = store.getState().coins;
    updateLocalStorageIfNeeded('coins', previousCoins, currentCoins);
  });
}
