import Store from './store';

let helloModule = {
    state : {
	   message : 'hello ,this is a custom store !'
	},
    actions : {
	   setMessage(state,msg) {
		   state.message = msg;
	   }
	}
}

const store = new Store({
	helloModule
});

export default store;


