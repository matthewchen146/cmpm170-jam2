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
    
    const centerContainer = document.createElement('div');
    centerContainer.style.textAlign = 'center';
    page.appendChild(centerContainer);

    const title = createTitle('Recipes');
    
    page.appendChild(title);
}



function initializeUpgradePage(recipeBook) {
    // create upgrades page
    const page = recipeBook.createPage()
        .setId('upgrades')

    const centerContainer = document.createElement('div');
    centerContainer.style.textAlign = 'center';
    page.appendChild(centerContainer);

    const title = createTitle('Upgrades');
    
    page.appendChild(title);

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

    const upgradeData = {};

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
        
        upgradeData[id] = {button, levelText: text, img};
    });

    return upgradeData;
}

// move upgrade buttons into ui objects
// possible make ui objects global
function fillRecipeBook(recipeBook, uiObjects) {
    
    const recipeData = initializeRecipePage(recipeBook);
    uiObjects.recipeData = recipeData;

    // create the upgrades page
    // returns upgrade data for each item, including the button, level label, and icon
    const upgradeData = initializeUpgradePage(recipeBook);
    uiObjects.upgradeData = upgradeData;

    recipeBook.createPage()
        .setText('awards')
}