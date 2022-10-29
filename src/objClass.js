class InventoryData {

    constructor(){
        
        this.apples = new IngredientData("Apples","FALL");
        this.pumpkins = new IngredientData("Pumkins","WINTER");
        this.berry =  new IngredientData("Berry","SPRING");
        this.corn = new IngredientData("Corn","SUMMER");
        //
        this.inStock = [(this.apples),(this.pumpkins),(this.berry),(this.corn)];

    }

    harvest(){
        //getSeason()
        Case()
    }


}

class IngredientData {
    constructor(name,season){
        
        this.name = name;
        this.level = 0;
        this.yield = 1;
        
    }
    
    crop(

    )

    levelUp()

    
}