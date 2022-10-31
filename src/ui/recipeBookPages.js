
function initializeUpgradePage(recipeBook) {
    // create upgrades page
    const page = recipeBook.createPage()
        .setId('upgrades')

    // const title = new GameObject({
    //     container: page,
    //     positionMode: GameObject.PositionModes.NONE,
    //     tag: 'h2'
    // })
    //     .setText('Upgrades')
    //     .setPosition(100, 100)
    const centerContainer = document.createElement('div');
    centerContainer.style.textAlign = 'center';
    page.appendChild(centerContainer);

    const title = document.createElement('h2');
    title.textContent = 'Upgrades';
    centerContainer.appendChild(title);

    const grid = document.createElement('div');
    centerContainer.appendChild(grid);
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = '1fr 1fr 1fr';

    const itemTitle = document.createElement('div');
    itemTitle.textContent = 'Item';

    const levelTitle = document.createElement('div');
    levelTitle.textContent = 'Level';

    const buttonTitle = document.createElement('div');
    buttonTitle.textContent = 'Upgrade';

    grid.appendChild(itemTitle);
    grid.appendChild(levelTitle);
    grid.appendChild(buttonTitle);
}

function fillRecipeBook(recipeBook) {
    
    // recipeBook.createPage()
    //     .setText('recipes')

    initializeUpgradePage(recipeBook);
}