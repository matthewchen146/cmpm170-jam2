
/**
 * RecipeBook class
 * 
 * it is recommended that it's transforms are not modified after creation
 * except for the position
 */
class RecipeBook extends GameObject {

    static init() {
        if (!this.initialized) {
            this.openSound = new Sound('./assets/sounds/openBook.mp3', {});
            this.closeSound = new Sound('./assets/sounds/closeBook.mp3', {});
            this.flipSound = new Sound('./assets/sounds/flipPage.mp3', {});

            this.initialized = true;
        }
    }

    constructor(options = {}) {
        super(options);
        this.pages = [];
        this.pageIndex = 0;

        RecipeBook.init();

        // create recipe book content
        // const recipeBook = new GameObject({container: uiContainer})
        this.setVisible(false)
            .setBackgroundColor('beige')
            .setSize(450, 600)
            .setOrigin(.5, .5)
            .setPosition(Game.centerX, Game.centerY)

        this.defaultBackground = new ImageGameObject({container: this, src: './assets/book-page.png'})
            .setSize(this.getSize())

        this.pageContainer = new GameObject({container: this})
        
        this.isOpen = false;

        // create close book button, which hides the book if its open
        this.closeButton = new ButtonGameObject({tag: 'img', container: this})
            .setAttribute('src', './assets/x.png')
            .setText('')
            .setPosition(440, 10)
            .setSize(50, 50)
            .setOrigin(.5, .5)
            // .setBackgroundColor('pink')
            .setClickCallback((e) => {
                this.close();
            })
            .setDefaultStyle({transform: `scale(1, 1)`}, true)
            .setHoverStyle({transform: `scale(1.25, 1.25)`}, true)
            .setActiveStyle({transform: `scale(1.5, 1.5)`}, true)
        this.closeButton.clickSound = undefined;


        // create page flipping buttons
        // they are visible in the book
        this.nextPageButton = new ButtonGameObject({container: this})
            .setText('')
            .setPosition(this.getSize().x + 20, 300)
            .setSize(50,50)
            .setOrigin(1,.5)
            // .setBackgroundColor('coral')
            .setClickCallback((e) => { this.nextPage(); })
            .setDefaultStyle({transform: `scale(1, 1)`}, true)
            .setHoverStyle({transform: `scale(1.25, 1.25)`}, true)
            .setActiveStyle({transform: `scale(1.5, 1.5)`}, true)
            .setStyle('backgroundImage', 'url("./assets/arrow-right.png")')
        this.nextPageButton.clickSound = undefined;

        this.prevPageButton = new ButtonGameObject({container: this})
            .setText('')
            .setPosition(0 - 20, 300)
            .setSize(50,50)
            .setOrigin(0,.5)
            // .setBackgroundColor('coral')
            .setClickCallback((e) => { this.prevPage(); })
            .setDefaultStyle({transform: `scale(-1, 1)`}, true)
            .setHoverStyle({transform: `scale(-1.25, 1.25)`}, true)
            .setActiveStyle({transform: `scale(-1.5, 1.5)`}, true)
            .setStyle('backgroundImage', 'url("./assets/arrow-right.png")')
        this.prevPageButton.clickSound = undefined;
    }

    // get the array of pages. not a duplicate
    getPages() {
        return this.pages;
    }

    // get the page content based on the page index
    getPage(index = this.pageIndex) {
        return this.pages[index];
    }

    // get the number of pages
    getPageCount() {
        return this.pages.length;
    }

    // get last page number / index
    getLastPageIndex() {
        return this.pages.length - 1;
    }


    // add a page to the book, optionally with an index
    // if index is not defined, it will add to the last page
    // if index >= this.pages.length, the page will be added to the end
    // if index < this.pages.length, the page will be before the last page
    // if index === 0, the page will be inserted to the very front as the first page
    addPage(page, index = this.pages.length) {
        index = Math.min(this.pages.length, index);
        this.pages.splice(index, 0, page);
        if (page instanceof GameObject) {

        } else {
            // assume page is an html element

        }
        this.pageContainer.appendChild(page);
        return this;
    }

    // creates the page game object automatically, returns it
    // adds it to the book
    createPage(index) {
        const page = new GameObject()
            .setClass('recipe-book-page', true)
            .setSize(this.getSize())
            .setVisible(false)
        
        this.addPage(page, index);
        return page;
    }


    // flip to the specified page
    flipToPage(index) {
        // clamp index
        index = Math.min(this.pages.length - 1, index);

        const lastIndex = this.pageIndex;
        if (index >= this.pages.length - 1) {
            // last page
            index = this.pages.length - 1;

            if (this.pages.length > 1) {
                this.nextPageButton.setVisible(false);
                this.prevPageButton.setVisible(true);
            } else {
                this.nextPageButton.setVisible(false);
                this.prevPageButton.setVisible(false);
            }

        } else if (index <= 0) {
            // first page
            index = this.pages.length ? 0 : -1;
            
            if (this.pages.length > 1) {
                this.nextPageButton.setVisible(true);
                this.prevPageButton.setVisible(false);
            } else {
                this.nextPageButton.setVisible(false);
                this.prevPageButton.setVisible(false);
            }

        } else {
            // middle page
            this.nextPageButton.setVisible(true);
            this.prevPageButton.setVisible(true);
        }

        this.pageIndex = index;

        if (this.pageIndex !== lastIndex) {
            this.events.trigger('pageflip', this.getPage());
        }

        this.pages.forEach((page, i) => {
            page.setVisible(i === this.pageIndex);
        })

        return this;
    }

    // flip to next page
    nextPage() {
        this.flipToPage(this.pageIndex + 1);
        if (RecipeBook.flipSound) {
            RecipeBook.flipSound.play();
        }
        return this;
    }
    
    // flip to previous page
    prevPage() {
        this.flipToPage(this.pageIndex - 1);
        if (RecipeBook.flipSound) {
            RecipeBook.flipSound.play();
        }
        return this;
    }

    // open the book, with an optional page
    open(page = this.pageIndex) {
        if (this.isOpen) {
            return this;
        }
        this.setVisible(true);
        this.flipToPage(page);
        this.isOpen = true;
        this.events.trigger('open');
        if (RecipeBook.openSound) {
            RecipeBook.openSound.play();
        }
        return this;
    }

    // close the book;
    close() {
        if (!this.isOpen) {
            return;
        }
        this.setVisible(false);
        this.isOpen = false;
        this.events.trigger('close');
        if (RecipeBook.closeSound) {
            RecipeBook.closeSound.play();
        }
        return this;
    }
}