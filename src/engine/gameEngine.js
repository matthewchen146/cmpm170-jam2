
/**
 * GameEngine class
 * manages the game loop and update functions
 * possible uses:
 * - animation
 * - progress
 * - physics?
 * 
 * requires an updateFunction, which can be passed in the options
 * updateFunction is called with these arguments:
 * - delta - the time since the last frame
 * - time - the time the game has been running (not including paused time)
 * - realTime - the time the game has been running (including paused time)
 * 
 */
class GameEngine {
    constructor(options = {}) {
        // determines the update rate of the game
        // default is 60 calls per second
        this.fps = options.fps || 60;

        this.updateTimeout;
        this.updateTimestamp;
        this.gameStartTimestamp;
        this.gameElapsedTime = 0;
        
        this.idealDelta = 1000 / this.fps;

        this.isRunning = false;
        this.isPaused = false;

        // these store callback functions called by the initializer and update caller
        this.loadFunction = options.loadFunction || options.load;
        this.preUpdateFunction = options.preUpdateFunction || options.preUpdate;

        // the update function is absolutely necessary
        this.updateFunction = options.updateFunction || options.update;

        // array of game objects to update
        this.gameObjects = [];
    }

    // start the engine. this is asynchronous
    // this will run the load function and preupdate function
    // then it will start the update calls
    async start() {
        if (!this.isRunning) {
            if (this.loadFunction) {
                console.log('loading');
                await this.loadFunction();
                console.log('loaded');
            } else {
                console.log('no load function attached, skipping');
            }
            
            console.log('calling preupdate');
            if (this.preUpdateFunction) {
                this.preUpdateFunction();
            } else {
                console.log('no preupdate function attached, skipping');
            }
            
            if (this.updateFunction) {
                this.updateTimestamp = Date.now();
                this.gameStartTime = this.updateTimestamp;
                this.gameElapsedTime = 0;

                this.isRunning = true;

                console.log('running game');
                this.updateCaller();
            } else {
                console.error('no update function attached, update function is required');
                return;
            }
            
        } else {
            console.log('engine already running');
        }
        return this;
    }

    pause() {
        this.isPaused = true;
        return this;
    }

    resume() {
        this.isPaused = false;
        return this;
    }

    stop() {
        if (!this.isRunning) {
            this.isRunning = false;
            clearTimeout(this.updateTimeout);
        } else {
            console.log('engine already stopped');
        }
        return this;
    }

    // calls the update function
    updateCaller() {
        
        const now = Date.now();
        const delta = now - this.updateTimestamp;
        const time = this.gameElapsedTime;
        this.fullElapsedTime = now - this.gameStartTime;

        // if not paused, the update function will be called, and the game elapsed time will increase
        // if paused, the update function will not be called, and the game elapsed time will freeze
        if (this.updateFunction && !this.isPaused) {
            this.gameElapsedTime += delta;
            this.updateFunction(delta, time, this.fullElapsedTime);

            for (let i = 0; i < this.gameObjects.length; i++) {
                const object = this.gameObjects[i];
                if (object.isDestroyed) {
                    this.gameObjects.splice(i, 1);
                    i -= 1;
                } else {
                    object.update(delta, time, this.fullElapsedTime);
                }
            }
        }
        this.updateTimestamp = now;

        const delay = Math.max(0, this.idealDelta - delta);
        
        if (this.isRunning) {
            this.updateTimeout = setTimeout(this.updateCaller.bind(this), delay);
        }
    }

    addGameObject(gameObject) {
        this.gameObjects.push(gameObject);
        return this;
    } 
}