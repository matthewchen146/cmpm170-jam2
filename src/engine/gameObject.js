

class GameObject {
    static PositionModes = {
        // whatever the defualt is
        NONE: 1,
        // absolute position on the window
        ABSOLUTE: 2,
        // relative to the parent
        RELATIVE: 3
    }

    // the default container/parent for created elements
    static defaultContainer = document.body;
    
    // the default that updates game objects
    static defaultEngine;

    constructor(options = {}) {

        // orientation and display vectors

        // current position represents the current displayed position
        // this is because in a transition, it can take time for the displayed position to reach the target position
        this._currentPosition = new Vector2();

        // this position represents the target postition
        this._position = new Vector2();

        // plan to implement transition for sizing too?
        // this._currentSize = new Vector2();
        this._size = new Vector2();
        this._origin = new Vector2();

        // rotation in radians
        this._rotation = 0;

        // scale, does not affect the actual size
        this._scale = new Vector2(1, 1);

        this.positionMode = GameObject.PositionModes.ABSOLUTE;

        // this.parent;
        this.element = options.element || (options.tag ? document.createElement(options.tag) : undefined) || document.createElement('div');
        this.element.isGameObject = true;
        this.element.gameObject = this;
        
        // check if the element is in the document already
        if (this.element.isConnected) {
            const parent = options.parent || options.container; // might remove

            // convert client rect into absolute positions
            this.autoSize();

            if (options.positionMode) {
                this.setPositionMode(options.positionMode || GameObject.PositionModes.ABSOLUTE);
            }
        } else {
            const parent = options.parent || options.container || GameObject.defaultContainer;

            if (parent) {
                this.setParent(parent);
            }

            const positionMode = options.positionMode || GameObject.PositionModes.ABSOLUTE;

            this.setPosition(this._position.x, this._position.y);
            this.setSize(this._size.x, this._size.y);
            
            this.setOrigin(this._origin.x, this._origin.y);

            this.setPositionMode(positionMode);
        }

        this.updateFunction;

        this.engine = options.engine || GameObject.defaultEngine;
        if (this.engine) {
            this.engine.addGameObject(this);
        }

        // a tooltip text that will be displayed if set
        this.tooltip;
        this.addEventListener('mousemove', () => {
            if (this.tooltip) {

            }
        });
        this.addEventListener('mouseout', () => {

        });

        this.isVisible = true;
        this.setVisible(this.isVisible);
        this.isDestroyed = false;

        this.transitionSpeed = .1;
        this.isTransitionEnabled = true;
        this.transitionUpdateFunction;

        this.animationUpdateFunctions = [];

        this.setTransitionUpdateFunction((...args) => {

            if (this.isTransitionEnabled) {
                this._currentPosition.add(this._position.copy().sub(this._currentPosition).mul(this.transitionSpeed));
                // this.translate();
            }
            this.setAbsolutePosition(this._currentPosition);

            this.animationUpdateFunctions.forEach((func) => {
                func(...args);
            })
            
            this.events.trigger('transitionupdate');

        });

        // event emitter for this object
        this.events = new EventEmitter();

        // prevents the default drag behavior
        // this will prevent image elements from being ghost dragged
        this.element.draggable = false;
    }

    // changes the visibility of the element
    // specifically, it changes the display style
    // this will hide all children as well
    // to set the "visibility" style, it can be set manually with setStyle
    setVisible(bool) {
        this.isVisible = bool;
        if (this.isVisible) {
            // this.setStyle('display', '');
            this.setStyle('visibility', 'inherit');
        } else {
            // this.setStyle('display', 'none');
            this.setStyle('visibility', 'hidden');
        }
        return this;
    }

    getVisible() {
        return this.isVisible;
    }

