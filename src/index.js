import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { AppContainer } from 'react-hot-loader';

import { HashRouter,BrowserRouter, Route, Switch,Link} from 'react-router-dom'
/*
const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component/>
    </AppContainer>,
    document.getElementById('root')
  );
};
render(App);*/

ReactDOM.render(
    <AppContainer>
      <HashRouter>
          <App/>
      </HashRouter>
    </AppContainer>,
    document.getElementById('root')
  );

// 模块热替换的 API
/*if (module.hot) {
  module.hot.accept(() => {
    render(App)
  });
}*/

if (module.hot) {
	module.hot.accept();
}


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
