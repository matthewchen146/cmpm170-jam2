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

    const addRecipe = ({name, id, ingredients, img}) => {
        const recipeContainer = document.createElement('div');
        recipeContainer.classList.toggle('recipe-container', true);
        recipeContainer.classList.toggle('dotted-border', true);

        const infoContainer = document.createElement('div');
        infoContainer.classList.toggle('info-container', true);
        recipeContainer.appendChild(infoContainer);

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
        label.appendChild(ingredientsContainer);

        // add the ingredients required to the ingredients container, with the amt needed
        Object.entries(ingredients).forEach(([ingredient, amt]) => {
            
            const ingredientContainer = document.createElement('div');
            ingredientContainer.classList.toggle('ingredient-container', true);
            
            const ingredientImg = document.createElement('img');
            ingredientImg.setAttribute('src', possibleIngredients[ingredient]?.img || './assets/apple.png');
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

        const selectButton = new ButtonGameObject({
            container: buttonContainer,
            positionMode: GameObject.PositionModes.NONE
        })
            .setClass('select-button', true)
            .setSize(100,50)
            .setText('Cook')

        centerContainer.appendChild(recipeContainer);


        const recipeData = {
            selectButton
        };

        return recipeData;
    }
    
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
        findRecipeId
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
    centerContainer.classList.toggle('dotted-border', true);
    centerContainer.style.padding = '10px';
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
    

    // adds object (which is usually an ingredient) to the upgrades page to be upgraded
    function addUpgrade(object) {
        const {id, level, cost, img} = object;

        const imgContainer = document.createElement('div');
        imgContainer.style.justifyContent = 'center';
        grid.appendChild(imgContainer);
        const icon = document.createElement('img');
        icon.setAttribute('src', img);
        icon.style.width = 50;
        icon.style.height = 50;
        imgContainer.appendChild(icon);
        

        const label = document.createElement('div');
        label.classList.toggle('level-label', true);
        label.textContent = `${level || 1}`;
        grid.appendChild(label);

        const button = new ButtonGameObject({
            container: grid,
            positionMode: GameObject.PositionModes.NONE,
        })
            .setSize(100, 50)
            .setText(`${cost || 1} catnip`)
            .setClass('upgrade-button', true)
        
        // store the upgrade button in the object
        object.upgradeButton = button;
        object.levelLabel = label;

        upgradePageData[id] = {upgradeButton: button, levelLabel: label, upgradeIcon: icon};

        return upgradePageData[id];
    }

    upgradePageData.addUpgrade = addUpgrade;

    return upgradePageData;
}

function initializeCreditsPage(recipeBook) {
    // create credits page
    const page = recipeBook.createPage()
        .setId('credits')

    const title = createTitle('Credits');

    page.appendChild(title);

    const centerContainer = document.createElement('div');
    // centerContainer.style.textAlign = 'center';
    centerContainer.id = 'credits';
    centerContainer.classList.toggle('dotted-border', true);
    // centerContainer.style.padding = '10px';
    page.appendChild(centerContainer);
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

    initializeCreditsPage(recipeBook);
}