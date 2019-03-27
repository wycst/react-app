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

      // ��������߼�ע����Ϣ��store
	  // register�����ʲô��
	  store.register && store.register(this);
	  // ��һ ʵ��˫���
	  // �ڶ� ��װsetState,ҵ��ֻ��Ҫ��store�޸�state����ͼ��̬ˢ��
      
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

	  // �� message�޸�Ϊuuu
	  store.dispatch("setMessage",'uuu111');
	  /*this.setState({
	      message : store.state.helloModule.message
	  })*/
  }

}

export default App;
