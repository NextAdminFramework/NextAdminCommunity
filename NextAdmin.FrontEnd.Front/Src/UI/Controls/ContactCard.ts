namespace NextAdmin.UI {

    export class ContactCard extends HorizontalFlexLayout {

        options: ContactCardOptions;

        infosContainer: HTMLDivElement;

        public static style = `

        .next-admin-contact-card{
            .map-container{
                @media (min-width: 769px) {
                    width:40%;
                }
            }
            .contact-infos-centered-container{
                @media (max-width: 768px) {
                    margin-top:20px;
                }
                @media (min-width: 769px) {
                    position:relative;
                    top:50%;
                    transform:perspective(1px) translateY(-50%);
                }
            }
        }

        `;

        constructor(options: ContactCardOptions) {
            super({
                responsiveMode: HorizontalLayoutResponsiveMode.medium,
                ...options
            });
            NextAdmin.Style.append('NextAdmin.UI.ContactCard', ContactCard.style);
            this.element.classList.add('next-admin-contact-card');


            if (!NextAdmin.String.isNullOrEmpty(this.options.contactAddress)) {
                this.appendHTML('div', (mapContainer) => {
                    mapContainer.classList.add('map-container');
                    mapContainer.appendControl(new NextAdmin.UI.MapboxMap({
                        mapboxAccessToken: this.options.mapboxAccessToken,
                        mapboxDependencyRootUrl: this.options.mapboxDependencyRootUrl,
                        initialLocationAddress: this.options.contactAddress,
                        hasMarkerToInitialLocation: true,
                        height: '400px',
                        css: {
                            borderRadius: '20px',
                            boxShadow: '0px 0px 2px rgba(0,0,0,0.5)'

                        }
                    }));
                });
            }

            this.appendHTMLStretch('div', (infosContainer) => {
                infosContainer.style.paddingLeft = '20px';
                infosContainer.style.userSelect = 'text';

                this.infosContainer = infosContainer.appendHTML('div', (centeredContainer) => {
                    centeredContainer.classList.add('contact-infos-centered-container');

                    if (!NextAdmin.String.isNullOrEmpty(this.options.contactName)) {
                        centeredContainer.appendControl(new NextAdmin.UI.Title({
                            style: NextAdmin.UI.TitleStyle.greyThin,
                            size: NextAdmin.UI.TitleSize.medium,
                            text: this.options.contactName.toLocaleUpperCase(),
                            css: { marginBottom: '10px' }
                        }));
                    }
                    if (!NextAdmin.String.isNullOrEmpty(this.options.contactEmail)) {
                        centeredContainer.appendControl(new NextAdmin.UI.Title({
                            style: NextAdmin.UI.TitleStyle.lightGreyThin,
                            size: NextAdmin.UI.TitleSize.small,
                            text: Resources.emailIcon + ' ' + this.options.contactEmail,
                            css: { marginBottom: '10px' }
                        }));
                    }
                    if (!NextAdmin.String.isNullOrEmpty(this.options.contactPhone)) {
                        centeredContainer.appendControl(new NextAdmin.UI.Title({
                            style: NextAdmin.UI.TitleStyle.lightGreyThin,
                            size: NextAdmin.UI.TitleSize.small,
                            text: FrontEndResources.phoneIcon + ' ' + this.options.contactPhone,
                            css: { marginBottom: '10px' }
                        }));
                    }
                    if (!NextAdmin.String.isNullOrEmpty(this.options.contactAddress)) {
                        centeredContainer.appendControl(new NextAdmin.UI.Title({
                            style: NextAdmin.UI.TitleStyle.lightGreyThin,
                            size: NextAdmin.UI.TitleSize.small,
                            text: FrontEndResources.locationIcon + ' ' + this.options.contactAddress,
                            css: { marginBottom: '10px' }
                        }));
                        centeredContainer.appendControl(new NextAdmin.UI.Button({
                            text: FrontEndResources.mapIcon + ' ' + FrontEndResources.displayOnGoogleMap,
                            style: NextAdmin.UI.ButtonStyle.blue,
                            action: () => {
                                window.open('https://www.google.com/maps/place/' + encodeURI(this.options.contactAddress), '_blank');
                            }
                        }));
                    }

                });

            });

        }

    }

    export interface ContactCardOptions extends HorizontalFlexLayoutOptions {

        responsiveMode?: NextAdmin.UI.HorizontalLayoutResponsiveMode;

        contactName?: string;

        contactAddress?: string;

        contactEmail?: string;

        contactPhone?: string;

        mapboxAccessToken?: string;

        mapboxDependencyRootUrl?: string;

    }

}