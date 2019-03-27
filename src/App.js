import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// import './demos/flux/redux/app'
import store from './store/'
import {StoreComponent} from './store/store';

class App extends Component {

  constructor(props) {
	  super(props);
	  this.state = {
	      message : store.state.helloModule.message
	  };
	  this.addCountFn = this.addCountFn.bind(this);

      // 这里设计逻辑注册信息到store
	  // register具体干什么？
	  store.register && store.register(this);
	  // 第一 实现双向绑定
	  // 第二 封装setState,业务只需要在store修改state，视图动态刷新
      
  }
  shouldComponentUpdate(nextProps, nextState) {
      return true;
  }
  render() {
    
    return (
      <div className="App">
        <header>
		  <br/>
          <div>{this.state.message}</div>
          <br/>
		  <div>
			<input/>
		  </div>
          
          <br/>
		  <div>
			  <button onClick={this.addCountFn}>click</button>
		  </div>
		  

        </header>
      </div>
    );
  }

  addCountFn() {

	  // 将 message修改为uuu
	  store.dispatch("setMessage",'uuu111');
	  /*this.setState({
	      message : store.state.helloModule.message
	  })*/
  }

}

export default App;
