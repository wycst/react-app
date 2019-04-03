import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import 'antd/dist/antd.css';
import {Button} from 'antd';

// import './demos/flux/redux/app'
import store from './store/'

//import renderRoutes from './router/routers'
import { HashRouter,BrowserRouter, Route, Switch,Link} from 'react-router-dom'

import { matchRoutes, renderRoutes } from "react-router-config";

import Home from './views/home'
import Index from './views/index'

store.subscribe("subscribe1",function() {
    console.log(1);
});

class User extends Component {

      constructor(props) {
          super(props);

          this.state = {
            user : store.state.userModule
          }

          store.register(this);
      }

      render() {
          console.log('render User ');
          return (
            <div>
              <span>user:</span>
              <span>{this.state.user.username}</span>
            </div>
          );
      }

      componentWillUnmount() {
        console.log(' unmount');
      }

}

let routers = [{
  path : '/home',
  component : Home
},{
path : '/index',
component : Index
},{
path : '/user',
component : User
}]

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hello: store.state.helloModule,
      user : store.state.userModule
    };
    this.addCountFn = this.addCountFn.bind(this);

    // 将组件注册到store，能接受到state的变化自动调用组件的setState
    store.register(this);

  }

  
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  render() {

    let user = <User></User>;
    if(this.state.hello.message == 'hidden') {
      user = null;
    }

    return (
      <div className="App">
        <header>
          
          <div>
            <Button type="danger">Button</Button>
            <button onClick={this.addCountFn}>click</button>
          </div>

          <div>
            <Link to="/home">home</Link>
            <Link to="/index">index</Link>
          </div>
        </header>

        <main>
          {renderRoutes(routers)}
          
          {/**
          <Switch>
                <Route exact path="/" component={Home}/>
                <Route exact>
                    <Route exact path="/home/detail" component={Index}/>
                </Route>
          </Switch>
          */}
        </main>

      </div>
    );
  }

  addCountFn() {
    // this.setState({});
    // 将 message修改为uuu
    store.dispatch("setMessage",  this.refs.msg.value,() => {
         console.log('========== setmessage1 回调执行');
    });
    store.dispatch("setName", this.refs.username.value,() => {
         console.log('========== setName 回调执行');
    });
    store.dispatch("add", {name : 'aaaaaaaaaaa'},() => {
          console.log('========== add 回调执行');
    });
  }

}

export default App;
