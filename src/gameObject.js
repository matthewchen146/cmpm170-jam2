

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
        this._position = new Vector2();
        this._size = new Vector2();
        this._origin = new Vector2();

        // rotation in radians
        this._rotation = 0;

        // scale, does not affect the actual size
        this._scale = new Vector2(1, 1);

        this.positionMode = GameObject.PositionModes.ABSOLUTE;

        this.parent;
        this.element = options.element || (options.tag ? document.createElement(options.tag) : undefined) || document.createElement('div');
        
        // check if the element is in the document already
        if (this.element.isConnected) {
            this.parent = options.parent || options.container;
            
            if (this.parent) {
                this.setParent(this.parent);
            } else {
                this.parent = this.element.parentElement;
            }

            // convert client rect into absolute positions
            const rect = this.element.getBoundingClientRect();
            this.setSize(rect.width, rect.height);
        } else {
            this.parent = options.parent || options.container || GameObject.defaultContainer;

            if (this.parent) {
                this.setParent(this.parent);
            }

            this.setPosition(this._position.x, this._position.y);
            this.setSize(this._size.x, this._size.y);
            this.setOrigin(this._origin.x, this._origin.y);

            this.setPositionMode(options.positionMode || GameObject.PositionModes.ABSOLUTE);
        }

        this.updateFunction;

        this.engine = options.engine || GameObject.defaultEngine;
        if (this.engine) {
            this.engine.addGameObject(this);
        }

        this.isDestroyed = false;
    }

    // set the position of the element.
    setPosition(x = this._position.x, y = this._position.y) {
        this._position.set(x, y);
        let absoluteX = this._position.x - this._origin.x * this._size.x;
        let absoluteY = this._position.y - this._origin.y * this._size.y;

        // if (this.positionMode === GameObject.PositionModes.RELATIVE) {
        //     if (!this.parent) {
        //         this.parent = this.element.parent;
        //     }
        //     const parentRect = this.parent.getBoundingClientRect();
        //     absoluteX += parentRect.left;
        //     absoluteY += parentRect.top;
        // }

        this.setStyle('left', absoluteX);
        this.setStyle('top', absoluteY);
        return this;
    }

    getPosition() {
        return this._position.copy();
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

    setStyle(key, value) {
        this.element.style[key] = value;
        return this;
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
                this.setStyle('position', undefined);
                break;
        }
        this.setPosition(this._position.x, this._position.y);

        return this;
    }

    getParent() {
        return this.parent;
    }

    setParent(parent) {
        if (this.parent && this.element.parentElement === this.parent) {
            this.parent.removeChild(this.element);
        }
        if (parent instanceof GameObject) {
            this.parent = parent.element;
        } else {
            this.parent = parent;
        }
        this.parent.appendChild(this.element);
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
        if (child.parent !== this.element) {
            console.log(`can't remove child if the element is not a child`, child);
            return this;
        }
        if (child instanceof GameObject) {
            this.element.removeChild(child.element);
        } else {
            this.element.removeChild(child);
        }
        return this;
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
        if (this.animationUpdateFunction) {
            this.animationUpdateFunction(...args);
        }
        return this;
    }

    setAnimationUpdateFunction(func) {
        this.animationUpdateFunction = func;
        return this;
    }

    destroy() {
        this.isDestroyed = true;
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

        this.transitionSpeed = .1;

        this.isDragging = false;
        this.isDragEnabled = true;

        this.xAxisLocked = false;
        this.yAxisLocked = false;
        
        this.element.draggable = false;
        this.addEventListener('mousedown', (e) => {
            if (this.isDragEnabled) {
                this.isDragging = true;
            }
            this.dragPosition.set(this._position);
            this.targetPosition.set(this._position);
        });
        window.addEventListener('mousemove', (e) => {
            if (!this.isDragging) {
                return;
            }
            const gameRect = GameObject.defaultContainer.getBoundingClientRect();

            this.dragPosition.set(
                !this.xAxisLocked ? e.clientX - gameRect.x : this._position.x, 
                !this.yAxisLocked ? e.clientY - gameRect.y : this._position.y
            );
            const closestId = this.getClosestSnapPositionId();
            const closestPos = this.getSnapPosition(closestId);
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
        });
        window.addEventListener('mouseup', (e) => {
            this.isDragging = false;
            if (this.currentId) {
                this.homeId = this.currentId;
            }
        });

        this.setAnimationUpdateFunction(() => {

            if (this.isDragging && this.isDragEnabled) {
                this.translate(this.targetPosition.copy().sub(this._position).mul(this.transitionSpeed));
            } else {
                if (this.homeId) {
                    const targetPos = this.getSnapPosition(this.homeId);
                    this.translate(targetPos.copy().sub(this._position).mul(this.transitionSpeed));
                }   
            }
            

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
        this.snapPositionMap[id]?.set(x, y);
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

    setHomeSnapPositionId(id) {
        this.homeId = id;
        return this;
    }

    setXAxisLock(bool) {
        this.xAxisLocked = bool;
        return this;
    }

    setYAxisLock(bool) {
        this.yAxisLocked = bool;
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

    setDragEnabled(bool) {
        this.isDragEnabled = bool;
        return this;
    }
}


class ImageGameObject extends GameObject {
    constructor(options = {}) {
        options.tag = 'img';
        super(options);

        this.addEventListener('dragstart', (e) => {e.preventDefault();});
        this.setAttribute('src', options.src);
    }
}