    // used internally. do not call for your own sake!
    setAbsolutePosition(x = this._currentPosition.x, y = this._currentPosition.y) {
        if (this.positionMode === GameObject.PositionModes.NONE) {
            return;
        }

        let absoluteX;
        let absoluteY;
        if (x instanceof Object) {
            absoluteX = x.x;
            absoluteY = x.y;
        } else {
            absoluteX = x;
            absoluteY = y;
        }
        absoluteX = absoluteX - this._origin.x * this._size.x;
        absoluteY = absoluteY - this._origin.y * this._size.y;
        this.setStyle('left', absoluteX);
        this.setStyle('top', absoluteY);
        return this;
    }

    // set the position of the element.
    setPosition(x = this._position.x, y = this._position.y) {
        this._position.set(x, y);

        if (!this.isTransitionEnabled) {
            this._currentPosition.set(this._position);
            this.setAbsolutePosition(this._currentPosition);
        }

        return this;
    }

    getPosition(transition = false) {
        if (this.positionMode === GameObject.PositionModes.ABSOLUTE) {
            return transition ? this._position.copy() : this._currentPosition.copy();
        } else {
            // has not been tested thoroughly yet, be wary!
            const parent = this.getParent();
            let parentPos = new Vector2();
            if (parent instanceof GameObject) {
                parentPos.set(parent.getGlobalPosition());
            } else {
                const parentRect = parent.getBoundingClientRect();
                parentPos.set(parentRect.left, parentRect.top);
            }

            const rect = this.element.getBoundingClientRect();
            return new Vector2(
                rect.left + this._size.x * this._origin.x,
                rect.top + this._size.y * this._origin.y,
            ).sub(parentPos);
        }
    }

    // set the global opsition of the object
    // not thoroughly tested yet
    setGlobalPosition(x, y) {
        const globalPos = new Vector2(x, y).sub(Game.left, Game.top);
        const diff = globalPos.sub(this.getGlobalPosition());
        this.translate(diff);
        return this;
    }

    setGamePosition() {
        return this.setGlobalPosition();
    }

    // returns position relative to the game container
    // note this only works because the game container is transformed from the corner
    getGlobalPosition() {
        const rect = this.element.getBoundingClientRect();
        return new Vector2(
            rect.left + this._size.x * this._origin.x - Game.left,
            rect.top + this._size.y * this._origin.y - Game.top,
        );
    }

    getGamePosition() {
        return this.getGlobalPosition();
    }

    getBoundingClientRect() {
        return this.element.getBoundingClientRect();
    }

    // translates the object from the current position by x
    translate(x = 0, y = 0) {
        if (x instanceof Object) {
            this.setPosition(this._position.x + x.x, this._position.y + x.y);
        } else {
            this.setPosition(this._position.x + x, this._position.y + y);
        }
        return this;
    }

    // sets the transform style of the element
    // takes a string
    setTransform(transform) {
        this.setStyle('transform', transform);
        return this;
    }
    
    // update transform based on current rotation and scale values
    updateTransform() {
        const transform = `rotateZ(${this._rotation}rad) scale(${this._scale.x}, ${this._scale.y})`;
        this.setTransform(transform);
        return this;
    }

    // set the rotation in radians
    setRotation(angle = this._rotation) {
        this._rotation = angle;
        this.updateTransform();
        return this;
    }

    getRotation() {
        return this._rotation;
    }

    // rotates by a certain angle
    rotate(angle = 0) {
        return this.setRotation(this._rotation + angle);
    }

    // set the scale
    setScale(x = this._scale.x, y = this._scale.y) {
        this._scale.set(x, y);
        this.updateTransform();
        return this;
    }

    getScale() {
        return this._scale.copy();
    }

    // scale by an amount
    scale(x = 0, y = 0) {
        if (x instanceof Object) {
            this.setScale(this._scale.x + x.x, this._scale.y + x.y);
        } else {
            this.setScale(this._scale.x + x, this._scale.y + y);
        }
        return this;
    }

