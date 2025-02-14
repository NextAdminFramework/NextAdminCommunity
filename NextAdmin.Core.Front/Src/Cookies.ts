namespace NextAdmin {


  export class Cookies {



    public static get(cname: string) {
      let name = cname + "=";
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return null;
    }


    public static set(name: string, value: string, days: number = null) {
      let cookieString = name + "=" + value + ";path=/;";
      if (days != null && days > 0) {
        var d = new Date;
        d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
        cookieString += "expires=" + d.toUTCString();
      }
      document.cookie = cookieString
    }

    public  static delete(name:string) { Cookies.set(name, '', -1); }

  }


}
