
/*
  weber
  https://dvcs.w3.org/hg/xhr/raw-file/tip/Overview.html
  https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest
  http://www.ruanyifeng.com/blog/2012/09/xmlhttprequest_level_2.html
  http://www.html5rocks.com/zh/tutorials/file/xhr2/
  https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
  http://www.ruanyifeng.com/blog/2012/09/xmlhttprequest_level_2.html
*/

;(function(window, undefined) {
	
	'use strict';

	const METHODS = {
		DELETE: 'DELETE',
		GET: 'GET',
		POST: 'POST',
		PUT: 'PUT'
	};
	
	class Request {

		constructor() {
			this.headers = new Map();//因为xhr需要open之后才能设置，所以先缓存起来
			this.verb = METHODS.GET;
			this.data = {};
			this.xhr = getXhr();
		}
		//static
		
		static send(method, url, data, options) {
			return new Request().send(method, url, data, options);
		}

		static create() {
			return new Request();
		}
		
		static delete(url, data, options) {
			return new Request().send(METHODS.DELETE, url, data, options);
		}
		
		static get(url, data, options) {
			return new Request().send(METHODS.GET, url, data, options);
		}
		
		static post(url, data, options) {
			return new Request().send(METHODS.POST, url, data, options);
		}

		static put(url, data, options) {
			return new Request().send(METHODS.PUT, url, data, options);
		}

		//prototype method
		//中止请求
		abort(fn) {
			this.xhr.abort.apply(this.xhr);

			return this;
		}

		setData(data) {
			this.data = data ? data : this.data;
			
			return this;
		}

		delete(url, data, options) {
			return this.send(METHODS.DELETE, url, data, options);
		}

		get(url, data, options) {
			return this.send(METHODS.GET, url, data, options);
		}

		post(url, data, options) {
			return this.send(METHODS.POST, url, data, options);
		}

		put(url, data, options) {
			return this.send(METHODS.PUT, url, data, options);
		}

		//设置一个请求头
		setHeader(key, value) {
			this.headers.set(key, value);

			return this;
		}

		setHeaders(hs) {
			let headers = this.headers;
			for(let key in hs) {
				headers.set(key, hs[key]);
			}

			return this;
		}

	   /*
		*type String
		*"" 字符串(默认值)
		*arraybuffer ArrayBuffer
		*blob Blob
		*document Document
		*json JavaScript 对象
		*text 字符串
		*/
		setResponseType(type) {
			this.responseType = type;

			return this;
		}
		
		//abort传输被用户取消
		//error传输中出现错误
		//load传输成功完成
		//loadEnd传输结束，但是不知道成功还是失败
		//loadstart传输开始
		//progress返回传送数据的进度信息
		//timeout 超时 
		addEventListener(event, fn) {
			this.xhr.addEventListener(event, fn);

			return this;
		}
		
		overrideMimeType(mimetype) {
			this.xhr.overrideMimeType(mimetype);

			return this;
		}

		send(method, url, data, options) {
			
			let request = this.xhr;
			let hds = this.headers;
			let params = data ? data : this.data;
			let opts = options ? options : {async: true, user: null, password: null};
			
			return new Promise(function(resolve, reject) {

				if(method.toUpperCase() === METHODS.GET) {
					url = url + '?' + toQueryString(data);
				}else if((method.toUpperCase() === METHODS.POST) && !(params instanceof Blob)) {
					//post 的默认编码方式
					params = toQueryString(params);
				}

				opts.async = opts.async ? opts.async : false;
				opts.user = opts.user ? opts.user : null;
				opts.password = opts.password ? opts.password : null;

				request.open(method, url, opts.async, opts.user, opts.password);

				for (let key of hds.keys()) {
					request.setRequestHeader(key, hds.get(key));
				}

				request.send(params);

				request.onreadystatechange = function() {
					if(request.readyState == 4) {
						if(request.status == 200 || request.status == 304) {
							var result = request.response;//设置xhr的responseType属性后就从这里取返回值
							//var result = xhr.responseText || xhr.responseXML || xhr.response;
							resolve(result);
						}
						else {
							reject(Error(request.status));
						}
					}
				}

			});
		}
		
	}
	//ES6明确规定，Class内部只有静态方法，没有静态属性.ES7提出了相应方案
	Request.headers = new Map();
	
	
	//跨浏览器获取xhr,不支持Ajax返回null
	function getXhr() {

		if(window.XMLHttpRequest){
			return new XMLHttpRequest();
		}
		else if(window.ActiveXObject){
			return new ActiveXObject('Microsoft.XMLHTTP');
		}

		return null;
	}
	
	//把对象的数据转换成&形式的string
	function toQueryString(data) {

		let query = '', i,
		push = function (key, value) {
			query += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
		}, key, value;

		for (let key in data) {
			if (!Object.hasOwnProperty.call(data, key)) {
				continue;
			}

			value = data[key];

			if ((typeof (data) === 'object') && (data instanceof Array)) {
				for (let i = 0; i < value.length; i++) {
					push(key, value[i]);
				}
			} else {
				push(key, data[key]);
			}
		}

		return query.replace(/&$/, '').replace(/%20/g, '+');
	}
	
	//暴露接口
	window.Request = Request;
	
})(window);