    // set the size of the element, in pixels
    setSize(x = this._size.x, y = this._size.y) {
        this._size.set(x, y);
        this.setStyle('width', this._size.x);
        this.setStyle('height', this._size.y);
        this.setPosition(this._position.x, this._position.y);
        return this;
    }

    autoSize() {
        const rect = this.element.getBoundingClientRect();
        this.setSize(rect.width, rect.height);
        return this;
    }

    getSize() {
        return this._size.copy();
    }

    // the origin is ranges of 0, representing the pivot of the element
    // by default, it is the top left (0,0)
    setOrigin(x = this._origin.x, y = this._origin.y) {
        this._origin.set(x, y);
        this.setPosition(this._position.x, this._position.y);
        return this;
    }

    getOrigin() {
        return this._origin.copy();
    }

    getElement() {
        return this.element;
    }

    setAttribute(key, value) {
        this.element.setAttribute(key, value);
        return this;
    }

    getAttribute(key) {
        return this.element.getAttribute(key);
    }

    setProperty(key, value) {
        this.element[key] = value;
        return this;
    }

    getProperty(key) {
        return this.element[key];
    }

    // style setters
    setStyle(key, value) {
        this.element.style[key] = value;
        return this;
    }

    // style setter helper
    setBackgroundColor(color) {
        this.element.style.backgroundColor = color;
        return this;
    }

    // text content helper
    setText(text) {
        this.element.textContent = text;
        return this;
    }

    set textContent(text) {
        this.setText(text);
    }

    setClass(key, value) {
        this.element.classList.toggle(key, value);
        return this;
    }

    setId(value) {
        this.element.id = value;
        return this;
    }

    setPositionMode(mode) {
        this.positionMode = mode;

        switch (this.positionMode) {
            case GameObject.PositionModes.RELATIVE:
            case GameObject.PositionModes.ABSOLUTE:
                this.setStyle('position', 'absolute')
                break;
            case GameObject.PositionModes.NONE:
            default:
                this.setStyle('position', 'static');
                break;
        }
        this.setPosition(this._position.x, this._position.y);

        return this;
    }

    getParent(elementOnly = false) {
        if (!this.element.parentElement) {
            return;
        }
        if (elementOnly) {
            return this.element.parentElement;
        }
        return this.element.parentElement.gameObject ? this.element.parentElement.gameObject : this.element.parentElement;
    }


    // a getter for getParent
    get parent() {
        return this.getParent();
    }

    // only returns the element, not the gameObject
    get parentElement() {
        return this.getParent(true);
    }

    setParent(parent) {
        // remove from previous parent if there is one
        this.getParent()?.removeChild(this.element);
        
        // append this to the new parent
        parent.appendChild(this.element);

        this.setPosition(this._position.x, this._position.y);
        return this;
    }

    appendChild(child) {
        if (child instanceof GameObject) {
            this.element.appendChild(child.element);
        } else {
            this.element.appendChild(child);
        }
        return this;
    }

    removeChild(child) {
        if (child.parentElement !== this.element) {
            console.error(`can't remove child if the element is not a child`, child);
            return this;
        }
        if (child instanceof GameObject) {
            this.element.removeChild(child.element);
        } else {
            this.element.removeChild(child);
        }
        return this;
    }

    // returns an array of this element's children.
    // if a child element is wrapped with GameObject, it will map to the GameObject instead of the element
    // if this behavior is unwanted, set elementsOnly to true
    getChildren(elementsOnly = false) {
        return Array.from(this.element.children).map((element) => {
            if (element.isGameObject && !elementsOnly) {
                return element.gameObject;
            } else {
                return element;
            }
        })
    }

    addEventListener(eventName, callback) {
        this.element.addEventListener(eventName, callback);
        return this;
    }

    // set the update function for this
    setUpdate(func) {
        this.updateFunction = func;
        return this;
    }

    update(...args) {
        if (this.updateFunction) {
            this.updateFunction(...args);
        }
        if (this.transitionUpdateFunction) {
            this.transitionUpdateFunction(...args);
        }
        return this;
    }

