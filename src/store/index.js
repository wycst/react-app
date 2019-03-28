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

let userModule = {
    state : {
	   username : 'root'
	},
    actions : {
	   setName(state,username1) {
		   state.username = username1;
	   }
	}
}

const store = new Store({
	helloModule,
	userModule
});

export default store;


