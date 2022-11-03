

//This entire system may be rewritten depending on how much further 
//the scope develops


//BIG REWORK SOON, INGREDIENTS ARE PASSED INTO
//INVENTORY DYNAMICALLY

const seasonsEnum = {
    winter: 0,
    spring: 1,
    summer: 2,
    fall: 3,
}


//The middleman between the chef and ingredients
//Tracks ingredient production a

class InventoryData {

    constructor(...ingredients){
        this.curSeason = 'spring';
        this.seasonbuff =[1.5,1,0,.5];
        this.inStock = Array.from(ingredients);
        

        
        
        this.harvest = new Array(ingredients.length);
        this.harvest.fill(0);
        this.outgoing =  new Array(ingredients.length);
        this.outgoing.fill(0);
        
    }
   
     //updates every second incrementing the total amount of produce by the yield
    updateProduction(){
        Game.eventEmitter.on('seasonCycle',()=>{switch(getSeason()){   
            case 'spring':
                // console.log('spring = no apple');
                let buff=[2,1.5,.5,1];
                this.seasonbuff.splice(0, this.seasonbuff.length, ...buff);
                break;
            case 'summer':
                // console.log('summer = no pumpkin');
                 let buff1=[.5,2,1.5,1];
                 
                 this.seasonbuff.splice(0, this.seasonbuff.length, ...buff1);
                 break;
            case 'winter': 
            // console.log('winter = no berry');
                 let buff2=[1,.5,2,1.5];
     
                this.seasonbuff.splice(0, this.seasonbuff.length, ...buff2);
                break;
            case 'fall':
                // console.log('fall= no corn');
               let buff3=[1,2,.5,1.5];
                
                this.seasonbuff.splice(0, this.seasonbuff.length, ...buff3);
                break;
            default:
                console.log('uhoh');
                break;

        }
    });

     
   
    for(let  x = 0; x < this.outgoing.length; x++){
      //  console.log("achimone ahh "+this.inStock[x]);
        this.harvest[x] = (this.inStock[x]).crop(this.seasonbuff[this.inStock[x].season])
        // console.log(this.harvest[x]);
    }  
    }
    

       //chef request how many things they can make 
       //
    orderedIng(){
        let ingmean = 0;
        let ingnum = 0;
        for (let x = 0 ; x <this.harvest.length;x++) {

            if (0<this.outgoing[x]){
                
                console.log(this.harvest[x],"sus",this.outgoing[x]);
               ingmean += this.harvest[x];
               ingnum +=1;
            } 
        }
        console.log("what is the meaning of this"+ingmean.ingnum);
        return ingmean/ingnum;
        
        
        

    }


    //find the ingredient name and call its upgrade function
    upgradeIng(name){


    }
    

    //Chef request ingredient 
   
    requestSet(ingredient,amount){
        
       let res = this.inStock.findIndex((element) =>{ return ingredient === element.id})
        if (res===-1){
             console.log("ingredient not in stock!");
        }
        else{
            this.outgoing[res]=amount;
        }
    }
}

/**
 * UpgradeableData class
 * can be extended by other classes if they are upgradeable
 * or they can be used as a component inside a class
 */
class UpgradeableData {
    constructor(options = {}) {
        this.level = options.level || 1;
        this.costFunction = options.costFunction || ((level) => { return level; });
        this.cost = this.costFunction(this.level);
        this.unit = options.unit || 'catnip';
        
        // icon to be displayed
        this.img = options.img || '';

        // game objects that will update on change
        this.levelLabel;
        this.upgradeButton;

        this.events = new EventEmitter();
    }

    calculateCost(level) {
        return this.costFunction(level);
    }

    getCost() {
        return this.cost;
    }

    updateCost(level = this.level) {
        this.cost = this.calculateCost(level);
        if (this.upgradeButton) {
            this.upgradeButton.setText(`${this.cost} ${this.unit}`);
        }
        return this;
    }

    setLevel(level) {
        this.level = level;
        if (this.levelLabel) {
            this.levelLabel.textContent = `${this.level}`;
        }
        this.updateCost();
        return this;
    }

    levelUp(levels = 1) {
        return this.setLevel(this.level + levels);
    }
}

