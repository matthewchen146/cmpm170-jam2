var SPEED = 1000;

var gameCalender= {
    year: 1,
    month: 1,
    day: 1,
    hour: 1
}

var playerItem = {
    pumpkin: 1,
    secEarnPumpkin: 1,
    inventory: {}
}

function wantPumpkin(){
    playerItem.pumpkin += playerItem.secEarnPumpkin;
    constructPumpkin();
}

var gameClock = setInterval(function(){
    addHour();

}, SPEED);

function addHour(){
    if (gameCalender.hour !== 24){
        gameCalender.hour++
    }
    else {
        gameCalender.hour = 1;
        addDay();
    }
    console.log("Hour is now: " + gameCalender.hour);
    constructCalender();
    wantPumpkin() ;
};

function addDay(){
    var endoftheMonth = isendoftheMonth();
    console.log("this is the end of the month: ", endoftheMonth)
    if (endoftheMonth === false){
        gameCalender.day++;
    }
    else{
        gameCalender.day = 1;
        addMonth();
    }
    console.log("Day is now: " + gameCalender.hour);
    constructCalender()
}

function addMonth(){
    if(gameCalender.month !== 12){
        gameCalender.month++;
    }
    else{
        gameCalender.month = 1;
        gameCalender.year++;
    }
    
    constructCalender()
}

//constructor functions
function constructCalender(){
    var timeSection = document.getElementById('game-time');

    var timeMessage = " Year: " + gameCalender.year + " Month: " + gameCalender.month  + 
    " Day: " + gameCalender.day+ " Hour: " + gameCalender.hour; 

    timeSection.innerText = timeMessage;
}
function constructPumpkin(){
    var pumpkinSection = document.getElementById('pumpkin-gain');

    var pumpkinMessage = "Pumpkin: " + playerItem.pumpkin;
    
    pumpkinSection = pumpkinMessage;
}

function isendoftheMonth(){
        var endoftheMonth = false;

    switch (true){
        case(gameCalender.month === 1 && gameCalender.day === 31):
            endoftheMonth = true;
            break;
        case(gameCalender.month === 2 && gameCalender.day === 28):
            endoftheMonth = true;
            break;
        case(gameCalender.month === 3 && gameCalender.day === 31):
            endoftheMonth = true;
            break;
        case(gameCalender.month === 4 && gameCalender.day === 30):
            endoftheMonth = true;
            break;  
        case(gameCalender.month === 5 && gameCalender.day === 31):
            endoftheMonth = true;
            break;
        case(gameCalender.month === 6 && gameCalender.day === 30):
            endoftheMonth = true;
            break;
        case(gameCalender.month === 7 && gameCalender.day === 31):
            endoftheMonth = true;
            break; 
        case(gameCalender.month === 8 && gameCalender.day === 31):
            endoftheMonth = true;
            break;
        case(gameCalender.month === 9 && gameCalender.day === 30):
            endoftheMonth = true;
            break;
        case(gameCalender.month === 10 && gameCalender.day === 31):
            endoftheMonth = true;
            break;
        case(gameCalender.month === 11 && gameCalender.day === 30):
            endoftheMonth = true;
            break;  
        case(gameCalender.month === 12 && gameCalender.day === 31):
            endoftheMonth = true;
            break;
        default:
            endoftheMonth = false; 
    }

    return endoftheMonth;
}