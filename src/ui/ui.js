
// let testDrag

let uiInitialized = false;

// initialize the ui
// returns an object containing relevant GameObjects
function initializeUI() {

    if (uiInitialized) {
        return;
    }

    // stores the ui GameObjects in here
    const uiObjects = {};

    // container that holds ui elements. this is always on top
    const uiContainer = document.querySelector('#ui-container');

    // testDrag = new DraggableGameObject({container: uiContainer})
    // .setSize(100, 100)
    // .setStyle('backgroundColor', 'coral')
    // .setOrigin(.5, .5)


    // creates recipe book button
    const recipeBookButton = new ButtonGameObject({container: uiContainer, tag: 'img'})
        .setAttribute('src', './assets/book-small.png')
        .setPosition(gameContainer.rect.width - 60, 200)
        .setBackgroundColor('')
        .setSize(100,150)
        .setOrigin(.5, .5)
        

    // gets / creates ingredients container as a new GameObject
    const ingredientsContainerTop = 50;
    const ingredientsContainerBottom = gameContainer.rect.height - 50;

    const ingredientsContainer = new GameObject({container: uiContainer})
        // .setId('ingredients')
        .setPosition(0, ingredientsContainerBottom)
        .setOrigin(0, .5)
    
    uiContainer.ingredientsContainer = ingredientsContainer;


    // creates cutting board GameObject as a div
    const cuttingBoard = new GameObject({container: ingredientsContainer})
        .setSize(450, 500)
        .setOrigin(.5, 0)
        .setPosition(gameContainer.centerX, 100)

    const cuttingBoardBackground = new ImageGameObject({container: cuttingBoard, src: './assets/cutting-board.png'})
        .setSize(cuttingBoard.getSize())

    const craftSlotA = new GameObject({container: cuttingBoard})
        .setSize(100, 100)
        .setOrigin(.5, .5)
        .setBackgroundColor('brown')
        .setPosition(cuttingBoard.getSize().x / 2 - 100, 200)
    
    const craftSlotB = new GameObject({container: cuttingBoard})
        .setSize(100, 100)
        .setOrigin(.5, .5)
        .setBackgroundColor('brown')
        .setPosition(cuttingBoard.getSize().x / 2 + 100, 200)

    // creates ingredients / cutting board dragger, which is able to bring up the cutting board and put it down
    const ingredientsDraggerTop = 100;
    const ingredientsDraggerBottom = gameContainer.rect.height - 100;
    const ingredientsDragger = new DraggableGameObject({container: uiContainer, tag: 'img'})
        .setAttribute('src', './assets/drag-arrow.png')
        .setSize(50, 50)
        // .setStyle('backgroundColor', 'coral')
        .setPosition(gameContainer.centerX, gameContainer.rect.height - 100)
        .setOrigin(.5, .5)
        .addSnapPosition('bot', gameContainer.centerX, ingredientsDraggerBottom)
        .addSnapPosition('top', gameContainer.centerX, ingredientsDraggerTop)
        .setHomeId('bot')
        .setSnapDistance(10)
        .setTransitionSpeed(.5)
        .setHomeChangeDistance(gameContainer.rect.height / 2)
        .setXAxisLock(true)
        
    uiObjects.ingredientsDragger = ingredientsDragger;



    // drag event listeners for the ingredients dragger
    ingredientsDragger.on('dragstart', ({}) => {

        // move ingredients back to their stored positions
        Object.values(cuttingBoardIngredients).forEach(({draggableGameObject}) => {
            draggableGameObject.setHomeId('main');
        });
    })
    .on('dragging', ({object, position, id}) => {
        
        const targetId = object.getHomeId() === 'bot' ? 'top' : 'bot';
        const percent = object.percentTo(targetId);
        const length = (gameContainer.rect.height - 100);
        const y = length * (targetId === 'top' ? 1 - percent : percent);

        // move ingredient container (and cutting board) with the dragger
        ingredientsContainer.setPosition(undefined, y + 50);
        
        // move ingredients up or down with the ingredient container
        Object.values(cuttingBoardIngredients).forEach(({draggableGameObject}) => {
            draggableGameObject.setPosition(undefined, ingredientsContainer.getPosition(true).y);
        });
    })
    .on('dragend', ({object, position, id}) => {
        
        // rotate the dragger for effect
        if (id === 'top') {
            object.setRotation(Math.PI);
        } else {
            object.setRotation(0);
        }
        
        // set ingredient properties in the new state
        Object.values(cuttingBoardIngredients).forEach(({draggableGameObject}) => {

            // set the ingredients new main snap position
            // if the ingredients are at the top (crafting mode), enable dragging
            if (id === 'top') {
                ingredientsContainer.setPosition(undefined, ingredientsContainerTop);
                draggableGameObject.setSnapPosition('main', undefined, ingredientsContainerTop);
                draggableGameObject.setDragEnabled(true);
            } else {
                ingredientsContainer.setPosition(undefined, ingredientsContainerBottom);
                draggableGameObject.setSnapPosition('main', undefined, ingredientsContainerBottom);
                draggableGameObject.setDragEnabled(false);
            }

        });
    })

    const recipeBook = new RecipeBook({container: uiContainer});
    recipeBook.setStyle('zIndex', 2);

    fillRecipeBook(recipeBook, uiObjects);


    // get the ingredients and create a draggable game object for each
    const cuttingBoardIngredients = {};

    uiObjects.cuttingBoardIngredients = cuttingBoardIngredients;

    const width = 100;
    const height = 100;
    const startX = width / 2;
    const endX = gameContainer.rect.width - width / 2;


    // uses ingredientData
    // creates a draggableGameObject of the ingredient and stores it in the ingredientData
    // creates a uprade option for it in the upgrades page
    const addIngredient = (ingredient) => {
        const {id, img} = ingredient;
        cuttingBoardIngredients[id] = ingredient;

        // add to upgrades
        const {upgradeButton, levelLabel, upgradeIcon} = uiObjects.upgradePageData.addUpgrade(ingredient);

        // create draggable game object
        const draggableGameObject = new DraggableGameObject({container: uiContainer, tag: 'img'})
            .setAttribute('src', img)
            .setSize(width, height)
            .setOrigin(.5, .5)
            .setHomeId('main')
            .setSnapDistance(50)
            .setTransitionSpeed(.2)
            .setDragEnabled(false)
            .addSnapPosition('crafta', 150, 350)
            .addSnapPosition('craftb', 350, 350)

        ingredient.draggableGameObject = draggableGameObject;

        // refresh main positions of ingredients
        const ingredientsArray = Object.entries(cuttingBoardIngredients);
        ingredientsArray.forEach(([id, {draggableGameObject}], i) => {
            const position = new Vector2(
                (ingredientsArray.length > 1 ? (i / (ingredientsArray.length - 1)) : 0) * (endX - startX) + width / 2, 
                gameContainer.rect.height - height / 2
            );

            draggableGameObject
                .setSnapPosition('main', position)
        });

        return {draggableGameObject, upgradeButton, levelLabel, upgradeIcon};
    }

    recipeBookButton.setClickCallback((e) => {
        recipeBook.open();
        recipeBookButton.setVisible(false);
    });

    recipeBook.on('close', () => {
        recipeBookButton.setVisible(true);
    })

    recipeBook.on('pageflip', (page) => {
        // console.log('page flipped!', page);
        
        // maybe play a sound here, or put in the recipe book itself?
    })

    uiObjects.addIngredient = addIngredient;
    uiObjects.recipeBook = recipeBook;
    uiObjects.recipeBookButton = recipeBookButton;
    // uiObjects.recipeBookPages = recipeBookPages;

    // return the ui data stored in uiObjects for use in other places.
    console.log('ui objects', uiObjects);
    uiInitialized = true;

    return uiObjects;
}