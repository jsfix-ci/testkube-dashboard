import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter as Router} from 'react-router-dom';

import 'antd/dist/antd.css';

import {store} from '@redux/store';

import '@styles/global.css';
import '@styles/variables.css';

import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        {/* <GlobalStyle /> */}
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
