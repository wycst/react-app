import Store from './store';

let helloModule = {
    state : {
	   message : 'hello ,this is a custom store !'
	},
    actions : {
	   setMessage(state,msg) {
			console.log('=============helloModule setMessage ');
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
			console.log('============= setName ');
			state.username = username1;
		},
		setMessage(state,msg) {
			console.log('=============userModule setMessage ');
			state.message = msg;
	   }
	}
}

const store = new Store({
	helloModule,
	userModule
});

export default store;


