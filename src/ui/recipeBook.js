
/**
 * RecipeBook class
 * 
 * it is recommended that it's transforms are not modified after creation
 * except for the position
 */
class RecipeBook extends GameObject {
    constructor(options = {}) {
        super(options);
        this.pages = [];
        this.pageIndex = 0;

        // create recipe book content
        // const recipeBook = new GameObject({container: uiContainer})
        this.setVisible(false)
            .setBackgroundColor('beige')
            .setSize(450, 600)
            .setOrigin(.5, .5)
            .setPosition(gameContainer.centerX, gameContainer.centerY)

        this.defaultBackground = new ImageGameObject({container: this, src: './assets/book-page.png'})
            .setSize(this.getSize())

        this.pageContainer = new GameObject({container: this})
        
        this.isOpen = false;

        // create close book button, which hides the book if its open
        this.closeButton = new ButtonGameObject({container: this})
            .setText('close')
            .setPosition(450, 0)
            .setOrigin(1,0)
            .setBackgroundColor('pink')
            .setClickCallback((e) => {
                this.close();
            })


        // create page flipping buttons
        // they are visible in the book
        this.nextPageButton = new ButtonGameObject({container: this})
            .setText('next')
            .setPosition(this.getSize().x, 300)
            .setSize(50,30)
            .setOrigin(1,.5)
            .setBackgroundColor('coral')
            .setClickCallback((e) => { this.nextPage(); })

        this.prevPageButton = new ButtonGameObject({container: this})
            .setText('prev')
            .setPosition(0, 300)
            .setSize(50,30)
            .setOrigin(0,.5)
            .setBackgroundColor('coral')
            .setClickCallback((e) => { this.prevPage(); })
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
        const lastIndex = this.pageIndex;
        if (index >= this.pages.length - 1) {
            // last page
            index = this.pages.length - 1;

            if (this.pages.length > 1) {
                this.nextPageButton.setVisible(false);
                this.prevPageButton.setVisible(true);
            }

        } else if (index <= 0) {
            // first page
            index = this.pages.length ? 0 : -1;
            
            if (this.pages.length > 1) {
                this.nextPageButton.setVisible(true);
                this.prevPageButton.setVisible(false);
            }

        } else {
            // middle page
            if (this.pages.length <= 1) {
                this.nextPageButton.setVisible(false);
                this.prevPageButton.setVisible(false);
            } else {
                this.nextPageButton.setVisible(true);
                this.prevPageButton.setVisible(true);
            }
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
        return this;
    }
    
    // flip to previous page
    prevPage() {
        this.flipToPage(this.pageIndex - 1);
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
        return this;
    }
}