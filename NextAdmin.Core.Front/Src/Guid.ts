
namespace NextAdmin {
    export class Guid {

        private _guid: string;

        constructor(guid?: string) {
            this._guid = guid.toLowerCase();
        }

        public toString(): string {
            return this._guid;
        }


        // Static member
        static newGuid(): Guid {
            return new Guid(Guid.createStrGuid());
        }

        static createStrGuid(): string {
            var result: string;
            var i: string;
            var j: number;

            result = "";
            for (j = 0; j < 32; j++) {
                if (j == 8 || j == 12 || j == 16 || j == 20)
                    result = result + '-';
                i = Math.floor(Math.random() * 16).toString(16);
                result = result + i;
            }
            return result;
        }


    }
}