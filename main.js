
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
let currencyLabel;
let currency = 0;
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

function addIngredient(ingredient) {
    return uiObjects.addIngredient(ingredient);
}

function getIngredient(id) {
    return possibleIngredients[id];
}


let availableRecipes = {};

function getRecipe(id) {
    return availableRecipes[id];
}

function addRecipe(recipe) {
    const {selectButton} = uiObjects.recipePageData.addRecipe(recipe);
    recipe.selectButton = selectButton;

    selectButton.onClick(() => {
        if (recipe === selectedRecipe) {
            return;
        }

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


// add an event listener to the event emitter, that is called when the event is triggered
eventEmitter.on('seasonCycle', () => { console.log('seasonCycle has triggerd!!') });


// somewhere else with access to eventEmitter can trigger the event when necessary
eventEmitter.trigger('seasonCycle');

// use this function to initialize anything
function preUpdate() {


    uiObjects = initializeUI();

    // creates the ingredients
    possibleIngredients['apple'] = new IngredientData('apple', {
        name: 'Apple', 
        season: 'spring',
        img: './assets/apple.png'
    });
    possibleIngredients['pumpkin'] = new IngredientData('pumpkin', {
        name: 'Pumpkin', 
        season: 'fall',
        img: './assets/pumpkin.png'
    });
    possibleIngredients['corn'] = new IngredientData('corn', {
        name: 'Corn', 
        season: 'summer',
        img: './assets/corn.png'
    });
    possibleIngredients['berries'] = new IngredientData('berries', {
        name: 'Berries', 
        season: 'winter',
        img: './assets/berries.png'
    });

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
    
    
    
    inventory = new InventoryData(getIngredient('apple'));
    catChef = new ChefData(getRecipe('applejuice'));
    catChef.setRecipe(getRecipe('applejuice'), inventory);
    potion = new PotionData();


    catshier = new CatnipCollector();


    currencyLabel = new GameObject({element: document.querySelector('#currency')});


    // create the witch cat, stirring the pot
    witchCat = new ImageGameObject({
        src: './assets/witch-cat.gif'
    })
        .setSize(491, 609)
        .setOrigin(.46, 1) // .46 is a good value to center the pot horizontally
        .setPosition(gameContainer.centerX, Game.height)
    
}


// use this function as the main game loop
// delta is the time since the last frame, in ms
// time is the total time the game has been running, in ms
function update(delta, time) {

    // to test this works, here is a line that logs the delta and game time
    // console.log(delta, (time / 1000).toFixed(1))

       
    // anything involving something per second, place in here for now
  
    
    currency += catChef.cookStuff(catshier,potion,inventory)*(delta/1000);

    // set currency text in currency label
    currencyLabel.setText(`${currency.toFixed(2)} catnip`);

    
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
