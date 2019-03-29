import React, { Component } from 'react';

/**
 * 
 * @param {监听对象} object 
 * @param {监听函数} watcher 
 */
function proxy(object, watcher) {

	if (!object || typeof (object) != 'object') return object;

	// 当前对象属性
	let proxyTarget = new Proxy(object, {
		get: function (target, key, receiver) {
			return Reflect.get(target, key, receiver);
		},
		set: function (target, key, value, receiver) {
			if (target[key] !== value) {
				// 如果value是对象类型被重新赋值，是否需要进行重新代理?
				// 如果值有变动
				watcher && watcher();
			}
			return Reflect.set(target, key, value, receiver);
		}
	});

	// 遍历子属性
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

	// 初始化订阅者队列
	this.subscribers = {};

	let doSubscribe = subscribers => {
		for(let name in subscribers) {
			subscribers[name] && subscribers[name]();
		}
	}

	let watcher = () => {
		
		if(!this.isStateChanged) {
			// 下一帧执行
			setImmediate(() => {
				if (this.subscribers) {
					// 发送订阅
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

		// 绑定state值改变事件
		// 记录每个action
		let actions = module.actions;

		// 绑定每个action（函数名称和及函数句柄）和moduleKey关系
		if (!actions) continue;

		// action名称 -> module
		// 一组action对应同一个module
		// 如果不同module的action名称相同怎么办？
		for (let actionName in actions) {
			let action = actions[actionName];
			if (!typeof action == 'function') {
				continue;
			}

			if(!this.modules[actionName]) {
				this.modules[actionName] = module;
			}
			// 解决同名action储存问题
			this.modules[moduleKey + '.' + actionName] = module;
		}
	}

}

/**
 * 订阅，当有state的属性变化时通知订阅者
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
 * 取消订阅 参数需要和订阅传递的参数一致
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
				// 与其后面需要判断，不如这里直接移除
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
 * 当state有赋值操作且变化时
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
	
	// 执行回调
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
	// 1 通过action名称查找对应的module和action函数
	// 2 获取module的state作为第一个参数，params作为第二个参数，对action函数进行调用
	// 3 将module对象绑定到action函数（this=module）
	// 4 是否要处理state的值改变事件（自动判定state是否改变进行派发事件，还是手动判断state是否变化了进行调用）
	// 5 如何自动刷新视图（类似vue）

	let module = this.modules[actionName];

	if (!module)
		throw new Error(' action["' + actionName + '"] not find !');

	let dotIndex = -1;
	if((dotIndex = actionName.indexOf('.')) > -1) {
		actionName = actionName.substring(dotIndex + 1);
	}

	let actionFunc = module.actions[actionName];
	let state = module.state;

	// 防止被恶意赋值，使用备份
	actionFunc.call({
		dispatch: (a, b) => {
			this.dispatch(a, b)
		}
	}, state, param);

	// 重置
	if (!this.frameImmediate) {
		this.frameImmediate = true;
	}

	// 下一帧执行
	setImmediate(() => {
		let frameImmediate = this.frameImmediate;
		if (frameImmediate) {
			this.frameImmediate = false;
			// 执行
			this.refreshStateChange();
			// this.executeCallbacks();
		}
	});

	// 在 setImmediate中依次执行，结束后清除队列
	callback && typeof (callback) == 'function' && this.callbacks.push(callback);

}

export default Store;


