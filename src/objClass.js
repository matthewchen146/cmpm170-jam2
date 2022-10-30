

class InventoryData {

    constructor(){
        
        this.seasonbuff[1.5,1,0,.5];
        this.apples = new IngredientData('Apples','fall');
        this.pumpkins = new IngredientData('Pumkins','winter');
        this.berry =  new IngredientData('Berry','spring');
        this.corn = new IngredientData('Corn','summer');
        

        this.inStock = [(this.berry),(this.corn),(this.pumpkins),(this.apples)];
        this.stockCount = [0,0,0,0];
    }
     //updates every second incrementing the total amount of produce by the yield
    harvest(){
    this.seasonbuff = eventEmitter.on('seasonCycle', sBuffCalc());
    
    for(let  x = 0; y < 4; x++){
        this.stockCount[x] += this.inStock[x].crop(this.seasonbuff[x]);    
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

    // increment and decrement items in the  stockcount array
    

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

    
}