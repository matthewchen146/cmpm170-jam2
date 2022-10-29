
/**
 * 2d vector class
 * for math and ease of use methods
 * function similarly to crisp-game-lib vectors
 * 
 * the constructor can have numbers: new Vector2(x, y) || or objects and vectors: new Vector2({x: 0, y: 0}) 
 * ex: new Vector2(new Vector2(2, 2));
 * ex: const vec = new Vector2(6, 29);
 *     const vecCopy = new Vector2(vec);
 */
class Vector2 {
    constructor(x = 0, y = 0) {
        this.set(x, y);
    }

    // set the vector
    set(x, y) {
        if (x instanceof Object) {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x;
            this.y = y;
        }
        return this;
    }

    // returns copy of this vector
    copy() {
        return new Vector2(this);
    }

    // basic math operations
    add(x, y) {
        if (x instanceof Object) {
            this.x += x.x;
            this.y += x.y;
        } else {
            this.x += x;
            this.y += y;
        }
        return this;
    }

    sub(x, y) {
        if (x instanceof Object) {
            this.x -= x.x;
            this.y -= x.y;
        } else {
            this.x -= x;
            this.y -= y;
        }
        return this;
    }

    mul(v) {
        this.x *= v;
        this.y *= v;
        return this;
    }

    div(v) {
        this.x /= v;
        this.y /= v;
        return this;
    }

    // get the length / magnitude of the vector
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    get length() {
        return this.magnitude();
    }

    distanceToVector({x, y}) {
        const xDif = this.x - x;
        const yDif = this.y - y;
        const dist = Math.sqrt(xDif * xDif + yDif * yDif);
        return dist;
    }

    distanceTo(x, y) {
        if (x instanceof Object) {
            return this.distanceToVector(x);
        } else {
            return this.distanceToVector({x, y});
        }
    }

    // normalize the vector to a length of 1
    normalize() {
        const mag = this.magnitude();
        this.div(mag, mag);
        return this;
    }
}

// function for easyily creating new vectors
function vec2(x, y) {
    return new Vector2(x, y);
}
