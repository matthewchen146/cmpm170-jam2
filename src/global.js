// this file holds super global variables

/**
 * @param {HTMLElement} container
 * @param {number} width
 * @param {number} height
 * @param {number} left
 * @param {number} top
 * @param {number} x
 * @param {number} y
 */
const Game = {};

function initializeGlobal() {

    const gameContainer = document.querySelector('#game-container');
    
    Game.container = gameContainer;

    // updates the game sizes and positions
    Game.updateRect = () => {
        const rect = gameContainer.getBoundingClientRect();
    
        Game.width = rect.width;
        Game.height = rect.height;
        Game.centerX = Game.width / 2;
        Game.centerY = Game.height / 2;
        Game.left = rect.left;
        Game.top = rect.top;
        Game.x = rect.x;
        Game.y = rect.y;
    }

    Game.updateRect();    
    window.addEventListener('resize', (e) => {
        Game.updateRect();
    });

    Game.eventEmitter = new EventEmitter();

    Game.isWindowFocused = document.hasFocus();
    window.addEventListener('focus', () => {    
        Game.isWindowFocused = true;
        Game.eventEmitter.trigger('focus');
    });
    window.addEventListener('blur', () => {
        Game.isWindowFocused = false;
        Game.eventEmitter.trigger('blur');
    })

}

