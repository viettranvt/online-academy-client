import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';
import App from './App';

import { Provider } from 'react-redux';
import store from './redux/store';

import { vi } from 'timeago.js/lib/lang';
import * as TimeAgo from 'timeago.js';
TimeAgo.register('vi', vi);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('root')
);

serviceWorker.unregister();
