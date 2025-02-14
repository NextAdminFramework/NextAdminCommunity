namespace NextAdmin {


  export class Copy {



    public static copyTo(source: any, target: any) {
      for (let key in source) {
        target[key] = source[key];
      }
    }

    public static clone<T>(objectToClone: T): T {
      return JSON.parse(JSON.stringify(objectToClone)) as T;
    }


  }


}
