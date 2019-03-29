import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// import './demos/flux/redux/app'
import store from './store/'

store.subscribe("subscribe1",function() {
  console.log(" 111 subscribe1 trigger   ");
});

store.subscribe("subscribe2",function() {
  console.log(" 222 subscribe2 trigger ");
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

    console.log('========== render app');
    
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
            <button onClick={this.addCountFn}>click</button>
            <button onClick={() => { store.unsubscribe("subscribe1")}}>click2</button>
          </div>

          <div>
            {this.state.user.list.map((element,i) => {
                return (<li key={i}>{element.name}</li>)
            })}
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
    store.dispatch("add", {name : 'kkkkkkkkk'},() => {
          console.log('========== add 回调执行');
    });
  }

}

export default App;
