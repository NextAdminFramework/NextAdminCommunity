namespace NextAdmin {

    export class Numeric {

        public static pad(number: number, digitCount: number) {

            let strNumber = number.toFixed(0);
            while (strNumber.length < digitCount) {
                strNumber = "0" + strNumber;
            }
            return strNumber;

        }


    }

}