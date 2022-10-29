

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
        this.setPosition(this._position.x, this._position.y);

        this.positionMode;
        this.setPositionMode(options.positionMode || GameObject.PositionModes.ABSOLUTE);
    }

    get position() {
        return this._position;
    }

    set position({x, y}) {
        this.setPosition(x, y)
    }

    setPosition(x, y) {
        this._position.x = x;
        this._position.y = y;
        let absoluteX = this._position.x;
        let absoluteY = this._position.y;

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
