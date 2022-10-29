
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


// use this function to initialize anything
function preUpdate() {

    // creates an image object, which is an extension of gameobject
    // takse a src option, which is the path to the image
    const pot = new Image({src: './assets/pot.png'})
        .setStyle('width', '300px')
        .setStyle('height', '300px')
        .setPosition(gameContainer.centerX - 150, 400)
}


// use this function as the main game loop
// delta is the time since the last frame, in ms
// time is the total time the game has been running, in ms
function update(delta, time) {

    // to test this works, here is a line that logs the delta and game time
    console.log(delta, (time / 1000).toFixed(1))

}


// set up engine with the appropriate functions
// see ./src/gameEngine.js for more information
const engine = new GameEngine({
    load: load,
    preUpdate: preUpdate,
    update: update
})

// start the engine
engine.start();