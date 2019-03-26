import EventEmitter from 'events';
import assign from 'object-assign';
import AppDispatcher from '../dispatcher/AppDispatcher';
import uuid from 'uuid';

const DemoStore = assign({}, EventEmitter.prototype, {
  number : 1,
  create() {
    this.number++;
  },
  getNumber() {
	return this.number;
  },
  emitChange() {
    this.emit('change');
  },
  addChangeListener(callback) {
    this.on('change', callback);
  },
  removeChangeListener(callback) {
    this.removeListener('change', callback);
  }
});

AppDispatcher.register((action) => {
  switch (action.actionType) {
    case 'create':
	  console.log(action);
      DemoStore.create();
      DemoStore.emitChange();
      break;
    default:
      //  nothing to do here

  }
});
export default DemoStore;
