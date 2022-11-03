
// sets the GameObject static default container to the selected container below
GameObject.defaultContainer = document.querySelector('#game-object-container');
const overlayContainer = document.querySelector('#overlay-container');
let colorOverlay;

const levelUpSound = new Sound('./assets/sounds/levelup.wav');
const potBubblingSound = new Sound('./assets/sounds/potbubbling.wav', {loop: true, volume: .2});
const stirringSound = new Sound('./assets/sounds/stirring.wav', {loop: true, volume: .2});

const bgm = new Sound('./assets/bgm.wav', {loop: true, volume: .2});

// use this function to load things like assets
// it is asynchronous so it can use Promises
async function load() {
    // wait for main sounds to load
    await Promise.all([
        new Promise((resolve) => {
            bgm.events.on('canplaythrough', resolve);
        }),
        new Promise((resolve) => {
            potBubblingSound.events.on('canplaythrough', resolve);
        }),
        new Promise((resolve) => {
            stirringSound.events.on('canplaythrough', resolve);
        })
    ])
}

let calendar;
let seasonSprite;

let catChef;
let uiObjects;

let witchCat;

let potion;

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
            levelUpSound.play();
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

    initializeGlobal();

    calendar = new Calendar({month: 3});
    seasonSprite = new SpriteGameObject({
        src: './assets/season-sheet.png',
        spriteSize: {x: 100, y: 100},
        imageSize: {x: 400, y: 100}
    })
        .setSize(150, 150)
        .setPosition(95, 245)
        .setOrigin(.5, .5)
        .setFrame(calendar.getSeason())

    IngredientData.season = calendar.getSeason();
    const seasonSound = new Sound('./assets/sounds/bellam.wav', {volume: .5});

    calendar.events.on('seasonchange', ({season}) => {
        seasonSprite.setFrame(season);
        seasonSound.play();
    })


    const wall = new GameObject()
        // .setStyle('backgroundImage', 'radial-gradient(circle at center, rgba(0,0,0,.5) 0, black 100%), url("./assets/background.png")')
        .setStyle('backgroundImage', 'url("./assets/background.png")')
        .setSize(Game.width, Game.height)


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
                levelUpSound.play();
            }
            
        })
    }
    
    {
        const {upgradeButton} = uiObjects.upgradePageData.addUpgrade(potion);
        upgradeButton.onClick(() => {
            if (catChef.currency > potion.getCost()) {

                catChef.currency -= potion.getCost();
                potion.levelUp();
                levelUpSound.play();
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
            recipeFoundAnimation(foundRecipe);
            console.log('recipe found!', foundRecipe.name);
            foundRecipe.isKnown = true;
            addRecipe(foundRecipe);
        } else {

            // play an error sound here
            console.log('could not find recipe...');
        }

        craftSlots.crafta?.draggableGameObject.setHomeId('main')
        craftSlots.crafta = undefined;
        craftSlots.craftb?.draggableGameObject.setHomeId('main')
        craftSlots.craftb = undefined;

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


    const catSound = new Sound('./assets/sounds/meow.wav', {volume: .5});

    // create the witch cat, stirring the pot   
    witchCat = new SpriteGameObject({
        src: './assets/witch-cat-sheet.png',
        spriteSize: {x: 491, y: 609},
        imageSize: {x: 5401, y: 609},
        frames: {x: 11, y: 1}
    })
        // .setSize(491, 609)
        .setOrigin(.46, 1) // .46 is a good value to center the pot horizontally
        .setPosition(Game.centerX, Game.height)
        .setAutoAnimation(true)
        .addEventListener('click', (e) => {
            const mousePos = new Vector2(
                e.clientX - Game.left,
                e.clientY - Game.top 
            )

            if (mousePos.distanceTo(Game.centerX, Game.centerY - 50) < 150) {
                catSound.play();
            }
            
        })

    
    // create overlay
    colorOverlay = new GameObject({container: overlayContainer})
        .setSize(Game.width, Game.height)
        .setBackgroundColor('black')
        .setStyle('opacity', 0)


    window.addEventListener('click', () => {
        if (!bgm.playing) {
            bgm.play();
            console.log('click starting bgm');
        }

        if (!potBubblingSound.playing) {
            potBubblingSound.play();
        }

        if (!stirringSound.playing) {
            stirringSound.play();
        }
    }, { once: false })

}
/**
 * play a recipe found animation for a recipe
 * @param {RecipeData} recipe 
 * 
 * uses the recipe data such as the recipe image, and its ingredients' images
 * 
 * accesses draggable objects
 * 
 */
async function recipeFoundAnimation(recipe) {
    const container = overlayContainer;

    // disable clicks in the game during animation
    container.style.pointerEvents = 'all';

    // fade in the overlay
    new Timer(500)
        .onUpdate((timer, progress) => {
            colorOverlay.setStyle('opacity', progress * .7);
        })
        .start(true)

    // create potion drop animation

    // create the ingredients
    const ingredientImages = [];
    for (const {ingredient} of recipe.getIngredients()) {

        const start = ingredient.draggableGameObject.getGlobalPosition();
        const end = new Vector2(Game.centerX, Game.centerY);
        const ingredientImage = new ImageGameObject({container, src: ingredient.img})
            .setTransitionEnabled(false)
            .setSize(100, 100)
            .setOrigin(.5, .5)
            .setPosition(start)
            .setTransitionEnabled(true)
            .setTransitionSpeed(.08)
            .setPosition(end)
        ingredientImages.push(ingredientImage);
    }

    const potionStart = new Vector2(Game.centerX, -100);
    const potionEnd = new Vector2(Game.centerX, 70);

    const potionSprite = new SpriteGameObject({
        container,
        src: './assets/potion-sheet.png',
        spriteSize: {x: 100, y: 100},
        imageSize: {x: 400, y: 100},
    })
        .setTransitionEnabled(false)
        .setOrigin(.5, .5)
        .setSize(150, 150)
        .setPosition(potionStart)


    // move the potion and rotate it to the correct place
    await new Timer(300).onUpdate((timer, progress) => {

        potionSprite.setPosition(potionStart.lerp(potionEnd, progress));
        potionSprite.setRotation(progress * -Math.PI * 3 / 4);

    }).start(true);

    for (let i = 0; i < 3; i++) {
        // create potion drops
        const dropStart = potionSprite.getPosition().add(0, 60);
        const drop = new ImageGameObject({container, src: './assets/bubble.png'})
            .setTransitionEnabled(false)
            .setSize(30,30)
            .setPosition(dropStart)
            .setOrigin(.5, .5)
        new Timer(100, {autoStart: true}).onUpdate((timer, progress) => {

            drop.setPosition(dropStart.lerp(Game.centerX, Game.centerY, progress));
            const size = progress * 10 + 39;
            drop.setSize(size, size);

            if (progress === 1) {
                drop.destroy();
            }
        })

        await new Timer(100).start(true);
    }

    // retract potion
    potionEnd.set(potionStart);
    potionStart.set(potionSprite.getPosition());

    new Timer(200).onUpdate((timer, progress) => {

        potionSprite.setPosition(potionStart.lerp(potionEnd, progress));
        if (progress === 1) {
            potionSprite.destroy();
        }

    }).start()

    // remove ingredient images
    for (const ingredientImage of ingredientImages) {
        ingredientImage.destroy();
    }

    const glow = new ImageGameObject({container, src: './assets/glow-rays.png'})
        .setTransitionEnabled(false)
        .setOrigin(.5, .5)
        .setPosition(Game.centerX, Game.centerY)
    glow.addAnimationFunction((delta) => {
        glow.rotate(delta * .001);
    })

    const recipeImage = new ImageGameObject({container, src: recipe.img})
        .setTransitionEnabled(false)
        .setPosition(Game.centerX, Game.centerY)
        .setOrigin(.5, .5)
    
    const titleStart = new Vector2(Game.centerX, Game.centerY);
    const title = new GameObject({container})
        .setTransitionEnabled(false)
        .setPosition(titleStart)
        .setOrigin(.5, 0)
        .setText(recipe.name)
        .setStyle('textAlign', 'center')
        .setStyle('color', 'linen')
        .setSize(400, 100)
        .setStyle('fontSize', `50px`)
        .setStyle('transform', 'scale(0)')

    // show glow
    new Timer(300)
        .onUpdate((timer, progress) => {
            const glowSize = progress * 500;
            glow.setSize(glowSize, glowSize);
            
        })
        .start(true)

    // show recipe after glow
    await new Timer(100).start(true);
    new Timer(200, {autoStart: true})
        .onUpdate((timer, progress) => {

            const recipeSize = progress * 300;
            recipeImage.setSize(recipeSize, recipeSize);
                       
        })


    // show title after recipe
    await new Timer(100).start(true);
    new Timer(200, {autoStart: true})
        .onUpdate((timer, progress) => {

            const titlePos = titleStart.lerp(Game.centerX, Game.centerY + 150, progress);
            title.setPosition(titlePos);
            title.setStyle('transform', `scale(${progress})`);
            
        })
    
    // show for how long
    await new Timer(1000).start(true)

    titleStart.set(title.getPosition());

    // fade away
    await new Timer(200)
        .onUpdate((timer, progress) => {
            const glowSize = (1 - progress) * 500;
            glow.setSize(glowSize, glowSize);

            const recipeSize = (1 - progress) * 300;
            recipeImage.setSize(recipeSize, recipeSize);

            title.setPosition(titleStart.lerp(Game.centerX, Game.height + 100, progress));

            colorOverlay.setStyle('opacity', (1 - progress) * .7);
        })
        .start(true)

    glow.destroy();
    recipeImage.destroy();
    title.destroy();

    container.style.pointerEvents = 'none';
}

// creates a splash in the pot / position
async function createSplash(position, count = 10) {
    const source = new Vector2(position);
    for (let i = 0; i < count; i++) {
        const velocity = new Vector2(i - count / 2, -1).normalize().mul(Math.random() * 3 + 1);
        velocity.y = -Math.random() * 4 - 3;
        const baseSize = Math.random() * 5 + 20;

        let timer = 0;
        let duration = 1000;

        const particle = new ImageGameObject({src: './assets/bubble.png'})
            .setTransitionEnabled(false)
            .setPosition(source)
            .setOrigin(.5, .5)
            .setSize(baseSize, baseSize)
        
        particle.setUpdate((delta) => {

            const progress = Math.min(timer / duration, 1);

            velocity.y += delta * .02;

            particle.translate(velocity);

            const size = (1 - progress) * baseSize;
            particle.setSize(size, size);

            if (progress === 1) {
                particle.destroy();
            }

            timer += delta;

        })
    }
}

// cooking animation
async function cookAnimation(recipe) {
    if (!recipe) { return; }

    for (const {ingredient} of recipe.getIngredients()) {
        
        // creates an ingredient object that flies into the pot
        const ingredientObject = new ImageGameObject({src: ingredient.img})
            .setTransitionEnabled(false)
            .setPosition(ingredient.draggableGameObject.getGlobalPosition())
            .setOrigin(.5, .5)
        
        let timer = 0;
        let duration = 500;
        const startSize = ingredient.draggableGameObject.getSize();
        const endSize = {x: 40, y: 40};
        const start = ingredientObject.getPosition();
        const end = {x: Game.centerX, y: 480};
        const control = {x: start.x + (end.x - start.x) / 2, y: 300};
        const curve = new BilinearCurve(start, control, end);
        ingredientObject.setUpdate((delta, time) => {

            const progress = Math.min(timer / duration, 1);

            const position = curve.at(progress);
            ingredientObject.setPosition(position);
            const size = startSize.lerpv(endSize, progress);
            ingredientObject.setSize(size);

            if (progress === 1) {
                createSplash(ingredientObject.getPosition(), 6)
                ingredientObject.destroy();
            }

            timer += delta;
        })

        await new Promise((resolve) => { setTimeout(resolve, 200)})
    }
}

let cookTimer = 0;
let cookInterval = 2000;

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

    // make cooking animation
    if (cookTimer >= cookInterval) {

        // start a cooking animation
        cookAnimation(catChef.getRecipe());

        cookTimer -= cookInterval;
    }

    if (Game.isWindowFocused) {
        cookTimer += delta;
    }

    // update all timers
    Timer.update(delta, time);

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
