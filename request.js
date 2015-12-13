
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
			this.headers = new Map();//��Ϊxhr��Ҫopen֮��������ã������Ȼ�������
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
		//��ֹ����
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

		//����һ������ͷ
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
		*"" �ַ���(Ĭ��ֵ)
		*arraybuffer ArrayBuffer
		*blob Blob
		*document Document
		*json JavaScript ����
		*text �ַ���
		*/
		setResponseType(type) {
			this.responseType = type;

			return this;
		}
		
		//abort���䱻�û�ȡ��
		//error�����г��ִ���
		//load����ɹ����
		//loadEnd������������ǲ�֪���ɹ�����ʧ��
		//loadstart���俪ʼ
		//progress���ش������ݵĽ�����Ϣ
		//timeout ��ʱ 
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
					//post ��Ĭ�ϱ��뷽ʽ
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
							var result = request.response;//����xhr��responseType���Ժ�ʹ�����ȡ����ֵ
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
	//ES6��ȷ�涨��Class�ڲ�ֻ�о�̬������û�о�̬����.ES7�������Ӧ����
	Request.headers = new Map();
	
	
	//���������ȡxhr,��֧��Ajax����null
	function getXhr() {

		if(window.XMLHttpRequest){
			return new XMLHttpRequest();
		}
		else if(window.ActiveXObject){
			return new ActiveXObject('Microsoft.XMLHTTP');
		}

		return null;
	}
	
	//�Ѷ��������ת����&��ʽ��string
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
	
	//��¶�ӿ�
	window.Request = Request;
	
})(window);