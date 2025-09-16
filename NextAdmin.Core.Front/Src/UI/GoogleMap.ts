namespace NextAdmin.UI {

    export class GoogleMap extends Control {


        options: GoogleMapOptions;

        map: any;/*Google map object*/

        constructor(options?: GoogleMapOptions) {
            super('div', {
                height: '400px',
                initialLocation: { lat: -34.397, lng: 150.644 },
                initialZoom: 8,
                ...options
            } as GoogleMapOptions);
            if (NextAdmin.String.isNullOrEmpty(this.options.apiKey)) {
                throw new Error("API key is required to init GoogleMap");
            }
            this.element.style.height = this.options.height;
            this.initializeMap();
        }

        async initializeMap() {
            await NextAdmin.Script.load(GoogleMap.getGoogleMapScriptUrl(this.options.apiKey), 'NextAdmin.UI.GoogleMap');
            const { Map } = await google.maps.importLibrary("maps");
            this.map = new Map(this.element, {
                center: this.options.initialLocation,
                zoom: this.options.initialZoom,
            });
        }

        public static getGoogleMapScriptUrl(key: string) {
            return 'https://maps.googleapis.com/maps/api/js?key=' + key + '&libraries=maps&v=beta';
        }
    }

    export interface GoogleMapOptions extends ControlOptions {

        apiKey?: string;

        height?: string;

        initialLocation?: { lat: number, lng: number };

        initialZoom?: number;

    }
}

declare var google: any;
