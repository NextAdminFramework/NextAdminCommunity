namespace NextAdmin {

    export class UserAgent {

        public static isSafari(): boolean {
            return navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0;
        }

        public static isChrome(): boolean {
            return window['chrome'] != null;
        }

        public static isFireFox(): boolean {
            return navigator.userAgent.indexOf("Firefox") > -1;
        }

        public static isEdge(): boolean {
            return navigator.userAgent.indexOf("Edge") > -1;
        }

        public static isIE11(): boolean {
            return navigator.userAgent.indexOf("Trident/") > -1;
        }

        public static isIE10OrOlder(): boolean {
            return navigator.userAgent.indexOf("MSIE ") > -1;
        }

        public static isAndroid(): boolean {
            return navigator.userAgent.match(/Android/i) != null;
        }

        public static isIOS(): boolean {
            return UserAgent.isIPad() || UserAgent.isIPhone();
        }

        public static isIPad(): boolean {
            return navigator.userAgent.match(/iPad/i) != null;
        }

        public static isIPhone(): boolean {
            return navigator.userAgent.match(/iPhone/i) != null;
        }

        public static isMobile(): boolean {
            return UserAgent.isAndroid() || UserAgent.isIOS();
        }

        public static isDesktop(): boolean {
            return !UserAgent.isMobile();
        }
    }
}