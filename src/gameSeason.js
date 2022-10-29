const SPEED = 9000;

let gameCalender= {
    year: 1,
    month: 1,
}

let gameClock = setInterval(function(){
    addMonth();

}, SPEED);

function addMonth(){
    if(gameCalender.month !== 12){
        gameCalender.month++;
    }
    else{
        gameCalender.month = 1;
        gameCalender.year++;
    }
    
}

function getSeason(){
    let month = gameCalender.month 
    if(month > 3 && month < 6){
        return 'spring';
    }
    if(month > 6 && month < 9){
        return 'summer';
    }
    if(month > 9 && month < 12){
        return 'fall';
    }
    if(month > 12 && month < 3){
        return 'winter';
    }
}

function isendoftheMonth(){
        let endoftheMonth = false;

    switch (true){
        case(gameCalender.month === 1):
            endoftheMonth = true;
            break;
        case(gameCalender.month === 2):
            endoftheMonth = true;
            break;
        case(gameCalender.month === 3):
            endoftheMonth = true;
            break;
        case(gameCalender.month === 4):
            endoftheMonth = true;
            break;  
        case(gameCalender.month === 5):
            endoftheMonth = true;
            break;
        case(gameCalender.month === 6):
            endoftheMonth = true;
            break;
        case(gameCalender.month === 7):
            endoftheMonth = true;
            break; 
        case(gameCalender.month === 8 ):
            endoftheMonth = true;
            break;
        case(gameCalender.month === 9):
            endoftheMonth = true;
            break;
        case(gameCalender.month === 10):
            endoftheMonth = true;
            break;
        case(gameCalender.month === 11):
            endoftheMonth = true;
            break;  
        case(gameCalender.month === 12):
            endoftheMonth = true;
            break;
        default:
            endoftheMonth = false; 
    }

    return endoftheMonth;
}