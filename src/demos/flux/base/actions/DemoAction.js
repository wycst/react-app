import AppDispatcher from '../dispatcher/AppDispatcher';

const DemoAction = {
  create(p) {
    AppDispatcher.dispatch({
      actionType: 'create',
		p
    });
  },
 
};

export default DemoAction;