    setTransitionUpdateFunction(func) {
        this.transitionUpdateFunction = func;
        return this;
    }

    destroy() {
        this.isDestroyed = true;
        this.element.parentElement?.removeChild(this.element);
        return this;
    }

    // event emitter helper methods
    on(...args) {
        this.events.on(...args);
        return this;
    }

    off(...args) {
        this.events.off(...args);
        return this;
    }

    once(...args) {
        this.events.once(...args);
        return this;
    }

    trigger(...args) {
        this.events.trigger(...args);
        return this;
    }

    // set the animation / transition speed of the object
    // this affects how it lerps toward the drag position or snap position
    // 1 - moves instantly
    // 0 - doesnt move 
    setTransitionSpeed(speed) {
        this.transitionSpeed = Math.max(0, Math.min(1, speed));
        return this;
    }

    setTransitionEnabled(bool) {
        this.isTransitionEnabled = bool;
        return this;
    }

    addAnimationFunction(func) { 
        this.animationUpdateFunctions.push(func);
        return this;
    }

    static setDefaultContainer(container) {
        this.defaultContainer = container;
    }
}

/**
 * 
 * DraggableGameObject is a GameObject that can be dragged
 * 
 * 
 */
class DraggableGameObject extends GameObject {
    constructor(options = {}) {
        super(options);

        this.snapPositionMap = {};
        this.snapPositions = [];

        this.homeId;
        this.currentId;
        this.targetPosition = new Vector2();
        this.dragPosition = new Vector2();

        this.snapDistance = 100;
        this.homeChangeDistance = 100;

        this.isDragging = false;
        this.isDragEnabled = true;

        this.xAxisLocked = false;
        this.yAxisLocked = false;
        
        this.addEventListener('mousedown', (e) => {
            if (this.isDragEnabled) {
                this.isDragging = true;
            }
            this.dragPosition.set(this.getPosition());
            this.targetPosition.set(this.getPosition());
            this.events.trigger('dragstart', {object: this, position: this.dragPosition.copy(), id: this.homeId});
        });
        window.addEventListener('mousemove', (e) => {
            if (!this.isDragging) {
                return;
            }
            const gameRect = GameObject.defaultContainer.getBoundingClientRect();

            this.dragPosition.set(
                !this.xAxisLocked ? e.clientX - gameRect.x : this.getPosition().x, 
                !this.yAxisLocked ? e.clientY - gameRect.y : this.getPosition().y
            );
            const closestId = this.getClosestSnapPositionId();
            const closestPos = this.getSnapPosition(closestId);
            
            if (closestPos) {

                const dist = closestPos.distanceTo(this.dragPosition);
                if (dist < this.snapDistance) {
                    this.targetPosition.set(closestPos);
                } else {
                    this.targetPosition.set(this.dragPosition);
                }

                if (dist < this.homeChangeDistance) {
                    this.currentId = closestId;
                } else {
                    this.currentId = undefined;
                }

            } else {
                this.targetPosition.set(this.dragPosition);
            }

            // sets the position to the target position
            this.setPosition(this.targetPosition)
            
            this.events.trigger('dragging', {object: this, position: this.dragPosition.copy(), id: this.currentId});
        });
        window.addEventListener('mouseup', (e) => {
            if (!this.isDragging) {
                return;
            }
            this.isDragging = false;
            const lastId = this.homeId;
            if (this.currentId) {
                this.homeId = this.currentId;
            }
            this.setPosition(this.getHomePosition());
            this.events.trigger('dragend', {object: this, position: this.dragPosition.copy(), id: this.homeId, lastId});
        });

    }

    // add a snap position with an id
    addSnapPosition(id, x, y) {
        if (this.getSnapPosition(id)) {
            console.error(`snap position with id ${id} already exists`);
            return;
        }
        const pos = new Vector2(x, y);
        this.snapPositionMap[id] = pos;
        this.snapPositions.push({
            pos,
            id
        });
        return this;
    }

