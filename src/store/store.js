import React, { Component } from 'react';

function Store(modules) {

	if(!modules || typeof(modules) != 'object')
		throw new Error(' modules cannnot be null !');

    this.modules = {};
    this.state = {};

	for(let moduleKey in modules) {

		let module = modules[moduleKey];
		let state = module.state;
		this.state[moduleKey] = state;

		// ��stateֵ�ı��¼�
		// ��¼ÿ��action
		let actions = module.actions;

		// ��ÿ��action���������ƺͼ������������moduleKey��ϵ
		if(!actions) continue;

		// action���� -> module
		// һ��action��Ӧͬһ��module
		// �����ͬmodule��action������ͬ��ô�죿
		for(let actionName in actions) {
			let action = actions[actionName];
			if(!typeof action == 'function') {
				continue;
			}
			this.modules[actionName] = module;
		}
	}

}

Store.prototype.dispatch = function (action,param){

    if(typeof action != 'string') {
		throw new Error(' The first parameter while call dispatch should be a string type ');
	}
	// 1 ͨ��action���Ʋ��Ҷ�Ӧ��module��action����
	// 2 ��ȡmodule��state��Ϊ��һ��������params��Ϊ�ڶ�����������action�������е���
	// 3 ��module����󶨵�action������this=module��
	// 4 �Ƿ�Ҫ����state��ֵ�ı��¼����Զ��ж�state�Ƿ�ı�����ɷ��¼��������ֶ��ж�state�Ƿ�仯�˽��е��ã�
	// 5 ����Զ�ˢ����ͼ������vue��

	let module = this.modules[action];

    if(!module)
		throw new Error(' action["'+action+'"] not find !');

	let fn = module.actions[action];
	let state = module.state;

	// ��ֹ�����⸳ֵ��ʹ�ñ���
	fn.call({
	    dispatch:(a,b) => {
		   this.dispatch(a,b)
		} 
	},state,param);   

}

class StoreComponent extends Component
{
	constructor(props) {
	   super(props);
	}
}
export {StoreComponent};

export default Store;


