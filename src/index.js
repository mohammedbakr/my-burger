import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import burgerBuilderReducer from './store/reducers/burgerBuilder';
import orderReducer from './store/reducers/order';
import authReducer from './store/reducers/auth';
import { BrowserRouter as Router } from 'react-router-dom';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  burgerBuilder: burgerBuilderReducer,
  order: orderReducer,
  auth: authReducer
})

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))

ReactDOM.render(
  // <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