    setSnapPosition(id, x, y) {
        if (this.getSnapPosition(id)) {
            this.snapPositionMap[id].set(x, y);
        } else {
            this.addSnapPosition(id, x, y);
        }
        
        if (this.getHomeId() === id) {
            this.setPosition(this.getHomePosition());
        }
        return this;
    }

    getSnapPosition(id) {
        return this.snapPositionMap[id];
    }

    getClosestSnapPosition() {
        const closestId = this.getClosestSnapPositionId();
        return this.snapPositionMap[closestId];
    }

    getClosestSnapPositionId() {
        let closest;
        let closestDist;
        for (const {id, pos} of this.snapPositions) {
            const dist = this._position.distanceTo(pos);
            if (!closest || dist < closestDist) {
                closest = id;
                closestDist = dist;
            }
        }
        return closest;
    }

    clearSnapPositions() {
        this.snapPositionMap = {}
        this.snapPositions = [];
        return this;
    }

    setSnapDistance(d) {
        this.snapDistance = d;
        return this;
    }

    setHomeChangeDistance(d) {
        this.homeChangeDistance = d;
        return this;
    }

    setHomeId(id) {
        this.homeId = id;
        this.events.trigger('homechange', {object: this, id: this.homeId});
        this.setPosition(this.getHomePosition());
        return this;
    }

    getHomeId() {
        return this.homeId;
    }

    getHomePosition() {
        return this.snapPositionMap[this.getHomeId()];
    }

    setXAxisLock(bool) {
        this.xAxisLocked = bool;
        return this;
    }

    setYAxisLock(bool) {
        this.yAxisLocked = bool;
        return this;
    }

    

    setDragEnabled(bool) {
        this.isDragEnabled = bool;
        return this;
    }

    // get the percentage from the current dragPosition to the specified id position
    percentTo(id) {
        const targetPos = this.snapPositionMap[id];
        const homePos = this.snapPositionMap[this.homeId];
        if (!targetPos || !homePos) {
            return;
        }

        const percent = Vector2.closestPointPercent(homePos, targetPos, this.dragPosition);
        return percent;
    }
}




class ButtonGameObject extends GameObject {
    constructor(options = {}) {
        super(options);

        ButtonGameObject.init();

        this.clickSound = options.clickSound || ButtonGameObject.clickSound;

        // default settings for convenience
        this.setOrigin(.5, .5);
        this.setSize(50, 30);
        this.setText('button');
        // this.setBackgroundColor('lightgray');

        this.clickCallback;

        const handleClick = (e) => {
            if (this.clickSound) {
                this.clickSound.play();
            }
            if (this.clickCallback) {
                this.clickCallback(e);
            }
        }

        this.isActive = false;
        this.isHover = false;

        this.setStyle('backgroundRepeat', 'no-repeat');
        this.setStyle('backgroundSize', '100% 100%');

        this.defaultStyle = {
            // backgroundColor: 'lightgray'
            backgroundImage: 'url("./assets/button-wide.png")'
        };

        this.hoverStyle = {
            // backgroundColor: 'linen'
            backgroundImage: 'url("./assets/button-wide-hover.png")'
        };

        this.activeStyle = {
            // backgroundColor: 'white'
            backgroundImage: 'url("./assets/button-wide-active.png")'
        };

        const handleOver = (e) => {
            this.isHover = true;
            Object.assign(this.element.style, this.hoverStyle);
        }

        const handleOut = (e) => {
            if (!this.isActive) {
                Object.assign(this.element.style, this.defaultStyle);
            }
            this.isHover = false;
        }

        const handleDown = (e) => {
            if (this.isHover) {
                this.isActive = true;
                Object.assign(this.element.style, this.activeStyle);
            }
        }

        const handleUp = (e) => {
            this.isActive = false;
            if (this.isHover) {
                Object.assign(this.element.style, this.hoverStyle);
            } else {
                Object.assign(this.element.style, this.defaultStyle);
            }
        }
        
        this.addEventListener('click', handleClick);

        this.addEventListener('mouseover', handleOver);

        this.addEventListener('mouseout', handleOut);

        this.addEventListener('mousedown', handleDown);

        window.addEventListener('mouseup', handleUp);
    }

