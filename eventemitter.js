
/*
weber

*/


;(function(window, undefined) {
	
	'use strict';
	
	class EventEmitter {
		
		constructor() {
			this.events = new Object();
			this.eventsCount = 0;
			this.maxListeners = 10;
		}

		static listenerCount(emitter, type) {
			if (typeof emitter.listenerCount === 'function') {
				return emitter.listenerCount(type);
			} else {
				return listenerCount.call(emitter, type);
			}
		}
		//
		setMaxListeners(n) {
			if (typeof n !== 'number' || n < 0 || isNaN(n))
    			throw new TypeError('n must be a positive number');

  			this.maxListeners = n;

  			return this;
		}
		
		getMaxListeners() {
			return this.maxListeners;
		}
		
		addListener(type, listener) {
			let m;
			let events;
			let existing;

  			if (typeof listener !== 'function')
   				throw new TypeError('listener must be a function');
			
			events = this.events;
			if (!events) {
    			events = this.events = new Object();
    			this.eventsCount = 0;
  			} else {
    			if (events.newListener) {
      				this.emit('newListener', type,
               		listener.listener ? listener.listener : listener);

      				events = this._events;
    			}
   			 existing = events[type];
  			}
			
			if (!existing) {
    			existing = events[type] = listener;
    			++this.eventsCount;
 			} else {
   				if (typeof existing === 'function') {
     				existing = events[type] = [existing, listener];
    			} else {
      				existing.push(listener);
    			}

      			if (!existing.warned) {
        			m = $getMaxListeners(this);

         			if (m && m > 0 && existing.length > m) {
            			existing.warned = true;
           		 		console.error('(node) warning: possible EventEmitter memory ' +
                     		'leak detected. %d %s listeners added. ' +
                    		'Use emitter.setMaxListeners() to increase limit.',
                     		existing.length, type);
          		  		console.trace();
          			}
				}
        	}
			
			return this;
		}
		
		on(type, listener) {
			return this.addListener(type, listener);
		}
		
		once(type, listener) {
			if (typeof listener !== 'function')
 				throw new TypeError('listener must be a function');

  			var fired = false;
			
			function g() {
    			this.removeListener(type, g);

    			if (!fired) {
    				fired = true;
      				listener.apply(this, arguments);
    			}
  			}

  			g.listener = listener;
  			this.on(type, g);

  			return this;
		}
		
		removeListener(type, listener) {
			let list, events, position, i;

			if (typeof listener !== 'function')
    			throw new TypeError('listener must be a function');

			events = this.events;
			if (!events)
				return this;

			list = events[type];
			if (!list)
    			return this;
			
			if (list === listener || (list.listener && list.listener === listener)) {
    			if (--this.eventsCount === 0)
        			this.events = {};
        		else {
         			delete events[type];
        			if (events.removeListener)
         			this.emit('removeListener', type, listener);
       			}
      		} else if (typeof list !== 'function') {
     			position = -1;

    			for (i = list.length; i-- > 0;) {
    				if (list[i] === listener ||
						(list[i].listener && list[i].listener === listener)) {
                        position = i;

                        break;
                    }
                }

                if (position < 0)
                    return this;

                    if (list.length === 1) {
                        list[0] = undefined;

                        if (--this.eventsCount === 0) {
                    	    this.events = {};
                        return this;
                    } else {
                        delete events[type];
                    }
                } else {
                    spliceOne(list, position);
                }

                if (events.removeListener)
                    this.emit('removeListener', type, listener);
            }

            return this;
		}
		
		removeAllListeners(type) {
			var listeners, events;

    		events = this._events;
    		if (!events)
    			return this;

    		if (!events.removeListener) {
        		if (arguments.length === 0) {
        			this.events = {};
        			this.eventsCount = 0;
        		} else if (events[type]) {
        			if (--this.eventsCount === 0)
            			this.events = {};
          			else
            			delete events[type];
        		}

        		return this;
      		}
			
			if (arguments.length === 0) {
    			var keys = Object.keys(events);
    			for (var i = 0, key; i < keys.length; ++i) {
    				key = keys[i];

    				if (key === 'removeListener') continue;

    				this.removeAllListeners(key);
   				}

    			this.removeAllListeners('removeListener');
    			this.events = {};
    			this.eventsCount = 0;
    			return this;
  			}
			
			listeners = events[type];

    		if (typeof listeners === 'function') {
    			this.removeListener(type, listeners);
    		} else if (listeners) {
    			do {
        			this.removeListener(type, listeners[listeners.length - 1]);
        		} while (listeners[0]);
      		}

    		return this;
		}
		
		listeners(type) {
			let evlistener;
			let ret;
			let events = this.events;

			if (!events)
				ret = [];
			else {
				evlistener = events[type];
				if (!evlistener)
    				ret = [];
				else if (typeof evlistener === 'function')
    				ret = [evlistener];
    			else
					ret = arrayClone(evlistener, evlistener.length);
  			}

  			return ret;
		}
		
		listenerCount(emitter, type) {
			const events = this.events;

			if (events) {
    			const evlistener = events[type];

    			if (typeof evlistener === 'function') {
    				return 1;
    			} else if (evlistener) {
    				return evlistener.length;
    			}
			}

			return 0;
		}
		
	}
	//
	function spliceOne(list, index) {
		for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
			list[i] = list[k];

		list.pop();
	}

	function arrayClone(arr, i) {
		let copy = new Array(i);

		while (i--)
			copy[i] = arr[i];

		return copy;
	}
	

	//±©Â¶½Ó¿Ú
	window.Request = Request;
	
})(window);