import React, { Component } from 'react';

/**
 * 
 * @param {��������} object 
 * @param {��������} watcher 
 */
function proxy(object,watcher) {
	
	if(!object || typeof(object) != 'object') return object;
	
	// ��ǰ��������
	let proxyTarget =  new Proxy(object,{
		get: function (target, key, receiver) {
			return Reflect.get(target, key, receiver);
		},
		set: function (target, key, value, receiver) {
			if(target[key] !== value) {
				  // ���value�Ƕ������ͱ����¸�ֵ���Ƿ���Ҫ�������´���
					// ���ֵ�б䶯
					watcher && watcher();
			}
			return Reflect.set(target, key, value, receiver);
		}
	});
	
	// ����������
	for(let key in object) {
		let value = object[key];
		if(value && typeof(value) == 'object') {
			proxyTarget[key] = proxy(value,watcher);
		}
	}

	return proxyTarget;
}

function Store(modules) {

	if (!modules || typeof (modules) != 'object')
		throw new Error(' modules cannnot be null !');

	this.modules = {};
	this.state = {};
	
	this.components = [];

	let watcher = () => {
		this.components.forEach(element => {
			if(element && typeof(element.setState) == 'function') {
				console.log(element);
				element.setState({});
			}
		});
	}

	for (let moduleKey in modules) {

		let module = modules[moduleKey];
		let state = module.state;
		this.state[moduleKey] = module.state = proxy(state,watcher);

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
			this.modules[actionName] = module;
		}
	}

}

Store.prototype.register = function(component,listener) {

		if(component == null) return ;
		if(this.components.indexOf(component) == -1) {
				this.components.push(component);
		}
}

Store.prototype.dispatch = function (action, param, callback) {

	if (typeof action != 'string') {
		throw new Error(' The first parameter while call dispatch should be a string type ');
	}
	// 1 ͨ��action���Ʋ��Ҷ�Ӧ��module��action����
	// 2 ��ȡmodule��state��Ϊ��һ��������params��Ϊ�ڶ�����������action�������е���
	// 3 ��module����󶨵�action������this=module��
	// 4 �Ƿ�Ҫ����state��ֵ�ı��¼����Զ��ж�state�Ƿ�ı�����ɷ��¼��������ֶ��ж�state�Ƿ�仯�˽��е��ã�
	// 5 ����Զ�ˢ����ͼ������vue��

	let module = this.modules[action];

	if (!module)
		throw new Error(' action["' + action + '"] not find !');

	let fn = module.actions[action];
	let state = module.state;

	// ��ֹ�����⸳ֵ��ʹ�ñ���
	fn.call({
		dispatch: (a, b) => {
			this.dispatch(a, b)
		}
	}, state, param);

	callback && typeof (callback) == 'function' && callback();
}

class StoreComponent extends Component {
	constructor(props) {
		super(props);
	}
}
export { StoreComponent };

export default Store;


