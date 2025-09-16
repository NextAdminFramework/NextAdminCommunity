

interface Date {

    /**Retourne le nombre total de jour depuis l'an 0*/
    getTotalDays();

    getWeek();

    truncateToDate();

    truncateToHour();

    truncateToMinute();

    addSeconds(seconds: number): Date;

    addMinutes(minutes: number): Date;

    addHours(hours: number): Date;

    addDays(days: number): Date;

    addMonths(days: number): Date;

    addYears(years: number): Date;

    clone(): Date;

    toLocalShortTimeString(timeSeparator?: string): string;

    toISODateString(): string;

    isToday(): boolean;
}



try {

    Date.prototype.getWeek = function () {
        var date = new Date(this.getTime());
        date.setHours(0, 0, 0, 0);
        // Thursday in current week decides the year.
        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        // January 4 is always in week 1.
        var week1 = new Date(date.getFullYear(), 0, 4);
        // Adjust to Thursday in week 1 and count number of weeks from date to week1.
        return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
            - 3 + (week1.getDay() + 6) % 7) / 7);
    };


    Date.prototype.truncateToDate = function (): Date {
        let _this = this as Date;
        _this.setHours(0);
        _this.setMinutes(0);
        _this.setSeconds(0);
        _this.setMilliseconds(0);
        return this;
    };

    Date.prototype.truncateToHour = function (): Date {
        let _this = this as Date;
        _this.setMinutes(0);
        _this.setSeconds(0);
        _this.setMilliseconds(0);
        return this;
    };

    Date.prototype.truncateToMinute = function (): Date {
        let _this = this as Date;
        _this.setSeconds(0);
        _this.setMilliseconds(0);
        return this;
    };

    Date.prototype.addSeconds = function (seconds: number): Date {
        let _this = this as Date;
        _this.setSeconds(_this.getSeconds() + seconds);
        return this;
    };

    Date.prototype.addMinutes = function (minutes: number): Date {
        let _this = this as Date;
        _this.setMinutes(_this.getMinutes() + minutes);
        return this;
    };

    Date.prototype.addHours = function (hours: number): Date {
        let _this = this as Date;
        _this.setHours(_this.getHours() + hours);
        return this;
    };

    Date.prototype.addDays = function (days: number): Date {
        this.setDate(this.getDate() + days);
        return this;
    };

    Date.prototype.addMonths = function (months: number): Date {
        let d = <Date>this;
        d.setMonth(d.getMonth() + months);
        return this;
    };


    Date.prototype.addYears = function (years: number): Date {
        let d = <Date>this;
        d.setFullYear(d.getFullYear() + years);
        return d;
    };

    Date.prototype.clone = function (): Date {
        return new Date(this as Date);
    };

    Date.prototype.getTotalDays = function (): number {
        const millisecondsPerDay = 24 * 60 * 60 * 1000; // Nombre de millisecondes dans une journée
        const diffInMilliseconds = (<Date>this).getTime() - new Date(0, 0, 1).getTime(); // Différence en millisecondes
        return Math.floor(diffInMilliseconds / millisecondsPerDay);
    };

    Date.prototype.toLocalShortTimeString = function (timeSeparator = ':'): string {
        let _this = this as Date;
        return _this.getHours() + timeSeparator + NextAdmin.Numeric.pad(_this.getMinutes(), 2);
    };

    Date.prototype.toISODateString = function (): string {
        let _this = this as Date;
        return _this.toISOString().substring(0, 10);
    };

    Date.prototype.isToday = function (): boolean {
        let _this = this as Date;
        return _this.toISODateString() == new Date().toISODateString();
    };

}
catch
{

}
