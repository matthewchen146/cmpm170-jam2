

//This entire system may be rewritten depending on how much further 
//the scope develops


//BIG REWORK SOON, INGREDIENTS ARE PASSED INTO
//INVENTORY DYNAMICALLY




//The middleman between the chef and ingredients
//Tracks ingredient production and stockpiles
//Checks if there is enough ingredients to make a 
//Recipe
class InventoryData {

    constructor(...ingredients){
        this.curSeason = 'spring';
        this.seasonbuff =[1.5,1,0,.5];
        this.inStock = [];
        
        for (let ing in ingredients){
            
            this.inStock.push(ing);
        }
       
        this.stockCount = new Array(ingredients.length);
        this.stockCount.fill(0);
        this.outgoing =  new Array(ingredients.length);
        this.outgoing.fill(0);
        
    }
   
     //updates every second incrementing the total amount of produce by the yield
    harvest(){
        eventEmitter.on('seasonCycle',()=>{switch(getSeason()){   
            case 'spring':
                console.log('spring = no apple');
                let buff=[1.5,1,0,.5];
                this.seasonbuff.splice(0, this.seasonbuff.length, ...buff);
                break;
            case 'summer':
                console.log('summer = no pumpkin');
                 let buff1=[.5,1.5,1,0];
                 
                 this.seasonbuff.splice(0, this.seasonbuff.length, ...buff1);
                 break;
            case 'winter': 
            console.log('winter = no berry');
                 let buff2=[0,.5,1.5,1];
     
                this.seasonbuff.splice(0, this.seasonbuff.length, ...buff2);
                break;
            case 'fall':
                console.log('fall= no corn');
               let buff3=[1,0,.5,1.5];
                
                this.seasonbuff.splice(0, this.seasonbuff.length, ...buff3);
                break;
            default:
                console.log('uhoh');
                break;

        }
    });

     
   
    for(let  x = 0; x < this.stockCount.length; x++){
        this.stockCount[x] += this.inStock[x].crop(this.seasonbuff[x.getPrimeSeason()]);  
    }  
    }
    

       //chef asks for ingredients and if all are in 
       //stock subtract that much and let them cook
    orderedIng(){
        for (let x = 0 ; x <this.stockCount.length;x++) {
            if (this.stockCount[x]<this.outgoing[x]){
                console.log(this.stockCount[x],"sus",this.outgoing[x]);
                return false;
            } 
        }

        for(let y = 0;y<this.stockCount.length;y++){
            console.log(this.stockCount[y],"sussy",this.outgoing[y]);
            this.stockCount[y]-=this.outgoing[y];
           
        }
        
        return true;

    }


    //find the ingredient name and call its upgrade function
    upgradeIng(name){


    }
    

    //Chef request ingredient amount per second 
    //every time recipe changes or scales
    //outgoing amounts allow for 
    requestSet(ingredient,amount){
       let res = this.inStock.findIndex(element=>ingredient === element.getName())
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
         
        this.level = 0;
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
    levelUp(){
        this.level +=1;
    }

    yieldUp(){
        this.yield +=1;

    }

    
}

//holds ingredients needed
//holds amount of ingredients needed
//holds base selling price
//PLEASE INITIALIZE RECIPIES WITH THE INGREDIENTS, FOLLOWED BY
//THE NEEDED AMOUNTS 
// example
// Apples,pumpkins, 1 ,2;
class RecipeData{
    constructor(name,value,...recipelist ){
        this.name = name;
        this.reqIngred=[];
        this.reqamount=[];
        for(let x in recipelist){
            
            
            if(isNaN(recipelist[x])){
                this.reqIngred.push(recipelist[x]);
               
            
        }
        else{
            this.reqamount.push(recipelist[x]);
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
        
    }

}



//takes in recipe and requests ingredients
//
class ChefData {
construcor(recipeinit){
    
    this.currentRecipe = recipeinit ;
    //the cat level, how many of a dish is made at a time.
    this.productionMult = 1;
    
}
    //set current recipe and tell the inventoryData what is 
    //needed
    //ALWAYS SET RECIPE BEFORE UPDATING
    setRecipe(RecipeDat,inven){
        this.currentRecipe = RecipeDat;
        let Recipelen = this.currentRecipe.reqIngred.length;
       
       
        for (let x = 0; x <Recipelen;x++ ){
            inven.requestSet(this.currentRecipe.reqIngred[x],this.currentRecipe.reqamount[x]*this.productionMult);
           // console.log("amount"+this.currentRecipe.reqIngred[x])

        }
    }

    cookStuff(inven,cashier){
        //if there is enough ingredients, make food and tell cashier
        //to make sale
      
       if( inven.orderedIng()){
        

           return cashier.makeSale(this.currentRecipe.value*this.productionMult);
       }
       else {
        return 0;
       }
       
    }
    
   

    
    

    


}
//Asks if something has been cooked and calculates the total
//catnip gained and in the bank
//Tracks  levels
class CatnipCollector{
    constructor(){
        
        this.levels= {potionlevel:1,applelevel:1,pumpkinlevel:1,
            cornlevel:1,berrylevel:1};
        


    }

    makeSale(value){

        return value;

    }

    //returns false if you cant afford x
    purchase(amount){

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










