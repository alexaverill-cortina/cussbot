import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore } from 'redux';
import appReducer from "./reducers/appReducer";
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { setConfig } from './reducers/configReducer';

const store = createStore(appReducer);
FetchConfig(store);

function FetchConfig(store) {
  fetch(process.env.PUBLIC_URL + '/config/config.json', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
    .then(response => response.json())
    .then(configData => {
      if (configData) {
        store.dispatch(setConfig(configData));
      } else {
        console.logWarning('Config is null!');
      }
    });
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}> 
        <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
