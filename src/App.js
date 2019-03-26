import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// import './demos/flux/redux/app'
import store from './store/'

let i = 1;
let j = 6;


let t = i + j;
let m = <div>ddd{t}</div>

console.dir(m);


class App extends Component {

  constructor(props) {
	  super(props);
	  this.state = {
	      message : store.state.helloModule.message
	  };
	  this.addCountFn = this.addCountFn.bind(this);
  }
  shouldComponentUpdate(nextProps, nextState) {
	  console.log(this.state.message);
	  console.log(this.state.u);
      return true;
  }

  render() {
    
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React {this.state.message}
          </a>
          <br/>
		  <button onClick={this.addCountFn}>{this.state.message}</button>

        </header>
      </div>
    );
  }

  addCountFn() {

	  // ½« messageÐÞ¸ÄÎªuuu
	  store.dispatch("setMessage",'uuu');
	  /*this.setState({
	      message : store.state.helloModule.message
	  })*/
	  this.setState({
	      u : 's'
	  });
  }

}

export default App;
