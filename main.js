
// sets the GameObject static default container to the selected container below
GameObject.defaultContainer = document.querySelector('#game-object-container');


const openBook = new Sound("https://www.fesliyanstudios.com/play-mp3/5804");
const closeBook = new Sound("https://www.fesliyanstudios.com/play-mp3/5765")
const flipPage = new Sound("https://www.fesliyanstudios.com/play-mp3/5477");

const audio1 = new Sound("assets/sounds/512131__beezlefm__coins-small-sound.wav")

// const bgm = new Audio();
let bgm;

// use this function to load things like assets
// it is asynchronous so it can use Promises
async function load() {

}

let calendar;

let catChef;
let uiObjects;

let witchCat;

let potion;

const eventEmitter = new EventEmitter();

let selectedRecipes = [];
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

        if (catChef.currency > ingredient.getCost()) {

            catChef.currency -= ingredient.getCost();

            // increase the ingredient level
            ingredient.levelUp();
        }

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


let possibleRecipes = {};

function getRecipe(id) {
    return possibleRecipes[id];
}

// handles adding a recipe to the GAME
function addRecipe(recipe) {
    const {selectButton} = uiObjects.recipePageData.addRecipe(recipe);
    recipe.selectButton = selectButton;

    selectButton.onClick(() => {
        if (recipe === catChef.getRecipe()) {
            return;
        }

        openBook.play();

        if (catChef.getRecipe()) {
            // reset previous recipe button's state
            catChef.getRecipe().selectButton.setText('Cook');    
        }

        catChef.setRecipe(recipe);

        // set the current recipe button's state
        selectButton.setText('Cooking');
    })
}

function createRecipe(id, ingredients, options) {
    possibleRecipes[id] = new RecipeData(id, ingredients, options);
    return possibleRecipes[id];
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
        img: './assets/apple.png',

        // cost function for ingredients
        costFunction: (level) => { return level * Math.pow(10, level) + 200 * level; },

        // base value / multiplier for the ingredient
        baseMultiplier: 1
    });
    possibleIngredients['pumpkin'] = new IngredientData('pumpkin', {
        name: 'Pumpkin', 
        season: 'fall',
        seasonBuff: [1.5, 1, .5, 2],
        img: './assets/pumpkin.png',

        costFunction: (level) => { return level * Math.pow(10, level) + 200 * level; },
        baseMultiplier: 1
    });
    possibleIngredients['corn'] = new IngredientData('corn', {
        name: 'Corn', 
        season: 'summer',
        seasonBuff: [1, .5, 2, 1.5],
        img: './assets/corn.png',

        costFunction: (level) => { return level * Math.pow(10, level) + 200 * level; },
        baseMultiplier: 1
    });
    possibleIngredients['berries'] = new IngredientData('berries', {
        name: 'Berries', 
        season: 'winter',
        seasonBuff: [2, 1.5, 1, .5],
        img: './assets/berries.png',

        costFunction: (level) => { return level * Math.pow(10, level) + 200 * level; },
        baseMultiplier: 1
    });

    // store ingredient map statically to IngredientData
    IngredientData.possibleIngredients = possibleIngredients;

    // adds the ingredients
    Object.entries(possibleIngredients).forEach(([id, ingredient]) => {

        addIngredient(ingredient);

    })
    
    // read raw recipes from recipes.js and create recipes
    Object.entries(rawRecipes).forEach(([id, {ingredients, name, img, isKnown, value}]) => {
        const recipe = createRecipe(id, ingredients, { name, img, isKnown, value });
        if (recipe.isKnown) {
            addRecipe(recipe);
        }
    })
    
    
    // create the cat chef
    catChef = new ChefData({
        img: './assets/cat-head.png',
        costFunction: (level) => {
            return Math.pow(10, level) + level * 1000;
        },

        // modify the multiplier of the catchef
        productionMultiplier: 1
    });

    
    // initial recipe that is being cooked
    // optional
    const startRecipe = getRecipe('caramelapple');
    if (startRecipe) {
        catChef.setRecipe(startRecipe);
        startRecipe.selectButton?.setText('Cooking');
    }
    


    potion = new PotionData({
        img: './assets/potion.png',
        costFunction: (level) => {
            return Math.pow(10, level) + level * 1000;
        },

        // set the base multiplier of the potion
        baseMultiplier: 10
    });

    catChef.setPotion(potion);

    // add cat and potion upgrade
    {
        const {upgradeButton} = uiObjects.upgradePageData.addUpgrade(catChef);
        upgradeButton.onClick(() => {

            if (catChef.currency > catChef.getCost()) {

                catChef.currency -= catChef.getCost();
                catChef.levelUp();

            }
            
        })
    }
    
    {
        const {upgradeButton} = uiObjects.upgradePageData.addUpgrade(potion);
        upgradeButton.onClick(() => {
            if (catChef.currency > potion.getCost()) {

                catChef.currency -= potion.getCost();
                potion.levelUp();

            }
        })
    }
    

    // clear the craft slot's references when the cutting board is dragged
    uiObjects.ingredientsDragger.on('dragstart', () => {
        craftSlots.crafta = undefined;
        craftSlots.craftb = undefined;
    })

    // setup craft button and crafting
    uiObjects.craftButton.onClick(() => {

        const ingredients = {}
        
        let count = 0;
        // add initial ingredients
        if (craftSlots.crafta) {
            const {id} = craftSlots.crafta;
            ingredients[id] = 1;
            count += 1;
        }
        if (craftSlots.craftb) {
            const {id} = craftSlots.craftb;
            ingredients[id] = 1;
            count += 1;
        }

        // console.log(ingredients)

        if (count <= 0) {
            console.log('no ingredients set!');
            return;
        }

        // find a recipe in possible recipes that has the same ingredients
        let foundRecipe;
        for (const recipe of Object.values(possibleRecipes)) {
            if (!recipe.isKnown && recipe.checkIngredients(ingredients)) {
                foundRecipe = recipe;
                break;
            }
        }

        if (foundRecipe) {
            console.log('recipe found!', foundRecipe.name);
            foundRecipe.isKnown = true;
            addRecipe(foundRecipe);
        } else {
            console.log('could not find recipe...');
        }

    });


    // detect a season change, and modify the current season
    calendar.events.on('seasonchange', ({season}) => {
        IngredientData.season = season;
        // console.log('season changed', calendar.getSeasonName(season));
    });

    // detect a month change
    calendar.events.on('monthchange', ({month, season}) => {
        // console.log('month changed', calendar.getMonthName(month));
    });


    // create the witch cat, stirring the pot
    witchCat = new ImageGameObject({
        src: './assets/witch-cat.gif'
    })
        .setSize(491, 609)
        .setOrigin(.46, 1) // .46 is a good value to center the pot horizontally
        .setPosition(Game.centerX, Game.height)
    
    bgm = new Sound('./assets/bgm.wav');
    
    bgm.events.once('canplaythrough', () => {    
        bgm.loop = true;
        bgm.volume = .2;
        bgm.play();
        // console.log('canplaythrough starting bgm')
    })

    window.addEventListener('click', () => {
        if (!bgm.playing) {
            bgm.play();
            console.log('click starting bgm');
        }
    }, { once: true })

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
    uiObjects.currencyLabel.textContent = `${catChef.currency.toFixed(0)} catnip`;

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
