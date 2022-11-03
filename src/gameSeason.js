

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