    setClickCallback(callback) {
        this.clickCallback = callback;
        return this;
    }

    onClick(callback) {
        return this.setClickCallback(callback);
    }

    setDefaultStyle(style = {}, replace = false) {
        if (replace) {
            this.defaultStyle = style;
        } else {
            Object.assign(this.defaultStyle, style);
        }
        return this;
    }

    setHoverStyle(style = {}, replace = false) {
        if (replace) {
            this.hoverStyle = style;
        } else {
            Object.assign(this.hoverStyle, style);
        }
        return this;
    }

    setActiveStyle(style = {}, replace = false) {
        if (replace) {
            this.activeStyle = style;
        } else {
            Object.assign(this.activeStyle, style);
        }
        return this;
    }

    static init() {
        if (!this.initialized) {

            this.clickSound = new Sound('./assets/sounds/buttonclick.wav');

            this.initialized = true;
        }
    }
}





class ImageGameObject extends GameObject {
    constructor(options = {}) {
        options.tag = 'img';
        super(options);

        this.setAttribute('src', options.src);
    }
}


// simple sprite sheet handler
// assumes each sprite has the same dimensions
// for objects that have multiple sprites
class SpriteGameObject extends GameObject {
    constructor(options = {}) {
        super(options);
            
        this.spriteSize = new Vector2(options.spriteSize);
        this.imageSize = new Vector2(options.imageSize);
        this.frames = new Vector2(options.frames) || (options.imageSize ? new Vector2(this.imageSize.x / this.spriteSize.x, this.imageSize.y / this.spriteSize.y) : undefined);
        
        this.setFrame(options.frame || 0);
        this.setSize(this.spriteSize);

        if (!options.src) {
            console.error('sprite game object needs a src url!')
        }

        this.setStyle('backgroundImage', `url(${options.src})`);

        if (this.imageSize) {
            this.setStyle('backgroundSize', `${this.imageSize.x / this.spriteSize.x * 100}% ${this.imageSize.y / this.spriteSize.y * 100}%`);
        } else {
            this.setStyle('backgroundSize', 'cover');
        }

        this.isAnimating = false;
        this.animationDuration = this.frames ? (this.frames.x + this.frames.y) * 200 : 5000;
        this.animationFrame = this.getFrame();
        this.animationTimer = 0;
        this.lastFrame = this.animationFrame;

        this.animationUpdate = (delta) => {

            if (this.frames && this.isAnimating) {
                
                this.animationFrame = Math.floor(this.animationTimer / this.animationDuration * this.frames.x);
                if (this.animationFrame !== this.lastFrame) {
                    this.setFrame(this.animationFrame);
                    this.lastFrame = this.animationFrame;
                }

                if (this.animationTimer >= this.animationDuration) {
                    this.animationTimer -= this.animationDuration;
                }
                this.animationTimer += delta;
            }

        }

        this.addAnimationFunction(this.animationUpdate);

    }

    setFrame(frame) {
        this._frame = frame;
        const xOffset = -this._frame * this.spriteSize.x * (this._size.x / this.spriteSize.x);
        this.setStyle('backgroundPosition', `${xOffset}px ${0}px`);
        this.animationFrame = this._frame;
        return this;
    }

    getFrame() {
        return this._frame || 0;
    }

    setSize(x, y) {
        super.setSize(x, y);
        if (this.spriteSize) {
            this.setFrame(this._frame);
        }
        return this;
    }
    
    setAutoAnimation(bool) {
        this.isAnimating = bool;
        return this;
    }
}