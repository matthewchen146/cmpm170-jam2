

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

    constructor(options = {}) {

        this.element = options.element || (options.tag ? document.createElement(options.tag) : undefined) || document.createElement('div');

        this.parent = options.parent || options.container || GameObject.defaultContainer;

        if (!this.element.parent && this.parent) {
            this.parent.appendChild(this.element);
        }

        this._position = {x: 0, y: 0};
        this._size = {w: 0, h: 0};
        this._origin = {x: 0, y: 0};

        // rotation in radians
        this._rotation = 0;

        // scale, does not affect the actual size
        this._scale = {x: 1, y: 1};

        this.setPosition(this._position.x, this._position.y);
        this.setSize(this._size.w, this._size.h);
        this.setOrigin(this._origin.x, this._origin.y);

        this.positionMode;
        this.setPositionMode(options.positionMode || GameObject.PositionModes.ABSOLUTE);
    }

    // set the position of the element.
    setPosition(x = this._position.x, y = this._position.y) {
        this._position.x = x;
        this._position.y = y;
        let absoluteX = this._position.x - this._origin.x * this._size.w;
        let absoluteY = this._position.y - this._origin.y * this._size.h;

        if (this.positionMode === GameObject.PositionModes.RELATIVE) {
            if (!this.parent) {
                this.parent = this.element.parent;
            }
            const parentRect = this.parent.getBoundingClientRect();
            absoluteX += parentRect.left;
            absoluteY += parentRect.top;
        }

        this.setStyle('left', absoluteX);
        this.setStyle('top', absoluteY);
        return this;
    }

    getPosition() {
        return this._position;
    }

    // translates the object from the current position by x
    translate(x = 0, y = 0) {
        this.setPosition(this._position.x + x, this._position.y + y);
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
        this._scale.x = x;
        this._scale.y = y;
        this.updateTransform();
        return this;
    }

    getScale() {
        return this._scale;
    }

    // scale by an amount
    scale(x = 0, y = 0) {
        return this.setScale(this._scale.x + x, this._scale.y + y);
    }

    // set the size of the element, in pixels
    setSize(w = this._size.w, h = this._size.h) {
        this._size.w = w;
        this._size.h = h;
        this.setStyle('width', this._size.w);
        this.setStyle('height', this._size.h);
        this.setPosition(this._position.x, this._position.y);
        return this;
    }

    getSize() {
        return this._size;
    }

    // the origin is ranges of 0, representing the pivot of the element
    // by default, it is the top left (0,0)
    setOrigin(x = this._origin.x, y = this._origin.y) {
        this._origin.x = x;
        this._origin.y = y;
        this.setPosition(this._position.x, this._position.y);
        return this;
    }

    getOrigin() {
        return this._origin;
    }

    getElement() {
        return this.element;
    }

    setAttribute(key, value) {
        this.element.setAttribute(key, value);
        return this;
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
        if (this.parent) {
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


    static setDefaultContainer(container) {
        this.defaultContainer = container;
    }
}

class Image extends GameObject {
    constructor(options = {}) {
        options.tag = 'img';
        super(options);

        this.setAttribute('src', options.src);
    }
}
