// ermm.. this will hold some ui things

// initialize the ui
// returns an object containing relevant GameObjects
function initializeUI() {

    // stores the ui GameObjects in here
    const uiObjects = {};

    const uiContainer = document.querySelector('#ui-container');

    // gets / creates ingredients container, and creates a draggableGameObject 
    uiContainer.ingredientsContainer = new DraggableGameObject({element: document.querySelector('#ingredients')})
        .setPosition(0, gameContainer.rect.height)
        .setOrigin(0,1)
        .addSnapPosition('bot', 0, gameContainer.rect.height)
        .addSnapPosition('top', 0, 100)
        .setHomeSnapPositionId('bot')
        .setSnapDistance(50)
        .setHomeChangeDistance(gameContainer.rect.height / 2)
        .setXAxisLock(true)
    
    const cuttingBoard = new GameObject()
        .setSize(450, 500)
        .setOrigin(.5, 0)
        .setParent(uiContainer.ingredientsContainer)
        .setPosition(gameContainer.centerX, 120)
    cuttingBoard.getElement().textContent = 'cutting board!'


    uiObjects.ingredientsDragger = new DraggableGameObject({container: uiContainer})
        .setSize(50, 50)
        .setStyle('backgroundColor', 'coral')
        .setPosition(0, gameContainer.rect.height - 100)
        .setOrigin(.5, .5)
        .addSnapPosition('bot', gameContainer.centerX, gameContainer.rect.height - 100)
        .addSnapPosition('top', gameContainer.centerX, 100)
        .setHomeSnapPositionId('bot')
        .setSnapDistance(50)
        .setHomeChangeDistance(gameContainer.rect.height / 2)
        .setXAxisLock(true)


    const cuttingBoardIngredients = {};

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
            .setHomeSnapPositionId('main')
            .setSnapDistance(50)
            .setTransitionSpeed(.2)
            .setDragEnabled(false)
    })
    

    return uiObjects;
}