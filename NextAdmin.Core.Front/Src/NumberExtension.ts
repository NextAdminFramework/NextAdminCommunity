interface Number {


    toStringDigit(digitCount: number): string;

}


try {

    Number.prototype.toStringDigit = function (digitCount: number) {
        return this.toString().ToDigit(digitCount);
    };

}
catch
{

}
