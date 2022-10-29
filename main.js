
// sets the GameObject static default container to the selected container below
GameObject.defaultContainer = document.querySelector('#game-object-container');

// gameContainer information, for easy access
const gameContainer = {
    element: GameObject.defaultContainer,
    rect: GameObject.defaultContainer.getBoundingClientRect()
}
gameContainer.centerX = gameContainer.rect.width / 2;
gameContainer.centerY = gameContainer.rect.height / 2;


// use this function to load things like assets
// it is asynchronous so it can use Promises
async function load() {

}

let pot;

// use this function to initialize anything
function preUpdate() {

    // creates an image object, which is an extension of gameobject
    // takse a src option, which is the path to the image
    pot = new Image({src: './assets/pot.png'})
        .setSize(200,200)
        .setPosition(gameContainer.centerX, 550)
        .setOrigin(.5, .5)
}


// use this function as the main game loop
// delta is the time since the last frame, in ms
// time is the total time the game has been running, in ms
function update(delta, time) {

    // to test this works, here is a line that logs the delta and game time
    // console.log(delta, (time / 1000).toFixed(1))

    // more test code
    pot.setPosition(gameContainer.centerX + Math.sin(time * .005) * 5)
        .setScale(Math.cos(time * .005))
        .rotate(.05)
}


// set up engine with the appropriate functions
// see ./src/gameEngine.js for more information
const engine = new GameEngine({
    load: load,
    preUpdate: preUpdate,
    update: update,
    context: this
})

// start the engine
engine.start();