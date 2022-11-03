
/**
 * Sound class
 * 
 * custom class to wrap the html audio player
 * 
 * goals: easier control of sounds
 * ability to play sounds rapidly
 */
class Sound {
    static volume = .5;

    static sounds = [];

    constructor(src, options = {}) {

        this.src = src;
        this.blob;
        this.blobUrl;
        this.events = new EventEmitter();
        this._volume = 1;

        this.isReady = false;

        Sound.fetchBlob(this.src).then((blob) => {
            if (blob) {
                this.blob = blob;
                this.blobUrl = URL.createObjectURL(blob);

                this.audio = new Audio(this.blobUrl);
            } else {
                console.log('bad mode');
                this.audio = new Audio(this.src);
            }
            

            this.setLoop(options.loop);
            this.setVolume(options.volume);

            Sound.sounds.push(this);
            
            this.audio.addEventListener('canplaythrough', () => {
                this.events.trigger('canplaythrough', this);
            })
            
            this.isReady = true;
        });

    }

    static async fetchBlob(src) {
        const url = src;
        let blob;
        try {
            const headers = new Headers();
            headers.append('Access-Control-Allow-Origin', '*');
            headers.append('Access-Control-Allow-Headers', '*');

            blob = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                headers: headers,
            }).then((response) => { return response.blob(); });
        } catch (error) {
            console.warn('failed to fetch',src,'probably a CORS issue, which happens when testing locally');
            console.log('falling back to BAD MODE');
        }
        
        return blob;
    }

    play() {
        if (!this.isReady) {
            return;
        }

        const volume = Sound.getVolume() * this._volume;

        
        if (this.audio.paused) {
            this.audio.volume = volume;
            this.audio.play();
        } else {

            if (this.blobUrl) {
                const temp = new Audio(this.blobUrl);
                temp.volume = volume;
                temp.play();
            } else {
                const temp = new Audio(this.src);
                temp.volume = volume;
                temp.play();
            }

        }
        
        return this;
    }

    get playing() {
        return !this.audio.paused;
    }

    pause() {
        this.audio.pause();
        return this;
    }

    get paused() {
        return this.audio.paused;
    }

    setLoop(bool = false) {
        this.audio.loop = bool;
        return this;
    }

    set loop(bool) {
        return this.setLoop(bool);
    }

    get loop() {
        return this.audio.loop;
    }

    setVolume(volume = this._volume) {
        this._volume = Math.min(1, Math.max(0, volume));
        this.audio.volume = Sound.getVolume() * this._volume;
        return this;
    }
    
    getVolume() {
        return this._volume;
    }

    set volume(volume) {
        return this.setVolume(volume);
    }

    get volume() {
        return this.getVolume();
    }

    // makes the audio delete itself after finishing
    setTemp(bool = false) {
        this.temp = bool;

        if (this.temp) {
            this.audio.addEventListener('ended', () => {

            });
        } else {
            this.audio
        }

        return this;
    }

    static setVolume(volume) {
        this.volume = Math.min(1, Math.max(0, volume));
        this.sounds.forEach((sound) => {
            sound.setVolume();
        });
        return this;
    }

    static getVolume() {
        return this.volume;
    }

    static set volume(volume) {
        return this.setVolume(volume);
    }

    static get volume() {
        return this.getVolume();
    }

    static clearSounds() {
        this.sounds = [];
        return this;
    }
}

