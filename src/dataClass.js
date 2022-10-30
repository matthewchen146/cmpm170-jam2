


//The middleman between the chef and ingredients
//Tracks ingredient production and stockpiles
//Checks if there is enough ingredients to make a 
//Recipe
class InventoryData {

    constructor(){
        
        this.seasonbuff[1.5,1,0,.5];
        this.apples = new IngredientData('Apples','fall');
        this.pumpkins = new IngredientData('Pumkins','winter');
        this.berry =  new IngredientData('Berry','spring');
        this.corn = new IngredientData('Corn','summer');
        

        this.inStock = [(this.berry),(this.corn),(this.pumpkins),(this.apples)];
        this.stockCount = [0,0,0,0];
        this.outgoing = [0,0,0,0];
    }
     //updates every second incrementing the total amount of produce by the yield
    update(){
    this.seasonbuff = eventEmitter.on('seasonCycle', sBuffCalc());
    
    for(let  x = 0; y < 4; x++){
        this.stockCount[x] += this.inStock[x].crop(this.seasonbuff[x]);
        if(this.stockCount[x]<this.outgoing[x]){

            //function that stops production in chef
        } 
        else{
            this.stockCount[x]-=this.outgoing[x];
        }   
    }
    

       
    }
    //recipes request ingredient amount per second 
    //every time recipe changes or scales
    //outgoing amounts 
   
    
    request(ingredient,amount){
        switch(ingredient){
            case 'Berry':
                this.outgoing[0]=amount;
                return ;
                
            case 'Corn':
                this.outgoing[1]=amount;
                return ;
            case 'Apples': 
            this.outgoing[2]=amount;
                return ;
            case 'Pumpkins':
                this.outgoing[3]=amount;
                return ;
            default:
                console.log('uhoh');
                return

        }
        
    }


    sBuffCalc(){

        buffval = [0,0,0,0];
        switch(getSeason()){

            case 'spring':
                return buffval[1.5,1,0,.5];
                
            case 'summer':
                return buffval[1,1.5,1,0];
            
            case 'winter': 
                return buffval[0,.5,1.5,1];
            case 'fall':
                return buffval[1.5,1,.5,0];
            default:
                console.log('uhoh');
                break;

        }
    }

    
    

}

class IngredientData {
    constructor(name,season){
        
        this.name = name;
        this.season =season;
        this.level = 0;
        this.yield = 1;
        
    }
    
    crop(passedbuff){
        return this.yield*passedbuff;
    }

    levelUp(){

    }

    yieldUp(){

    }

    
}

class Chef {




}
