
/**
 * 
 * Timer class
 * 
 * to automate and abstract timer usage in various places
 * 
 */
class Timer {
    
    static timers = [];

    static init() {
        if (!this.initialized) {

            this.timers = [];

            this.initialized = true
        }
    }

    static update(delta, time) {
        for (let i = 0; i < this.timers.length; i++) {
            const timer = this.timers[i];
            if (timer.isDestroyed) {
                this.timers.splice(i, 1);
                i -= 1;
            } else {
                timer.update(delta, time);
            }
        };
    }
    
    constructor(duration, options = {}) {
        Timer.init();

        if (!options.disableUpdate) {
            Timer.timers.push(this);
        }

        this.events = new EventEmitter();
    
        this.timer = 0;
        this.duration = duration || 0;
        this.resolve;

        this.isRunning = options.autoStart || false;
    }

    start(promise = false) {
        this.isRunning = true;
        this.events.trigger('start', this);
        if (promise) {
            return new Promise((resolve) => {
                this.resolve = resolve;
            })
        }
        return this;
    }

    getProgress() {
        return Math.min(1, this.timer / this.duration);
    }

    update(delta, time) {
        const progress = this.getProgress();
        if (progress === 1) {

            this.events.trigger('end', this);
            if (this.resolve) {
                this.resolve();
            }

            this.destroy();
        }

        this.events.trigger('update', this, progress);

        if (this.isRunning) {
            this.timer += delta;
        }
        return this;
    }

    onUpdate(callback) {
        this.events.on('update', callback);
        return this;
    } 

    destroy() {
        this.isDestroyed = true;
        return this;
    }
}