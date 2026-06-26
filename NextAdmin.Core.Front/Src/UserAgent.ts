namespace NextAdmin {

    export class UserAgent {

        public static isSafari(): boolean {
            try {
                return navigator?.userAgent?.search("Safari") >= 0 && navigator?.userAgent?.search("Chrome") < 0;
            } catch {
                return false;
            }
        }

        public static isChrome(): boolean {
            try {
                return window['chrome'] != null;
            } catch {
                return false;
            }
        }

        public static isFireFox(): boolean {
            try {
                return navigator?.userAgent?.indexOf("Firefox") > -1;
            } catch {
                return false;
            }
        }

        public static isEdge(): boolean {
            try {
                return navigator?.userAgent?.indexOf("Edge") > -1;
            } catch {
                return false;
            }
        }

        public static isIE11(): boolean {
            try {
                return navigator?.userAgent?.indexOf("Trident/") > -1;
            } catch {
                return false;
            }
        }

        public static isIE10OrOlder(): boolean {
            try {
                return navigator?.userAgent?.indexOf("MSIE ") > -1;
            } catch {
                return false;
            }
        }

        public static isAndroid(): boolean {
            try {
                return navigator?.userAgent?.match(/Android/i) != null;
            } catch {
                return false;
            }
        }

        public static isIPad(): boolean {
            try {
                return navigator?.userAgent?.match(/iPad/i) != null;
            } catch {
                return false;
            }
        }

        public static isIPhone(): boolean {
            try {
                return navigator?.userAgent?.match(/iPhone/i) != null;
            } catch {
                return false;
            }
        }

        public static isIOS(): boolean {
            return UserAgent.isIPad() || UserAgent.isIPhone();
        }

        public static isMobile(): boolean {
            return UserAgent.isAndroid() || UserAgent.isIOS();
        }

        public static isDesktop(): boolean {
            return !UserAgent.isMobile();
        }
    }
}