//Ingredients are given to inventory dynamically
//Season buff is given by inventory based on 
class IngredientData extends UpgradeableData {
    static possibleIngredients = {}

    constructor(id, options = {}){
        super(options);
        this.id = id;
        this.name = options.name || id;
        
        // gets the season number from the seasonsEnum based on the season name
        // if it's not a valid season name, it defaults to 0 (winter)
        this.season = seasonsEnum[options.season] || 0;

        // i think this will be used instead of season above
        // represents a multiplier for the value based on the season
        // they are indexed as winter, spring, summer, fall
        this.seasonBuff = options.seasonBuff || [1,1,1,1];
        
        this.yield = 1;
        
        this.baseMultiplier = options.baseMultiplier || 1;
    }

    getName() {
        return this.name;
    }

    getValue(season = (IngredientData.season !== undefined ? IngredientData.season : undefined) || this.season) {
        const currentSeason = season;
        return this.level * this.seasonBuff[currentSeason] * this.baseMultiplier;
    }
}

//holds ingredients needed
//holds amount of ingredients needed
//holds base selling price
//PLEASE INITIALIZE RECIPIES WITH THE INGREDIENTS, 
// example
// Apples,pumpkins,
class RecipeData {
    constructor(id, ingredients, options = {}) {

        this.id = id;
        this.name = options.name || id;
        this.img = options.img || ''; //'./assets/recipes/default.png';
        this.ingredients = ingredients;
        this.ingredientsData = Object.entries(this.ingredients).map(([id, amt]) => {
            const ingredient = IngredientData.possibleIngredients[id];
            if (ingredient) {
                return {ingredient, quantity: amt};
            }
        });
        this.value = options.value || options.baseMultiplier || 1;

        // reference to the select button on the recipe page of the book
        this.selectButton;

        this.isKnown = options.isKnown || false;
    }

    getIngredientIds() {
        return Object.keys(this.ingredients);
    }

    getIngredients() {
        return this.ingredientsData;
    }

    // calculate the value of the recipe based on the ingredients and season
    getValue(season) {
        let meanValue = 0;
        let count = 0;
        this.ingredientsData.forEach(({ingredient, quantity}) => {
            
            count += quantity;
            meanValue = meanValue + quantity * (ingredient.getValue(season) - meanValue) / count;

        })

        meanValue *= this.value;
        
        return meanValue;
    }

    checkIngredients(ingredients = {}) {
        let match = true;
        for (const [id, amt] of Object.entries(this.ingredients)) {
            if (!(amt > 0 && ingredients[id] && ingredients[id] === amt)) {
                match = false;
                break;
            }
        }
        return match;
    }
}


//Potion class will hold how much 
//potion is available
//potion will determine how many calls are 
//send by chef for ingredients, as all
//recipies rely on potions.
//no need to have anything other than chef 
//knowing about it.
class PotionData extends UpgradeableData {
    constructor(options = {}) {
        super(options);

        this.baseMultiplier = options.baseMultiplier || 10;
    }

    getMultiplier() {
        return this.level * this.baseMultiplier;
    }
}



//takes in recipe and requests ingredients
//
class ChefData extends UpgradeableData {
constructor(options = {}){
    super(options);
    
    this.currentRecipe;
    this.potion;

    this.currency = 0;

    // the cat level, how many of a dish is made at a time.
    this.productionMultiplier = options.productionMultiplier || 1;
}
    //set current recipe and tell the inventoryData what is 
    //needed
    //ALWAYS SET RECIPE BEFORE UPDATING
    setRecipe(recipe){
        this.currentRecipe = recipe;
        return this;
    }

    getRecipe() {
        return this.currentRecipe;
    }

    setPotion(potion) {
        this.potion = potion;
        return this;
    }

    // this will essentially return how many recipes can be made in a second based on the level
    getMultiplier() {
        return this.level * this.productionMultiplier;
    }

    getRate(recipe = this.currentRecipe, season) {
        if (!recipe) {
            return 0;
        }

        // calculate the final output currency
        let output = recipe.getValue(season);

        if (this.potion) {
            output = output * this.potion.getMultiplier();
        }

        output = output * this.getMultiplier();

        return output;
    }

    cook(recipe = this.currentRecipe, season) {

        const output = this.getRate(recipe, season);        

        return output;
    }
}






