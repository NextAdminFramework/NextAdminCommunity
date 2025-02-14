

interface Date {

    /**Retourne le nombre total de jour depuis l'an 0*/
    getTotalDays();

    getWeek();

    addDays(days: number): Date;

    addMonths(days: number): Date;

    addYears(years: number): Date;

    clone(): Date;

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

}
catch
{

}
