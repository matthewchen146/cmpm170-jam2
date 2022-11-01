

//This entire system may be rewritten depending on how much further 
//the scope develops


//BIG REWORK SOON, INGREDIENTS ARE PASSED INTO
//INVENTORY DYNAMICALLY




//The middleman between the chef and ingredients
//Tracks ingredient production a

class InventoryData {

    constructor(...ingredients){
        this.curSeason = 'spring';
        this.seasonbuff =[1.5,1,0,.5];
        this.inStock = Array.from(ingredients);
        console.log("amogus,",this.inStock[0]);

        
        
        this.harvest = new Array(ingredients.length);
        this.harvest.fill(0);
        this.outgoing =  new Array(ingredients.length);
        this.outgoing.fill(0);
        
    }
   
     //updates every second incrementing the total amount of produce by the yield
    updateProduction(){
        eventEmitter.on('seasonCycle',()=>{switch(getSeason()){   
            case 'spring':
                console.log('spring = no apple');
                let buff=[2,1.5,.5,1];
                this.seasonbuff.splice(0, this.seasonbuff.length, ...buff);
                break;
            case 'summer':
                console.log('summer = no pumpkin');
                 let buff1=[.5,2,1.5,1];
                 
                 this.seasonbuff.splice(0, this.seasonbuff.length, ...buff1);
                 break;
            case 'winter': 
            console.log('winter = no berry');
                 let buff2=[1,.5,2,1.5];
     
                this.seasonbuff.splice(0, this.seasonbuff.length, ...buff2);
                break;
            case 'fall':
                console.log('fall= no corn');
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
        console.log(this.harvest[x]);
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
        
       let res = this.inStock.findIndex((element) =>{ return ingredient === element.getName()})
        if (res===-1){
             console.log("ingredient not in stock!");
        }
        else{
            this.outgoing[res]=amount;
        }
    }
}

//Ingredients are given to inventory dynamically
//Season buff is given by inventory based on 
class IngredientData {
    constructor(name,season){
        
        this.name = name;
        switch(season){
            case 'spring':
                this.season = 0;
                break;
            case 'summer' :
                this.season = 1;
                break;
            case 'fall':
                this.season = 2;
                break;
            case'winter':
                this.season =3;
                break;
            default: 
                console.log("ingredient season broke");
                this.season = 0;
                break;
        }
         
        
        this.yield = 1;
        
    }

    getName(){
        return this.name;
    }
    getPrimeSeason(){
        return this.season;
    }
    crop(passedbuff){
        return this.yield*passedbuff;
    }

    yieldUp(){
        this.yield +=1;

    }

    
}

//holds ingredients needed
//holds amount of ingredients needed
//holds base selling price
//PLEASE INITIALIZE RECIPIES WITH THE INGREDIENTS, 
// example
// Apples,pumpkins,
class RecipeData{
    constructor(name,value,...recipelist ){
        this.name = name;
        this.reqIngred=[];
        this.reqamount=11;
        for(let x in recipelist){
            
            
            if(isNaN(recipelist[x])){
                this.reqIngred.push(recipelist[x]);
               
            
        }
       
    }
        this.isKnown= false;
        this.value = value;
    }

  
}


//Potion class will hold how much 
//potion is available
//potion will determine how many calls are 
//send by chef for ingredients, as all
//recipies rely on potions.
//no need to have anything other than chef 
//knowing about it.
class PotionData{
    constructor(){
        this.potionlevel = 1;
       
        this.upgradePrice=1000;
    }
    uprgadePotion(catnipcollector){
        if(
        catnipcollector.purchase(upgradePrice)){
            potionlevel +=1;
            
            this.upgradePrice*=10;


        }
        else{
            return ;
        }
    
    }

}



//takes in recipe and requests ingredients
//
class ChefData {
constructor(recipeinit){
    
    this.currentRecipe = recipeinit ;

    //the cat level, how many of a dish is made at a time.
    this.productionMult = 1;
    this.recmean =0;
    
}
    //set current recipe and tell the inventoryData what is 
    //needed
    //ALWAYS SET RECIPE BEFORE UPDATING
    setRecipe(RecipeDat,inven){
        this.currentRecipe = RecipeDat;
        let Recipelen = this.currentRecipe.reqIngred.length;
       
        
        for (let x = 0; x <Recipelen;x++ ){
            inven.requestSet(this.currentRecipe.reqIngred[x],11);
            console.log("amount"+this.currentRecipe.reqIngred[x])

        }
        this.recmean = inven.orderedIng();
    }

    cookStuff(cashier,potion,inven){
        //if there is enough ingredients, make food and tell cashier
        //to make sal
            inven.updateProduction();
           return cashier.makeSale(this.currentRecipe.value*this.productionMult*this.recmean,potion);
    }

}
//Asks if something has been cooked and calculates the total
//catnip gained and in the bank
//Tracks  levels
class CatnipCollector{
    constructor(){
        this.catlevel = 1;
        this.catUpgrade = 1000;
        this.catcrack = 0;
    
        

    }

    makeSale(value,potion){

        this.catcrack+= value * potion.potionlevel * this.catlevel;
        return this.catcrack;
    }

    //returns false if you cant afford x
    purchase(amount){
        if(amount>this.catcrack){
            return false;
        }
        else{
            this.catcrack-=amount;
            return true;
        }

    }
    upgradeCat(amount){
       if( this.purchase(amount)){
            this.catlevel +=1;
            this.catUpgrade*=10;
        }

    }





}

//THE TOP DOG
//contains list of all the recipies and 
//a list of all recipies the player knows
//contains current recipe selected and 
//sends relevant data to all classes who need it.
//
class Grimoire{
    constructor(){
         
        

    }
    //runs all of the variables that consume ingredients
    storesopen(chef,cashier,inventory){
        //
    }
    storeclosed(){

    }

}










