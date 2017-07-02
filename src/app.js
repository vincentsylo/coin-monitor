import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { configureStore, subscribeStore } from 'stores';
import Root from 'views/Root';
import { pollData } from 'stores/data';
import localStorage from 'utils/localStorage';

const initialData = { coins: localStorage.load('coins') };
const store = configureStore(initialData);
subscribeStore(store);

const render = () => {
  store.dispatch(pollData());

  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <HashRouter>
          <Root />
        </HashRouter>
      </Provider>
    </AppContainer>,
    document.getElementById('app'),
  );
};

render();

if (module.hot) {
  module.hot.accept('./views/Root', () => {
    const NextRootContainer = require('./views/Root'); // eslint-disable-line
    render(NextRootContainer);
  });
}
