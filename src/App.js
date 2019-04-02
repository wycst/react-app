import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import 'antd/dist/antd.css';
import {Button} from 'antd';

// import './demos/flux/redux/app'
import store from './store/'

// import renderRoutes from './router/routers'
import { HashRouter,BrowserRouter, Route, Switch,Link} from 'react-router-dom'

import Home from './views/home'
import Index from './views/index'

let m1 = import('./views/demo');
/*m1.then(m => {
  console.log(m.default);
  console.log(m.default == Home);
})*/
console.log('======== 1');

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
          <br />
            {user}
            说：{this.state.hello.message}
          <br />
          <div>
            招呼语：<input ref="msg" style={{ width: 400 + 'px' }} />
          </div>
          <div>
            修改人：<input ref="username" style={{ width: 400 + 'px' }} />
          </div>

          <br />
          <div>
            <Button type="danger">Button</Button>
            <button onClick={this.addCountFn}>click</button>
          </div>

          <div>
            {this.state.user.list.map((element,i) => {
                return (<li key={i}>{element.name}</li>)
            })}
          </div>

          <div id="rt" style={{width:200,height:300}}>
          
            <HashRouter>
                
                <div>
                  <Link to="/">home</Link>
                  <Link to="/home/detail">About</Link>
                </div>
                <br/>
                <br/>
                <div>
                  <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route exact>
                            <Route exact path="/home/detail" component={Index}/>
                        </Route>
                  </Switch>
                </div>

            </HashRouter>
          </div>



        </header>
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
