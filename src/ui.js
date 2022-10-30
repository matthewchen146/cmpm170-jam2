// ermm.. this will hold some ui things

// initialize the ui
// returns an object containing relevant GameObjects
function initializeUI() {

    // stores the ui GameObjects in here
    const uiObjects = {};

    const uiContainer = document.querySelector('#ui-container');

    // gets / creates ingredients container, and creates a draggableGameObject 
    const ingredientsContainer = new DraggableGameObject({element: document.querySelector('#ingredients')})
        .setPosition(0, gameContainer.rect.height)
        .setOrigin(0,1)
        .addSnapPosition('bot', 0, gameContainer.rect.height)
        .addSnapPosition('top', 0, 100)
        .setHomeSnapPositionId('bot')
        .setSnapDistance(50)
        .setHomeChangeDistance(gameContainer.rect.height / 2)
        .setDragEnabled(false)
        .setXAxisLock(true)
    
    uiContainer.ingredientsContainer = ingredientsContainer;

    const cuttingBoard = new GameObject()
        .setSize(450, 500)
        .setOrigin(.5, 0)
        .setParent(ingredientsContainer)
        .setPosition(gameContainer.centerX, 120)
    cuttingBoard.getElement().textContent = 'cutting board!'

    const ingredientsDraggerTop = 100;
    const ingredientsDraggerBottom = gameContainer.rect.height - 100;
    const ingredientsDragger = new DraggableGameObject({container: uiContainer, tag: 'img'})
        .setAttribute('src', './assets/drag-arrow.png')
        .setSize(50, 50)
        // .setStyle('backgroundColor', 'coral')
        .setPosition(0, gameContainer.rect.height - 100)
        .setOrigin(.5, .5)
        .addSnapPosition('bot', gameContainer.centerX, ingredientsDraggerBottom)
        .addSnapPosition('top', gameContainer.centerX, ingredientsDraggerTop)
        .setHomeSnapPositionId('bot')
        .setSnapDistance(10)
        .setTransitionSpeed(.5)
        .setHomeChangeDistance(gameContainer.rect.height / 2)
        .setXAxisLock(true)
        

    uiObjects.ingredientsDragger = ingredientsDragger;

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
    


    ingredientsDragger.on('dragstart', ({id}) => {
        ingredientsContainer.setTransitionEnabled(false);

        Object.values(cuttingBoardIngredients).forEach((ingredient) => {
            ingredient.setTransitionEnabled(false);
            ingredient.setSnapPosition('main', undefined, ingredientsContainer.getSnapPosition(ingredientsContainer.homeId).y - 50);
        });
    })
    .on('dragging', ({object, position}) => {
        // ingredientsContainer.setSnapPosition('move', undefined, position.y);
        const targetId = object.homeId === 'bot' ? 'top' : 'bot';
        const percent = object.percentTo(targetId);
        const length = ingredientsDraggerBottom - ingredientsDraggerTop + 100;
        const y = length * (targetId === 'top' ? percent : 1 - percent) + 100;
        ingredientsContainer.setPosition(undefined, y);

        Object.values(cuttingBoardIngredients).forEach((ingredient) => {
            ingredient.setPosition(undefined, y - 50);
        });
    })
    .on('dragend', ({object, position, id}) => {
        ingredientsContainer.setTransitionEnabled(true);
        ingredientsContainer.setSnapPosition('move', undefined, position.y)
            .setHomeSnapPositionId(id)

        if (id === 'top') {
            object.setRotation(Math.PI);
        } else {
            object.setRotation(0);
        }
        
        // set ingredient properties in the new state
        Object.values(cuttingBoardIngredients).forEach((ingredient) => {
            ingredient.setTransitionEnabled(true);
            ingredient.setSnapPosition('main', undefined, ingredientsContainer.getSnapPosition(ingredientsContainer.homeId).y - 50);

            if (id === 'top') {
                ingredient.setDragEnabled(true);
            } else {
                ingredient.setDragEnabled(false);
            }
        });
    })
    // .addEventListener('click', () => {
    //     if (ingredientsDragger.homeId === 'top') {
    //         ingredientsDragger.setHomeSnapPositionId('bot');
    //     } else {
    //         ingredientsDragger.setHomeSnapPositionId('top');
    //     }

    //     Object.values(cuttingBoardIngredients).forEach((ingredient) => {
    //         ingredient.setTransitionEnabled(true);
    //         ingredient.setSnapPosition('main', undefined, ingredientsContainer.getSnapPosition(ingredientsContainer.homeId).y - 50);

    //         if (ingredientsDragger.homeId === 'top') {
    //             ingredient.setDragEnabled(true);
    //         } else {
    //             ingredient.setDragEnabled(false);
    //         }
    //     });
    // })

    return uiObjects;
}