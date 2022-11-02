const SPEED = 9000;
let eventCall = 0;
let gameCalender= {
    year: 1,
    month: 3,
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
    eventCall++;
    if(eventCall % 3 != 0){
        eventEmitter.trigger('seasonCycle');
    }
}

function getSeason(){
    let month = gameCalender.month 
    if(month > 3 && month <= 6){
        return 'spring';
    }
    if(month > 6 && month <= 9){
        return 'summer';
    }
    if(month > 9 && month <= 12){
        return 'fall';
    }
    if(month >= 1 && month <= 3){
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

class Calendar {
    constructor(options = {}) {
        this.month = options.month || 0; // 0 - 11

        this.timer = 0;
        this.monthInterval = 10000; // ten seconds per month

        this.events = new EventEmitter();
    }

    getSeason() {
        return Math.floor(this.getMonth() / 3);
    }

    get season() {
        return this.getSeason();
    }

    getMonth() {
        return this.month;
    }

    nextMonth() {
        const lastSeason = this.getSeason();

        if (this.month >= 11) {
            this.month = 0;
        } else {
            this.month += 1;
        }
        this.events.trigger('monthchange', {month: this.month, season: this.season});

        if (this.getSeason() !== lastSeason) {
            this.events.trigger('seasonchange', {month: this.month, season: this.season});
        }

        return this;
    }

    update(delta, time) {
        this.timer += delta;

        while (this.timer > this.monthInterval) {
            this.nextMonth();
            this.timer -= this.monthInterval;
        }
    }

    getMonthName(month = this.month) {
        return Calendar.MonthNames[month];
    }

    getSeasonName(season = this.season) {
        return Calendar.SeasonNames[season];
    }

    static SeasonNames = [
        'Winter',
        'Spring',
        'Summer',
        'Fall',
    ];

    static MonthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
}
