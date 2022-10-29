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

    on(eventName, callback, {once, id}) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push({
            callback,
            once: once || false,
            id
        });
        return this;
    }

    once(eventName, callback, {id}) {
        this.on(eventName, callback, {once: true, id});
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

    trigger(eventName) {
        const callbackArray = this.events[eventName] || [];
        callbackArray.forEach((callback) => {
            callback();
        })
    }
}