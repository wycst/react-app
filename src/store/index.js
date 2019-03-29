import Store from './store';

let helloModule = {
	state: {
		message: 'hello ,this is a custom store !'
	},
	actions: {
		setMessage(state, msg) {
			console.log('=============helloModule setMessage ');
			state.message = msg;
		}
	}
}

let userModule = {
	state: {
		username: 'root',
		list: [{
			name: 'zhangsan'
		}, {
			name: 'lisi'
		}]
	},
	actions: {
		setName(state, username1) {
			console.log('============= setName ');
			state.username = username1;
		},
		add(state, o) {
			state.list.push(o);
			o.name = 'wwwwww';

		}
	}
}

const store = new Store({
	helloModule,
	userModule
});

export default store;


