
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

    // the grid:
    // ITEMS (their icon only) - LEVEL - UPGRADE BUTTON (with cost)
    // ex: CAT - LVL 99 - [250 catnip]
    // currently contains example data
    const itemData = [
        {
            icon: './assets/cat-head.png',
        },
        {
            icon: './assets/apple.png',
        },
        {
            icon: './assets/pumpkin.png',
        },
        {
            icon: './assets/corn.png',
        },
        {
            icon: './assets/berries.png',
        },
        {
            icon: './assets/potion.png',
            cost: 100
        },
    ]
    itemData.forEach(({icon, level, cost}) => {
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
    });
}

function fillRecipeBook(recipeBook) {
    
    recipeBook.createPage()
        .setText('recipes')

    initializeUpgradePage(recipeBook);

    recipeBook.createPage()
        .setText('awards')
}