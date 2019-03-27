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

		// 绑定state值改变事件
		// 记录每个action
		let actions = module.actions;

		// 绑定每个action（函数名称和及函数句柄）和moduleKey关系
		if(!actions) continue;

		// action名称 -> module
		// 一组action对应同一个module
		// 如果不同module的action名称相同怎么办？
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
	// 1 通过action名称查找对应的module和action函数
	// 2 获取module的state作为第一个参数，params作为第二个参数，对action函数进行调用
	// 3 将module对象绑定到action函数（this=module）
	// 4 是否要处理state的值改变事件（自动判定state是否改变进行派发事件，还是手动判断state是否变化了进行调用）
	// 5 如何自动刷新视图（类似vue）

	let module = this.modules[action];

    if(!module)
		throw new Error(' action["'+action+'"] not find !');

	let fn = module.actions[action];
	let state = module.state;

	// 防止被恶意赋值，使用备份
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


