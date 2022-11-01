function createTitle(text) {
    const title = document.createElement('h2');
    title.textContent = text;
    title.style.position = 'absolute';
    title.style.top = '10px';
    title.style.width = '100%';
    title.style.height = 'min-content';
    title.style.textAlign = 'center';
    return title;
}

function initializeRecipePage(recipeBook) {
    // create recipes page
    const page = recipeBook.createPage()
        .setId('recipes')
    
    const title = createTitle('Recipes');

    page.appendChild(title);
    
    const centerContainer = document.createElement('div');
    centerContainer.style.textAlign = 'center';
    centerContainer.classList.toggle('recipes', true);
    page.appendChild(centerContainer);

    // create a grid
    // const grid = document.createElement('div');
    // centerContainer.appendChild(grid);
    // grid.style.display = 'grid';
    // grid.style.gridTemplateColumns = '1fr 1fr 1fr';
    // grid.style.rowGap = '5px';

    const addRecipe = ({name, id, ingredients, img}) => {
        const recipeContainer = document.createElement('div');
        recipeContainer.classList.toggle('recipe-container', true);
        // recipeContainer.style.display = 'grid';
        // recipeContainer.style.gridTemplateColumns = '8fr 2fr';
        // recipeContainer.style.columnGap = '5px';

        const infoContainer = document.createElement('div');
        infoContainer.classList.toggle('info-container', true);
        recipeContainer.appendChild(infoContainer);
        // infoContainer.style.display = 'flex';
        // infoContainer.style.width

        const labelContainer = document.createElement('div');
        labelContainer.classList.toggle('label-container', true);
        infoContainer.appendChild(labelContainer);

        const recipeImg = document.createElement('img');
        recipeImg.setAttribute('src', img);
        labelContainer.appendChild(recipeImg);

        const label = document.createElement('div');
        label.classList.toggle('label', true);
        label.textContent = name;
        labelContainer.appendChild(label);

        const ingredientsContainer = document.createElement('div');
        ingredientsContainer.classList.toggle('ingredients-container', true);
        infoContainer.appendChild(ingredientsContainer);

        // add the ingredients required to the ingredients container, with the amt needed
        Object.entries(ingredients).forEach(([ingredient, amt]) => {

            const ingredientContainer = document.createElement('div');
            ingredientContainer.classList.toggle('ingredient-container', true);
            
            const ingredientImg = document.createElement('img');
            ingredientImg.setAttribute('src', ingredientMap[ingredient]?.img || './assets/apple.png');
            ingredientImg.classList.toggle('ingredient-img', true);
            ingredientContainer.appendChild(ingredientImg);

            const text = document.createElement('div');
            text.classList.toggle('ingredient-amt', true);
            text.textContent = `${amt}`;
            ingredientContainer.appendChild(text);
            
            ingredientsContainer.appendChild(ingredientContainer);
            
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.toggle('button-container', true);
        recipeContainer.appendChild(buttonContainer);

        // const buttonText = document.createElement('div');
        // buttonText.textContent = 'Cook';

        const selectButton = new ButtonGameObject({
            container: buttonContainer,
            positionMode: GameObject.PositionModes.NONE
        })
            .setClass('select-button', true)
            .setSize(50,50)
            .setText('Cook')
            // .appendChild(buttonText)

        centerContainer.appendChild(recipeContainer);


        const recipeData = {
            selectButton
        };

        return recipeData;
    }

    const selectedRecipes = [];
    const availableRecipes = {};

    Object.entries(recipeList).forEach(([id, recipe]) => {
        if (recipe.default) {
            const recipeData = addRecipe({
                id: id,
                name: recipe.name || recipe.id,
                img: recipe.img,
                ingredients: recipe.ingredients
            });
            availableRecipes[id] = recipeData;
        }
    })
    
    // ingredients is an object {
    //     ingredientName: quantity,
    //     ...   
    // }
    const findRecipeId = (_ingredients) => {
        
        let foundRecipe;
        for (const [id, recipe] of Object.entries(recipeList)) {
            const ingredients = Object.assign({}, _ingredients);
            for (const [ingredient, amt] of Object.entries(recipe.ingredients)) {
                if (ingredients[ingredient]) {
                    ingredients[ingredient] -= amt;
                }
            }
            
            for (const amt of Object.values(ingredients)) {
                if (amt !== 0) {
                    return;
                }
            }
            foundRecipe = id;
        }
        return foundRecipe;
    }

    const recipePageData = {
        addRecipe,
        findRecipeId,
        availableRecipes,
        selectedRecipes
    };

    return recipePageData;
}



function initializeUpgradePage(recipeBook) {
    // create upgrades page
    const page = recipeBook.createPage()
        .setId('upgrades')

    const title = createTitle('Upgrades');

    page.appendChild(title);

    const centerContainer = document.createElement('div');
    centerContainer.style.textAlign = 'center';
    page.appendChild(centerContainer);

    // create a grid
    const grid = document.createElement('div');
    centerContainer.appendChild(grid);
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = '1fr 1fr 1fr';
    grid.style.rowGap = '5px';

    // create titles for each section
    const itemTitle = document.createElement('div');
    itemTitle.textContent = 'Item';

    const levelTitle = document.createElement('div');
    levelTitle.textContent = 'Level';

    const buttonTitle = document.createElement('div');
    buttonTitle.textContent = 'Upgrade';

    grid.appendChild(itemTitle);
    grid.appendChild(levelTitle);
    grid.appendChild(buttonTitle);

    const upgradePageData = {};

    // the grid:
    // ITEMS (their icon only) - LEVEL - UPGRADE BUTTON (with cost)
    // ex: CAT - LVL 99 - [250 catnip]
    // currently contains example data
    const itemData = [
        {
            id: 'cat',
            icon: './assets/cat-head.png',
        },
        {
            id: 'apple',
            icon: './assets/apple.png',
        },
        {
            id: 'pumpkin',
            icon: './assets/pumpkin.png',
        },
        {
            id: 'corn',
            icon: './assets/corn.png',
        },
        {
            id: 'berries',
            icon: './assets/berries.png',
        },
        {
            id: 'potion',
            icon: './assets/potion.png',
            cost: 100
        },
    ]
    itemData.forEach(({id, icon, level, cost}) => {
        const imgContainer = document.createElement('div');
        imgContainer.style.justifyContent = 'center';
        grid.appendChild(imgContainer);
        const img = document.createElement('img');
        img.setAttribute('src', icon);
        img.style.width = 50;
        img.style.height = 50;
        imgContainer.appendChild(img);
        

        const text = document.createElement('div');
        text.textContent = `${level || 0}`;
        grid.appendChild(text);

        const button = new ButtonGameObject({
            container: grid,
            positionMode: GameObject.PositionModes.NONE,
        })
            .setSize(80, 50)
            .setText(`${cost || 0} catnip`)
        
            upgradePageData[id] = {button, levelText: text, img};
    });

    return upgradePageData;
}

// move upgrade buttons into ui objects
// possible make ui objects global
function fillRecipeBook(recipeBook, uiObjects) {
    
    const recipePageData = initializeRecipePage(recipeBook);
    uiObjects.recipePageData = recipePageData;

    // create the upgrades page
    // returns upgrade data for each item, including the button, level label, and icon
    const upgradePageData = initializeUpgradePage(recipeBook);
    uiObjects.upgradePageData = upgradePageData;

    recipeBook.createPage()
        .setText('awards')
}