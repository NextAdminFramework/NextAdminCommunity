namespace NextAdmin {

    export class DateTime {


        public static now(): Date {
            return new Date();
        }

        public static firstDayOfYear(): Date {
            return new Date(this.now().getFullYear(), 0, 1);
        }

        public static firstDayOfMonth(): Date {
            return new Date(this.now().getFullYear(), this.now().getMonth(), 1);
        }

    }

}