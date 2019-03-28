import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// import './demos/flux/redux/app'
import store from './store/'
import { StoreComponent } from './store/store';

class User extends Component {

      constructor(props) {
          super(props);

          this.state = {
            user : store.state.userModule
          }

          store.register(this);
          console.log(this);
      }

      render() {
          console.log('render User');
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
      hello: store.state.helloModule
    };
    this.addCountFn = this.addCountFn.bind(this);

    // 这里设计逻辑注册信息到store
    // register具体干什么？
    // 第一 实现双向绑定
    // 第二 封装setState,业务只需要在store修改state，视图动态刷新
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
          </div>


        </header>
      </div>
    );
  }

  addCountFn() {
    // this.setState({});
    // 将 message修改为uuu
    store.dispatch("setMessage", this.refs.msg.value);
    store.dispatch("setName", this.refs.username.value);
  }

}

export default App;
