
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
    const cuttingBoard = new GameObject()
        .setSize(450, 500)
        .setOrigin(.5, 0)
        .setBackgroundColor('lightsalmon')
        .setParent(ingredientsContainer)
        .setPosition(gameContainer.centerX, 100)
        .setProperty('textContent', 'cutting board!');


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



    // get the ingredients and create a draggable game object for each
    const cuttingBoardIngredients = {};

    uiObjects.cuttingBoardIngredients = cuttingBoardIngredients;

    const ingredients = {
        'apple': './assets/apple.png',
        'pumpkin': './assets/pumpkin.png',
        'corn': './assets/corn.png',
        'berries': './assets/berries.png',
    }

    const width = 100;
    const height = 100;
    const startX = width / 2;
    const endX = gameContainer.rect.width - width / 2;

    const ingredientsArray = Object.entries(ingredients);
    ingredientsArray.forEach(([name, path], i) => {
        const position = new Vector2(
            i / (ingredientsArray.length - 1) * (endX - startX) + width / 2, 
            gameContainer.rect.height - height / 2
        );

        cuttingBoardIngredients[name] = new DraggableGameObject({container: uiContainer, tag: 'img'})
            .setAttribute('src', path)
            .setSize(width, height)
            .setOrigin(.5, .5)
            .setPosition(position)
            .addSnapPosition('main', position)
            .setHomeId('main')
            .setSnapDistance(50)
            .setTransitionSpeed(.2)
            .setDragEnabled(false)
    })



    // drag event listeners for the ingredients dragger
    ingredientsDragger.on('dragstart', ({}) => {

        // set the main snap position for the ingredients to their home snap position
        // might be redundant, so it is commented out
        // Object.values(cuttingBoardIngredients).forEach((ingredient) => {
        //     ingredient.setSnapPosition('main', undefined, ingredientsContainer.getHomePosition().y);
        // });
    })
    .on('dragging', ({object, position, id}) => {
        
        const targetId = object.getHomeId() === 'bot' ? 'top' : 'bot';
        const percent = object.percentTo(targetId);
        const length = (gameContainer.rect.height - 100);
        const y = length * (targetId === 'top' ? 1 - percent : percent);

        // move ingredient container (and cutting board) with the dragger
        ingredientsContainer.setPosition(undefined, y + 50);
        
        // move ingredients up or down with the ingredient container
        Object.values(cuttingBoardIngredients).forEach((ingredient) => {
            ingredient.setPosition(undefined, ingredientsContainer.getPosition(true).y);
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
        Object.values(cuttingBoardIngredients).forEach((ingredient) => {

            // set the ingredients new main snap position
            // if the ingredients are at the top (crafting mode), enable dragging
            if (id === 'top') {
                ingredientsContainer.setPosition(undefined, ingredientsContainerTop);
                ingredient.setSnapPosition('main', undefined, ingredientsContainerTop);
                ingredient.setDragEnabled(true);
            } else {
                ingredientsContainer.setPosition(undefined, ingredientsContainerBottom);
                ingredient.setSnapPosition('main', undefined, ingredientsContainerBottom);
                ingredient.setDragEnabled(false);
            }

        });
    })

    const recipeBook = new RecipeBook({container: uiContainer});

    fillRecipeBook(recipeBook, uiObjects);

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

    uiObjects.recipeBook = recipeBook;
    uiObjects.recipeBookButton = recipeBookButton;
    // uiObjects.recipeBookPages = recipeBookPages;

    // return the ui data stored in uiObjects for use in other places.
    console.log('ui objects', uiObjects);
    uiInitialized = true;

    return uiObjects;
}