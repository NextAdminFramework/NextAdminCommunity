namespace NextAdmin.UI {

    export class ThirdPartyOauthPanel extends Control {

        options: ThirdPartyOauthPanelOptions;

        constructor(options?: ThirdPartyOauthPanelOptions) {
            super('div', {
                afterOAuthUrlCookieName: 'AFTER_OAUTH_URL',
                ...options
            } as ThirdPartyOauthPanelOptions)

            this.element.appendControl(new NextAdmin.UI.HorizontalFlexLayout({ css: { marginBottom: '20px', marginTop: '20px' } }), (flexLayout) => {
                flexLayout.appendHTMLStretch('div', (stretchContainer) => {
                    stretchContainer.appendHTML('div', (border) => {
                        border.style.borderBottom = '1px solid #ddd';
                        border.centerVertically();
                    });
                });
                flexLayout.appendHTML('div', (text) => {
                    text.style.padding = '10px';
                    text.innerHTML = FrontEndResources.or.toUpperCase();
                });
                flexLayout.appendHTMLStretch('div', (stretchContainer) => {
                    stretchContainer.appendHTML('div', (border) => {
                        border.style.borderBottom = '1px solid #ddd';
                        border.centerVertically();
                    });
                });
            });


            if (this.options.googleOauthOptions) {
                this.element.appendControl(new NextAdmin.UI.Button({
                    size: NextAdmin.UI.ButtonSize.large,
                    text: FrontEndResources.googleIcon + ' ' + FrontEndResources.signInWithGoogle,
                    action: () => {
                        if (this.options.afterOAuthUrlCookieName) {
                            NextAdmin.Cookies.set(this.options.afterOAuthUrlCookieName, window.location.href);
                        }
                        window.location.href = ThirdPartyOauthPanel.getOAuthUrl(this.options.googleOauthOptions);
                    }
                }), (btn) => {
                    btn.element.style.width = '100%';
                });
            }

        }

        public static getOAuthUrl(oAuthOptions: GoogleOauthOptions, userGmailEmailAddress?: string): string {
            let url = oAuthOptions?.oauthUrl ?? ('https://accounts.google.com/o/oauth2/v2/auth?client_id='
                + oAuthOptions.clientId
                + '&redirect_uri=' + oAuthOptions.redirectionUrl
                + '&response_type=code'
                + '&scope=' + encodeURI((oAuthOptions.scopes ?? ['https://www.googleapis.com/auth/userinfo.email']).join(' ')));
            if (userGmailEmailAddress) {
                url += '&login_hint=' + userGmailEmailAddress
            }
            return url;
        }


    }


    export interface ThirdPartyOauthPanelOptions extends ControlOptions {


        googleOauthOptions?: GoogleOauthOptions;

        afterOAuthUrlCookieName?: string;

    }


    export interface GoogleOauthOptions {

        oauthUrl?: string;

        clientId?: string;

        redirectionUrl?: string;

        scopes?: Array<string>;

    }

}