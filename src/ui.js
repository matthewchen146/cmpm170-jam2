// handles dragging input for GameObjects
class DragHandler {
    constructor(gameObject) {
        this.gameObject = gameObject;
    
        this.isDragging = false;

        this.homePosition = {x: 0, y: 0};
        this.targetPosition = {x: 0, y: 0};

        this.handleDragStart = (e) => {};
        
        this.handleDragMove = (e) => {};
        
        this.handleDragEnd = (e) => {};
    
        this.element.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.handleDragStart(e);
        });
        window.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.handleDragMove(this, e);
            }
        });
        window.addEventListener('mouseup', (e) => {
            this.isDragging = false;
            this.handleDragEnd(e);
        });
    }

    setDragStartCallback(func) {
        this.handleDragStart = func;
        return this;
    }

    setDragCallback(func) {
        this.handleDragMove = func;
        return this;
    }

    setDragEndCallback(func) {
        this.handleDragEnd = func;
        return this;
    }

    setHomePosition(x, y) {
        this.homePosition.x = x;
        this.homePosition.y = y;
        return this;
    }

    setTargetPosition(x, y) {
        this.targetPosition.x = x;
        this.targetPosition.y = y;
        return this;
    }
}


// handle ingredients drag up into cutting board
// const ingredients = document.querySelector('#ingredients');

// const ingredientsHandler = new DragHandler(ingredients)
//     .setDragCallback((e) => {
//         // handler.element.style.top = e.clientY;
//         // handler.element.style.bottom = 700 - e.clientY;
//     })