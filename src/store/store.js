import React, { Component } from 'react';

/**
 * 
 * @param {��������} object 
 * @param {��������} watcher 
 */
function proxy(object, watcher) {

	if (!object || typeof (object) != 'object') return object;

	// ��ǰ��������
	let proxyTarget = new Proxy(object, {
		get: function (target, key, receiver) {
			return Reflect.get(target, key, receiver);
		},
		set: function (target, key, value, receiver) {
			if (target[key] !== value) {
				// ���value�Ƕ������ͱ����¸�ֵ���Ƿ���Ҫ�������´���?
				// ���ֵ�б䶯
				watcher && watcher();
			}
			return Reflect.set(target, key, value, receiver);
		}
	});

	// ����������
	for (let key in object) {
		let value = object[key];
		if (value && typeof (value) == 'object') {
			proxyTarget[key] = proxy(value, watcher);
		}
	}

	return proxyTarget;
}

function Store(modules) {

	console.log(" create Store 11 ... ");

	if (!modules || typeof (modules) != 'object')
		throw new Error(' modules cannnot be null !');

	this.modules = {};
	this.state = {};

	this.components = [];
	this.frameImmediate = false;
  this.callbacks = [];
	this.isStateChanged = false;

	// ��ʼ�������߶���
	this.subscribers = {};

	let doSubscribe = subscribers => {
		for(let name in subscribers) {
			subscribers[name] && subscribers[name]();
		}
	}

	let watcher = () => {
		
		if(!this.isStateChanged) {
			// ��һִ֡��
			setImmediate(() => {
				if (this.subscribers) {
					// ���Ͷ���
					doSubscribe(this.subscribers);
				}
			});
		}
		this.isStateChanged = true;
	}

	for (let moduleKey in modules) {

		let module = modules[moduleKey];
		let state = module.state;
		this.state[moduleKey] = module.state = proxy(state, watcher);

		// ��stateֵ�ı��¼�
		// ��¼ÿ��action
		let actions = module.actions;

		// ��ÿ��action���������ƺͼ������������moduleKey��ϵ
		if (!actions) continue;

		// action���� -> module
		// һ��action��Ӧͬһ��module
		// �����ͬmodule��action������ͬ��ô�죿
		for (let actionName in actions) {
			let action = actions[actionName];
			if (!typeof action == 'function') {
				continue;
			}

			if(!this.modules[actionName]) {
				this.modules[actionName] = module;
			}
			// ���ͬ��action��������
			this.modules[moduleKey + '.' + actionName] = module;
		}
	}

}

/**
 * ���ģ�����state�����Ա仯ʱ֪ͨ������
 */
Store.prototype.subscribe = function(name,subscriber) {
		
		if(typeof(name) != 'string')
		    name = name + '';

		if(typeof(subscriber) == 'string') 
				subscriber = window[subscriber];

		if(typeof(subscriber) == 'function') {
				this.subscribers[name] = subscriber;
		}

}

/**
 * ȡ������ ������Ҫ�Ͷ��Ĵ��ݵĲ���һ��
 */
Store.prototype.unsubscribe = function(name) {
	if(typeof(name) != 'string')
		name = name + '';
	delete this.subscribers[name];
}

Store.prototype.register = function (component) {

	if (component == null) return;

	console.log(this.components.indexOf(component));
	if (this.components.indexOf(component) == -1) {
		this.components.push(component);

		let componentWillUnmount = component.componentWillUnmount;
		if (componentWillUnmount && typeof (componentWillUnmount) == 'function') {

			component.componentWillUnmount = () => {
				componentWillUnmount.call(component);
				component.unMounted = true;

				console.log('====== unmount 333 ');
				// ���������Ҫ�жϣ���������ֱ���Ƴ�
				let componentIndex = this.components.indexOf(component);
				if(componentIndex > -1) {
					this.components.splice(componentIndex,1);
				}
			}
		}
	}
}

Store.prototype.destroy = function() {




}

/**
 * ��state�и�ֵ�����ұ仯ʱ
 */
Store.prototype.refreshStateChange = function (fn) {

	console.log('============= refreshStateChange ing ');
	console.log(this.components);
	
	fn && typeof(fn) == 'function' && this.callbacks.push(fn);

	if(this.isStateChanged) {
		
		this.isStateChanged = false;

		this.components.forEach(element => {
	
			if (!element || !typeof (element.setState) == 'function')
				return ;
	
			if (!element.unMounted) {
				element.setState({});
			}
		})

		/*this.components = this.components.filter(element => {
	
			if (!element || !typeof (element.setState) == 'function')
				return false;
	
			if (!element.unMounted) {
				element.setState({});
				return true;
			}
	
			return false;
		});*/
		console.log('============= refreshStateChange1 ed');
	}
	
	// ִ�лص�
	this.callbacks.forEach(callback => {
		try {
			callback();
		} catch(e) {

		}
	})
	this.callbacks.splice(0,this.callbacks.length);

}

Store.prototype.dispatch = function (actionName, param, callback) {
	// process.nextTick
	// this.stateChanged
	if (typeof actionName != 'string') {
		throw new Error(' The first parameter while call dispatch should be a string type ');
	}
	// 1 ͨ��action���Ʋ��Ҷ�Ӧ��module��action����
	// 2 ��ȡmodule��state��Ϊ��һ��������params��Ϊ�ڶ�����������action�������е���
	// 3 ��module����󶨵�action������this=module��
	// 4 �Ƿ�Ҫ����state��ֵ�ı��¼����Զ��ж�state�Ƿ�ı�����ɷ��¼��������ֶ��ж�state�Ƿ�仯�˽��е��ã�
	// 5 ����Զ�ˢ����ͼ������vue��

	let module = this.modules[actionName];

	if (!module)
		throw new Error(' action["' + actionName + '"] not find !');

	let dotIndex = -1;
	if((dotIndex = actionName.indexOf('.')) > -1) {
		actionName = actionName.substring(dotIndex + 1);
	}

	let actionFunc = module.actions[actionName];
	let state = module.state;

	// ��ֹ�����⸳ֵ��ʹ�ñ���
	actionFunc.call({
		dispatch: (a, b) => {
			this.dispatch(a, b)
		}
	}, state, param);

	// ����
	if (!this.frameImmediate) {
		this.frameImmediate = true;
	}

	// ��һִ֡��
	setImmediate(() => {
		let frameImmediate = this.frameImmediate;
		if (frameImmediate) {
			this.frameImmediate = false;
			// ִ��
			this.refreshStateChange();
			// this.executeCallbacks();
		}
	});

	// �� setImmediate������ִ�У��������������
	callback && typeof (callback) == 'function' && this.callbacks.push(callback);

}

export default Store;


