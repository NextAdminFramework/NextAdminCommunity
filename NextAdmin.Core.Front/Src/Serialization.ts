namespace NextAdmin {

    export class Serialization {

        public static parseJsonAsync<T>(data: string, result?: ((result: T) => any)) {
            (new Response(data)).json().then(value => {
                result(value);
            });
        }

        public static fromJsonBase64<T>(data: string): T {
            return JSON.parse(atob(data));
        }
    }
}