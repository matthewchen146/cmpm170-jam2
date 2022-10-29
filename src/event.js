/**
 * 
 * EventEmitter class
 * handles adding callbacks to event names, calling them, etc
 * most likely use is emitter.on('eventName', () => {})
 * 
 */
class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(eventName, callback, options = {}) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push({
            callback,
            once: options.once || false,
            id: options.id
        });
        return this;
    }

    once(eventName, callback, options = {}) {
        this.on(eventName, callback, {once: true, id: options.id});
        return this;
    }

    off(eventName, id) {
        if (this.events[eventName]) {
            if (!id) {
                delete this.events[eventName];
            } else {
                const index = this.events[eventName].findIndex((element) => {
                    element.id = id;
                });
                if (index > 0) {
                    this.events[eventName].splice(index, 1);
                }
            }
        }
        return this;
    }

    trigger(eventName, ...args) {
        const callbackArray = this.events[eventName] || [];
        for (let i = 0; i < callbackArray.length; i++) {
            const {callback, once} = callbackArray[i];
            callback(...args);
            if (once) {
                callbackArray.splice(i, 1);
                i -= 1;
            }
        }
        return this;
    }
}