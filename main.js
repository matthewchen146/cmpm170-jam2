
// sets the GameObject static default container to the selected container below
GameObject.defaultContainer = document.querySelector('#game-object-container');

// gameContainer information, for easy access
const gameContainer = {
    element: GameObject.defaultContainer,
    rect: GameObject.defaultContainer.getBoundingClientRect()
}
Game.centerX = gameContainer.rect.width / 2;
gameContainer.centerY = gameContainer.rect.height / 2;

const openBook = new Audio("https://www.fesliyanstudios.com/play-mp3/5804");
const closeBook = new Audio("https://www.fesliyanstudios.com/play-mp3/5765")
const flipPage = new Audio("https://www.fesliyanstudios.com/play-mp3/5477");

const audio1 = new Audio("assets/sounds/512131__beezlefm__coins-small-sound.wav")

// use this function to load things like assets
// it is asynchronous so it can use Promises
async function load() {

}

let calendar;
let pot;
let inventory;
let catChef;
let uiObjects;
let witchCat;
let apples;
let potion;
const eventEmitter = new EventEmitter();

let selectedRecipes = [];
let selectedRecipe;
let possibleIngredients = {};

const craftSlots = {
    crafta: undefined,
    craftb: undefined
}

/** 
 * handles adding an ingredient to the GAME
 * returns {
 * 
 * draggableGameObject, upgradeButton, levelLabel, upgradeIcon,
 * 
 * }
 */
function addIngredient(ingredient) {
    const data = uiObjects.addIngredient(ingredient);
    const {draggableGameObject, upgradeButton} = data;

    // add upgrade button functionality
    upgradeButton.onClick(() => {

        // increase the ingredient level
        ingredient.levelUp();

    });

    // add crafting functionality
    draggableGameObject.on('dragend', ({object, id, lastId}) => {
        // id references the snap id
        if (id === 'crafta' || id === 'craftb') {
            // remove self from old craft slot
            if (lastId !== 'main' && craftSlots[lastId] === ingredient) {
                craftSlots[lastId] = undefined;
            }

            // replace craft slot in new id
            if (craftSlots[id]) {
                craftSlots[id].draggableGameObject.setHomeId('main');
            }
            craftSlots[id] = ingredient;
        } else {
            // id = main
            if (lastId !== 'main' && craftSlots[lastId] === ingredient) {
                craftSlots[lastId] = undefined;
            }
        }
        
    });

    return data;
}

function getIngredient(id) {
    return possibleIngredients[id];
}


let availableRecipes = {};

function getRecipe(id) {
    return availableRecipes[id];
}

// handles adding a recipe to the GAME
function addRecipe(recipe) {
    const {selectButton} = uiObjects.recipePageData.addRecipe(recipe);
    recipe.selectButton = selectButton;

    selectButton.onClick(() => {
        if (recipe === selectedRecipe) {
            return;
        }

        openBook.play();

        catChef.setRecipe(recipe, inventory);

        if (selectedRecipe) {
            // reset previous recipe button's state
            selectedRecipe.selectButton.setText('Cook');    
        }

        // set the current recipe button's state
        selectButton.setText('Cooking');
        selectedRecipe = recipe;
    })
}


// use this function to initialize anything
function preUpdate() {

    calendar = new Calendar({month: 3});

    uiObjects = initializeUI();

    // creates the ingredients
    possibleIngredients['apple'] = new IngredientData('apple', {
        name: 'Apple', 
        season: 'spring',
        seasonBuff: [.5, 2, 1.5, 1], // winter spring summer fall
        img: './assets/apple.png'
    });
    possibleIngredients['pumpkin'] = new IngredientData('pumpkin', {
        name: 'Pumpkin', 
        season: 'fall',
        seasonBuff: [1.5, 1, .5, 2],
        img: './assets/pumpkin.png'
    });
    possibleIngredients['corn'] = new IngredientData('corn', {
        name: 'Corn', 
        season: 'summer',
        seasonBuff: [1, .5, 2, 1.5],
        img: './assets/corn.png'
    });
    possibleIngredients['berries'] = new IngredientData('berries', {
        name: 'Berries', 
        season: 'winter',
        seasonBuff: [2, 1.5, 1, .5],
        img: './assets/berries.png'
    });

    // store ingredient map statically to IngredientData
    IngredientData.possibleIngredients = possibleIngredients;

    // adds the ingredients
    Object.entries(possibleIngredients).forEach(([id, ingredient]) => {

        addIngredient(ingredient);

    })
    

    // create recipes
    availableRecipes['applejuice'] = new RecipeData('applejuice', { apple: 1 }, { 
        name: 'Apple Juice' 
    });
    availableRecipes['pumpkinpie'] = new RecipeData('pumpkinpie', { pumpkin: 1 }, { 
        name: 'Pumpkin Pie',
        img: './assets/recipes/pumpkin-pie.png'
    });

    Object.entries(availableRecipes).forEach(([id, recipe]) => {
        
        addRecipe(recipe);

    })
    
    
    
    // inventory = new InventoryData(getIngredient('apple'));
    catChef = new ChefData({
        img: './assets/cat-head.png',
        costFunction: (level) => {
            return Math.pow(10, level);
        }
    });

    catChef.setRecipe(getRecipe('applejuice'), inventory);

    // detect a season change, and modify the current season
    calendar.events.on('seasonchange', ({season}) => {
        IngredientData.season = season;
        // console.log('season changed', calendar.getSeasonName(season));
    });

    // detect a month change
    calendar.events.on('monthchange', ({month, season}) => {
        
        // console.log('month changed', calendar.getMonthName(month));
    });

    potion = new PotionData({
        img: './assets/potion.png',
        costFunction: (level) => {
            return Math.pow(10, level);
        }
    });

    catChef.setPotion(potion);

    // add cat and potion upgrade
    {
        const {upgradeButton} = uiObjects.upgradePageData.addUpgrade(catChef);
        upgradeButton.onClick(() => {
            catChef.levelUp();
        })
    }
    
    {
        const {upgradeButton} = uiObjects.upgradePageData.addUpgrade(potion);
        upgradeButton.onClick(() => {
            potion.levelUp();
        })
    }
    

    // catshier = new CatnipCollector();


    // uiObjects.currencyLabel = new GameObject({element: document.querySelector('#currency')});


    // create the witch cat, stirring the pot
    witchCat = new ImageGameObject({
        src: './assets/witch-cat.gif'
    })
        .setSize(491, 609)
        .setOrigin(.46, 1) // .46 is a good value to center the pot horizontally
        .setPosition(Game.centerX, Game.height)
    
}


// use this function as the main game loop
// delta is the time since the last frame, in ms
// time is the total time the game has been running, in ms
function update(delta, time) {

    // cat cooks and returns the currency earned, can take a recipe argument and season argument
    // if no season argument, the season is determined by the season set in STATIC IngredientData.season
    const rate = catChef.cook(); // per second

    uiObjects.currencyRateLabel.textContent = `${rate} cn/s`;

    catChef.currency += rate * delta * .001;

    // set currency text in currency label
    uiObjects.currencyLabel.textContent = `${catChef.currency.toFixed(2)} catnip`;

    // update the calendar
    calendar.update(delta);
}


// set up engine with the appropriate functions
// see ./src/gameEngine.js for more information
const engine = new GameEngine({
    load: load,
    preUpdate: preUpdate,
    update: update,
    context: this
})

GameObject.defaultEngine = engine;

// start the engine
engine.start();
