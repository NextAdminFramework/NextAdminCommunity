/*-----LICENCE------
 * NextAdmin.FrontEnd.js v1.0.0
 * Copyright (c) 2023, Maxime AVART
 * Licensed under the MIT License:
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 
------------------*/ 
var NextAdmin;
(function (NextAdmin) {
    class FrontAppController extends NextAdmin.NavigationController {
        constructor(options) {
            super({
                httpClient: new NextAdmin.Services.HttpClient(),
                canSignIn: true,
                canSignUp: true,
                defaultFontPath: '/Content/Dependencies/Fonts/OpenSans-Regular.ttf',
                signUpModalFactory: (options) => new NextAdmin.UI.SignUpModal(options),
                signInModalFactory: (options) => new NextAdmin.UI.SignInModal(options),
                ...options
            });
            this.onUserSignIn = new NextAdmin.EventHandler();
            this.onUserSignUp = new NextAdmin.EventHandler();
            this.onUserLogged = new NextAdmin.EventHandler();
            this.onUserLogOut = new NextAdmin.EventHandler();
            this.onCultureChanged = new NextAdmin.EventHandler();
            this.httpClient = this.options.httpClient;
            this.userClient = this.options.userClient;
            NextAdmin.FrontApp = this;
        }
        async startApp(navigateToUrl) {
            NextAdmin.Style.append('NextAdmin.FrontAppController', FrontAppController.style.replaceAll('@NextAdminDefaultFontPath', this.options.defaultFontPath));
            if (this.pageContainer) {
                this.pageContainer.startSpin();
            }
            let user = (await this.userClient.getUserByToken());
            if (user != null) {
                await this.logUser(user);
            }
            if (NextAdmin.String.isNullOrEmpty(this.user?.culture)) {
                this.setCulture(this.getCulture());
            }
            if (this.pageContainer) {
                this.pageContainer.stopSpin();
            }
            if (navigateToUrl) {
                this.navigateToUrl();
            }
        }
        async logUser(user) {
            if (user == null) {
                return;
            }
            this.user = user;
            if (!NextAdmin.String.isNullOrEmpty(this.user.culture)) {
                this.setCulture(this.user.culture);
            }
            else {
                await this.refresh();
            }
            this.onUserLogged.dispatch(this, this.user);
        }
        logOutUser() {
            this.userClient.deleteCurrentAuthToken();
            this.onUserLogOut.dispatch(this, this.user);
            this.user = null;
        }
        signIn(onSignIn) {
            if (!this.options.canSignIn || this.options.signInModalFactory == null) {
                return;
            }
            let modal = this.options.signInModalFactory({
                userClient: this.userClient,
                onSignIn: async (response) => {
                    await this.logUser(response.user);
                    this.onUserSignIn.dispatch(this, response.user);
                    if (onSignIn) {
                        onSignIn(response.user);
                    }
                },
                signUpAction: () => this.signUp((user) => {
                    this.onUserSignUp.dispatch(this, user);
                    if (onSignIn) {
                        onSignIn(user);
                    }
                })
            });
            modal.open();
        }
        signUp(onSignUp) {
            if (!this.options.canSignUp || this.options.signUpModalFactory == null) {
                return;
            }
            let modal = this.options.signUpModalFactory({
                userClient: this.userClient,
                onSignUp: async (userName, userPassword) => {
                    let authUserResponse = await this.userClient.authUser(userName, userPassword);
                    if (authUserResponse?.isSuccess) {
                        await this.logUser(authUserResponse.user);
                        this.onUserSignUp.dispatch(this, authUserResponse.user);
                        if (onSignUp) {
                            onSignUp(authUserResponse.user);
                        }
                    }
                },
                signInAction: () => this.signIn((user) => {
                    this.onUserSignIn.dispatch(this, user);
                    if (onSignUp) {
                        onSignUp(user);
                    }
                })
            });
            modal.open();
        }
        getCulture() {
            return (NextAdmin.Cookies.get('culture') ?? window.navigator.language) ?? 'en-US';
        }
        getLanguage() {
            let culture = NextAdmin.Cookies.get('culture');
            return NextAdmin.String.isNullOrEmpty(culture) ? 'en' : culture.substr(0, 2);
        }
        async setCulture(culture, updateUserCulture) {
            this.initializeResources(culture.substring(0, 2));
            NextAdmin.Cookies.set('culture', culture);
            this.onCultureChanged.dispatch(this, culture);
            await this.refresh();
            if (updateUserCulture && this.user) {
                await this.userClient.setUserCulture(culture);
            }
        }
        initializeResources(language) {
            if (!language) {
                language = window?.navigator?.language;
            }
            if (language) {
                language = language?.substring(0, 2);
            }
            switch (language) {
                case 'fr':
                    NextAdmin.Resources = new NextAdmin.ResourcesFr();
                    NextAdmin.FrontEndResources = new NextAdmin.FrontEndResourcesFr();
                default:
                case 'en':
                    NextAdmin.Resources = new NextAdmin.ResourcesEn();
                    NextAdmin.FrontEndResources = new NextAdmin.FrontEndResourcesEn();
            }
            return language;
        }
    }
    FrontAppController.style = `

        @font-face {
          font-family: "NextAdminDefaultFont";
          src: url(@NextAdminDefaultFontPath);
        }

        body {
            font-family:NextAdminDefaultFont,calibri,helvetica,roboto,sans-serif;
            font-size:14px;
            margin:0px;
        }

        `;
    NextAdmin.FrontAppController = FrontAppController;
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    class FrontEndResourcesBase {
        constructor() {
            this.googleIcon = '<i class="fab fa-google"></i>';
            this.locationIcon = '<i class="fas fa-map-marker"></i>';
            this.mapIcon = '<i class="fas fa-map"></i>';
            this.phoneIcon = '<i class="fas fa-phone"></i>';
        }
    }
    NextAdmin.FrontEndResourcesBase = FrontEndResourcesBase;
})(NextAdmin || (NextAdmin = {}));
/// <reference path="FrontEndResourcesBase.ts"/>
var NextAdmin;
(function (NextAdmin) {
    class FrontEndResourcesEn extends NextAdmin.FrontEndResourcesBase {
        constructor() {
            super(...arguments);
            this.contact = 'Contact';
            this.send = 'Send';
            this.messageSentTitle = 'Message sent';
            this.messageSentText = 'Your message has been sent, we will respond to you as soon as possible.';
            this.display = 'Display';
            this.verifyInformations = 'Verify the information';
            this.or = 'Or';
            this.signInWithGoogle = 'Sign-in with Google';
            this.signUpWithGoogle = 'Sign-up with Google';
            this.displayOnGoogleMap = "Display on google map";
        }
    }
    NextAdmin.FrontEndResourcesEn = FrontEndResourcesEn;
})(NextAdmin || (NextAdmin = {}));
/// <reference path="FrontEndResourcesEn.ts"/>
var NextAdmin;
(function (NextAdmin) {
    class FrontEndResourcesFr extends NextAdmin.FrontEndResourcesEn {
        constructor() {
            super(...arguments);
            this.contact = 'Contact';
            this.send = 'Envoyer';
            this.messageSentTitle = 'Message envoyé';
            this.messageSentText = 'Votre message a bien été envoyé, nous vous répondrons dans les plus brefs délais.';
            this.display = 'Afficher';
            this.verifyInformations = 'Vérifier les informations';
            this.or = 'Ou';
            this.signInWithGoogle = 'Se connecter avec Google';
            this.signUpWithGoogle = "S'inscrire avec Google";
            this.displayOnGoogleMap = "Afficher sur google map";
        }
    }
    NextAdmin.FrontEndResourcesFr = FrontEndResourcesFr;
    try {
        NextAdmin.FrontEndResources = navigator?.language?.startsWith('fr') ? new FrontEndResourcesFr() : new NextAdmin.FrontEndResourcesEn();
    }
    catch {
    }
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    var Services;
    (function (Services) {
        class FrontEndServiceClient extends Services.HttpClient {
            constructor(rootServiceURL = '/api/frontEnd/service', authTokenName, authToken) {
                super(rootServiceURL);
                this.authTokenName = authTokenName;
                if (authToken) {
                    this.setAuthToken(authToken);
                }
            }
            setAuthToken(authToken) {
                this.headerParams[this.authTokenName] = authToken;
            }
            getAuthToken() {
                if (this.authTokenName == null) {
                    return null;
                }
                return this.headerParams[this.authTokenName];
            }
            async sendContactMessage(message, email) {
                let httpResponse = await this.get('sendContactMessage', { message: message, email: email });
                if (httpResponse == null || !httpResponse.success) {
                    return null;
                }
                return httpResponse.parseJson();
            }
        }
        Services.FrontEndServiceClient = FrontEndServiceClient;
    })(Services = NextAdmin.Services || (NextAdmin.Services = {}));
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    var Services;
    (function (Services) {
        class FrontEndUserClient extends Services.UserClient {
            async changeEmailStep1(email, authToken) {
                if (authToken == null) {
                    authToken = this.getCurrentAuthToken();
                }
                if (NextAdmin.String.isNullOrEmpty(authToken)) {
                    return null;
                }
                this.headerParams[this.authTokenName] = authToken;
                let httpResponse = await this.get('changeUserEmailStep1', { email: email });
                delete this.headerParams[this.authTokenName];
                if (httpResponse == null || !httpResponse.success)
                    return null;
                return httpResponse.parseJson();
            }
            async changeEmailStep2(email, code, authToken) {
                if (authToken == null) {
                    authToken = this.getCurrentAuthToken();
                }
                if (NextAdmin.String.isNullOrEmpty(authToken)) {
                    return null;
                }
                this.headerParams[this.authTokenName] = authToken;
                let httpResponse = await this.get('changeUserEmailStep2', { email: email, code: code });
                delete this.headerParams[this.authTokenName];
                if (httpResponse == null || !httpResponse.success)
                    return null;
                return httpResponse.parseJson();
            }
            async deleteUser(authToken) {
                if (authToken == null) {
                    authToken = this.getCurrentAuthToken();
                }
                if (NextAdmin.String.isNullOrEmpty(authToken)) {
                    return null;
                }
                this.headerParams[this.authTokenName] = authToken;
                let httpResponse = await this.get('deleteUser');
                delete this.headerParams[this.authTokenName];
                if (httpResponse == null || !httpResponse.success)
                    return null;
                return httpResponse.parseJson();
            }
            async signUpUser(args) {
                let httpResponse = await this.postJson('signUpUser', args);
                if (httpResponse == null || !httpResponse.success) {
                    return null;
                }
                return httpResponse.parseJson();
            }
            async confirmUserSignUpEmailCode(userId, code) {
                let httpResponse = await this.postJson('confirmUserSignUpEmailCode', {
                    userId: userId,
                    code: code
                });
                if (httpResponse == null || !httpResponse.success) {
                    return null;
                }
                return httpResponse.parseJson();
            }
            async isUserAccountExist(email) {
                let httpResponse = await this.get('isUserAccountExist', {
                    email: email
                });
                if (httpResponse == null || !httpResponse.success) {
                    return null;
                }
                return httpResponse.parseJson();
            }
            async isUserAccountExistAndIsActivated(email) {
                let httpResponse = await this.get('isUserAccountExistAndIsActivated', {
                    email: email
                });
                if (httpResponse == null || !httpResponse.success) {
                    return null;
                }
                return httpResponse.parseJson();
            }
            async getUserAuthProviderName(email) {
                let httpResponse = await this.get('getUserAuthProviderName', {
                    email: email
                });
                if (httpResponse == null || !httpResponse.success) {
                    return null;
                }
                return httpResponse.content;
            }
        }
        Services.FrontEndUserClient = FrontEndUserClient;
    })(Services = NextAdmin.Services || (NextAdmin.Services = {}));
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    var Services;
    (function (Services) {
        class StripePaymentClient extends Services.HttpClient {
            constructor(rootServiceURL, authTokenName, authToken) {
                super(rootServiceURL ?? StripePaymentClient.defaultControllerUrl);
                this.authTokenName = authTokenName;
                if (authToken) {
                    this.setAuthToken(authToken);
                }
            }
            setAuthToken(authToken) {
                this.headerParams[this.authTokenName] = authToken;
            }
            async getItemStripePaymentLink(itemId) {
                let httpResponse = await this.get('getItemStripePaymentLink', { itemId: itemId });
                if (httpResponse == null || !httpResponse.success) {
                    return null;
                }
                return httpResponse.parseJson();
            }
        }
        StripePaymentClient.defaultControllerUrl = '/api/stripe/payment';
        Services.StripePaymentClient = StripePaymentClient;
    })(Services = NextAdmin.Services || (NextAdmin.Services = {}));
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    var Services;
    (function (Services) {
        class StripeSubscriptionPlanClient extends Services.HttpClient {
            constructor(rootServiceURL, authTokenName) {
                super(rootServiceURL ?? StripeSubscriptionPlanClient.defaultControllerUrl);
                this.authTokenName = authTokenName;
            }
            setAuthToken(authToken) {
                this.headerParams[this.authTokenName] = authToken;
            }
            async getSubscriptionStripePaymentLink(planId) {
                let httpResponse = await this.get('getSubscriptionStripePaymentLink', { planId: planId });
                if (httpResponse == null || !httpResponse.success) {
                    return null;
                }
                return httpResponse.parseJson();
            }
            async cancelSubscriptionAutoRenew(subscriptionId) {
                let httpResponse = await this.get('cancelSubscriptionAutoRenew', { subscriptionId: subscriptionId });
                if (httpResponse == null || !httpResponse.success) {
                    return null;
                }
                return httpResponse.parseJson();
            }
            async resumeSubscriptionAutoRenew(subscriptionId) {
                let httpResponse = await this.get('resumeSubscriptionAutoRenew', { subscriptionId: subscriptionId });
                if (httpResponse == null || !httpResponse.success) {
                    return null;
                }
                return httpResponse.parseJson();
            }
            async getUserInvoices() {
                let httpResponse = await this.get('getUserInvoices');
                if (httpResponse == null || !httpResponse.success) {
                    return null;
                }
                return httpResponse.parseJson();
            }
        }
        StripeSubscriptionPlanClient.defaultControllerUrl = '/api/stripe/subscription';
        Services.StripeSubscriptionPlanClient = StripeSubscriptionPlanClient;
    })(Services = NextAdmin.Services || (NextAdmin.Services = {}));
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    var UI;
    (function (UI) {
        class FrontDefaultStyle {
        }
        FrontDefaultStyle.PageContentMaxWidth = '1680px';
        FrontDefaultStyle.PrimaryColor = '#007bff';
        UI.FrontDefaultStyle = FrontDefaultStyle;
    })(UI = NextAdmin.UI || (NextAdmin.UI = {}));
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    var UI;
    (function (UI) {
        class AnimatedHoverText extends NextAdmin.UI.Control {
            constructor(options) {
                super('div', {
                    ...options
                });
                this._isHovertextVisible = false;
                NextAdmin.Style.append('NextAdmin.UI.AnimatedHoverText', AnimatedHoverText.style);
                this.element.classList.add('next-admin-hover-text');
                this.element.appendHTML('div', (centeredContainer) => {
                    centeredContainer.classList.add('next-admin-hover-text-centered-container');
                    centeredContainer.centerHorizontally();
                    this.hoverCenterredContainer = centeredContainer.appendHTML('div', (hoverText) => {
                        hoverText.classList.add('next-admin-hover-text-content');
                        this.hoverText = hoverText.appendHTML('div', (hoverTextText) => {
                            hoverTextText.classList.add('next-admin-hover-text-content-text');
                        });
                    });
                    this.underLine = centeredContainer.appendHTML('div', (underLine) => {
                        underLine.classList.add('next-admin-hover-text-underline');
                        underLine.centerHorizontally();
                    });
                });
                if (this.options.text) {
                    this.setText(this.options.text);
                }
                if (this.options.color) {
                    this.setColor(this.options.color);
                }
            }
            setText(text) {
                this.hoverText.innerHTML = text ?? '';
            }
            getText() {
                return this.hoverText.innerHTML;
            }
            setColor(color) {
                this.hoverText.style.color = color;
                this.underLine.style.backgroundColor = color;
            }
            async animDisplayText() {
                this._isHovertextVisible = true;
                if (!this.underLine.classList.contains('next-admin-hover-text-underline-visible')) {
                    this.underLine.classList.add('next-admin-hover-text-underline-visible');
                }
                await NextAdmin.Timer.sleep(400);
                if (!this._isHovertextVisible) {
                    return;
                }
                if (!this.hoverCenterredContainer.classList.contains('next-admin-hover-text-content-visible')) {
                    this.hoverCenterredContainer.classList.add('next-admin-hover-text-content-visible');
                }
            }
            async animHideText() {
                this._isHovertextVisible = false;
                this.hoverCenterredContainer.classList.remove('next-admin-hover-text-content-visible');
                await NextAdmin.Timer.sleep(400);
                if (this._isHovertextVisible) {
                    return;
                }
                this.underLine.classList.remove('next-admin-hover-text-underline-visible');
            }
        }
        AnimatedHoverText.style = `
        .next-admin-hover-text{

            position:relative;
            pointer-events: none;
            width:100%;
            color:#fff;
            text-shadow:0px 0px 4px rgba(0,0,0,0.9);
            transition: transform 0.9s;

            .next-admin-hover-text-centered-container{
                width:fit-content;
            }

            .next-admin-hover-text-underline{
                height:2px;
                width:0%;
                background-color:#ffffff;
                box-shadow:0px 0px 2px rgba(0,0,0,0.5);
                transition: all 0.4s;
            }
            .next-admin-hover-text-underline-visible{
                width:100%;
            }

            .next-admin-hover-text-content{
                font-size:22px;
                height:26px;
                overflow:hidden;
                visibility:hidden;
                display:block;
            }

            .next-admin-hover-text-content-visible{
                visibility:visible;
            }

            .next-admin-hover-text-content-text{
                display:block;
                margin-top:22px;
                transform: scale(0.5);
                transition: all 0.4s;
            }

            .next-admin-hover-text-content-visible .next-admin-hover-text-content-text{
                margin-top:0px;
                transform: scale(1);
            }
        }
        `;
        UI.AnimatedHoverText = AnimatedHoverText;
    })(UI = NextAdmin.UI || (NextAdmin.UI = {}));
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    var UI;
    (function (UI) {
        class Card extends UI.Control {
            constructor(options) {
                super('div', {
                    imageSize: 'cover',
                    imagePosition: 'center center',
                    isResponsive: true,
                    ...options
                });
                NextAdmin.Style.append('NextAdmin.UI.Card', Card.style);
                this.element.classList.add('next-admin-card');
                if (this.options.isResponsive) {
                    this.element.classList.add('responsive');
                }
                this.element.appendControl(new NextAdmin.UI.HorizontalFlexLayout(), (layout) => {
                    if (this.options.imageUrl) {
                        layout.appendHTML('div', (imageContainer) => {
                            imageContainer.classList.add('card-image');
                            imageContainer.style.background = 'url("' + this.options.imageUrl + '")';
                            imageContainer.style.backgroundSize = this.options.imageSize;
                            imageContainer.style.backgroundRepeat = 'no-repeat';
                            imageContainer.style.backgroundPosition = this.options.imagePosition;
                        });
                    }
                    layout.appendHTML('div', (cardBody) => {
                        cardBody.classList.add('card-body');
                        cardBody.appendControl(new NextAdmin.UI.VerticalFlexLayout(), (bodyLayout) => {
                            this.body = bodyLayout.appendHTMLStretch('div', (stretchContainer) => {
                                if (this.options.title) {
                                    this.title = stretchContainer.appendControl(new NextAdmin.UI.Title({
                                        size: NextAdmin.UI.TitleSize.medium,
                                        text: this.options.title
                                    }));
                                }
                                if (this.options.text) {
                                    this.textContainer = stretchContainer.appendHTML('div', (textContainer) => {
                                        textContainer.innerHTML = this.options.text;
                                    });
                                }
                                if (this.options.content) {
                                    stretchContainer.appendChild(this.options.content);
                                }
                            });
                            this.footer = bodyLayout.appendHTML('div', (footer) => {
                            });
                        });
                    });
                });
            }
        }
        Card.style = `

        .next-admin-card{
            width:100%;
            min-height:50px;
            margin-top:20px;
            margin-bottom:20px;
            box-shadow: 0px 0px 2px rgba(0,0,0,0.25);
            border-radius:10px;

            .card-image{
                height:100%;
                min-height:200px;
                width:200px;
                min-width:200px;
                max-width:200px;
            }

            .card-body{
                padding:10px;
            }
        }
        .next-admin-card.responsive{

            @media (max-width: 768px) {
                .card-image{
                    height:100%;
                    min-height:164px;
                    width:128px;
                    min-width:128px;
                    max-width:128px;
                }
            }
        }


        `;
        UI.Card = Card;
    })(UI = NextAdmin.UI || (NextAdmin.UI = {}));
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    var UI;
    (function (UI) {
        class CardPanel extends UI.Control {
            constructor(options) {
                super('div', {
                    isResponsive: true,
                    style: CardPanelStyle.lightBackgroundLargeFont,
                    ...options
                });
                NextAdmin.Style.append('NextAdmin.UI.CardPanel', CardPanel.style);
                this.element.classList.add('next-admin-card-panel');
                if (this.options.isResponsive) {
                    this.element.classList.add('responsive');
                }
                this.setStyle(this.options.style);
            }
            setStyle(style) {
                switch (style) {
                    case CardPanelStyle.lightBackgroundLargeFont:
                        this.element.classList.add('light-bg-large-font');
                        break;
                    default:
                    case CardPanelStyle.none:
                        break;
                }
            }
        }
        CardPanel.style = `

        .next-admin-card-panel{
            min-height:50px;
            margin-top:20px;
            margin-bottom:20px;
            box-shadow: 0px 0px 2px rgba(0,0,0,0.25);
            border-radius:10px;
            padding:20px;
        }
        .next-admin-card-panel.responsive{
            @media (max-width: 768px) {
                padding:10px;
            }
        }
        
        .next-admin-card-panel.light-bg-large-font{
            background:#f9f9f9;
            font-size:16px;
            color:#444;
            line-height:28px;
        }
        
        .next-admin-card-panel.light-bg-large-font.responsive{
            @media (max-width: 768px) {
                font-size:14px;
                line-height:20px;
            }
        }

        `;
        UI.CardPanel = CardPanel;
        let CardPanelStyle;
        (function (CardPanelStyle) {
            CardPanelStyle[CardPanelStyle["none"] = 0] = "none";
            CardPanelStyle[CardPanelStyle["lightBackgroundLargeFont"] = 1] = "lightBackgroundLargeFont";
        })(CardPanelStyle = UI.CardPanelStyle || (UI.CardPanelStyle = {}));
    })(UI = NextAdmin.UI || (NextAdmin.UI = {}));
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    var UI;
    (function (UI) {
        class CardsGrid extends NextAdmin.UI.Control {
            constructor(options) {
                super('div', {
                    margin: '10px',
                    ...options
                });
                NextAdmin.Style.append('NextAdmin.UI.CardsGrid', CardsGrid.style);
                this.element.classList.add('next-admin-cards-grid');
                this.header = this.element.appendHTML('div');
                this.body = this.element.appendHTML('div', (body) => {
                    body.classList.add('next-admin-cards-grid-body');
                });
                this.footer = this.element.appendHTML('div');
            }
            appendCard(card, controlOption) {
                this.body.appendControl(card, controlOption);
                card.element.style.margin = this.options.margin;
                return card;
            }
            appendControl(control, configAction) {
                return this.body.appendControl(control, configAction);
            }
            clear() {
                this.body.innerHTML = '';
            }
        }
        CardsGrid.style = `

        .next-admin-cards-grid{
            .next-admin-cards-grid-body{
                display:flex;
                flex-flow:wrap;
                place-content:center;
            }
        }

        `;
        UI.CardsGrid = CardsGrid;
        class CardsDataGrid extends CardsGrid {
            constructor() {
                super(...arguments);
                this.dataset = new Array();
            }
            cardFactory(data) {
                throw Error('Not implemented');
            }
            clear() {
                this.dataset = [];
                this.body.innerHTML = '';
            }
            setDataset(dataset) {
                this.clear();
                this.addDataset(dataset);
            }
            getDataset() {
                return this.dataset;
            }
            addDataset(dataset) {
                if (!dataset?.length) {
                    return;
                }
                for (let data of dataset) {
                    let card = this.cardFactory(data);
                    card['_data'] = data;
                    this.dataset.add(data);
                    this.appendCard(card);
                }
            }
        }
        UI.CardsDataGrid = CardsDataGrid;
    })(UI = NextAdmin.UI || (NextAdmin.UI = {}));
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    var UI;
    (function (UI) {
        class ContactCard extends UI.HorizontalFlexLayout {
            constructor(options) {
                super({
                    responsiveMode: UI.HorizontalLayoutResponsiveMode.medium,
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
                                text: NextAdmin.Resources.emailIcon + ' ' + this.options.contactEmail,
                                css: { marginBottom: '10px' }
                            }));
                        }
                        if (!NextAdmin.String.isNullOrEmpty(this.options.contactPhone)) {
                            centeredContainer.appendControl(new NextAdmin.UI.Title({
                                style: NextAdmin.UI.TitleStyle.lightGreyThin,
                                size: NextAdmin.UI.TitleSize.small,
                                text: NextAdmin.FrontEndResources.phoneIcon + ' ' + this.options.contactPhone,
                                css: { marginBottom: '10px' }
                            }));
                        }
                        if (!NextAdmin.String.isNullOrEmpty(this.options.contactAddress)) {
                            centeredContainer.appendControl(new NextAdmin.UI.Title({
                                style: NextAdmin.UI.TitleStyle.lightGreyThin,
                                size: NextAdmin.UI.TitleSize.small,
                                text: NextAdmin.FrontEndResources.locationIcon + ' ' + this.options.contactAddress,
                                css: { marginBottom: '10px' }
                            }));
                            centeredContainer.appendControl(new NextAdmin.UI.Button({
                                text: NextAdmin.FrontEndResources.mapIcon + ' ' + NextAdmin.FrontEndResources.displayOnGoogleMap,
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
        ContactCard.style = `

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
        UI.ContactCard = ContactCard;
    })(UI = NextAdmin.UI || (NextAdmin.UI = {}));
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    var UI;
    (function (UI) {
        class IconCard extends UI.Control {
            constructor(options) {
                super('div', {
                    ...options
                });
                NextAdmin.Style.append('next-admin-icon-card', IconCard.style);
                this.element.classList.add('next-admin-icon-card');
                this.element.appendHTML('div', (iconAndLabel) => {
                    iconAndLabel.classList.add('icon-card-icon-and-label');
                    iconAndLabel.appendHTML('div', async (icon) => {
                        icon.classList.add('icon-card-icon');
                        if (this.options.imageUrl) {
                            icon.style.backgroundImage = 'url(' + this.options.imageUrl + ')';
                            icon.style.backgroundRepeat = 'no-repeat';
                            icon.style.backgroundSize = 'cover';
                        }
                        else if (this.options.icon) {
                            icon.innerHTML = this.options.icon;
                            icon.style.backgroundColor = '#f0f0f0';
                        }
                        icon.addEventListener('click', () => {
                            if (this.options.action) {
                                this.options.action();
                            }
                        });
                    });
                    iconAndLabel.appendHTML('div', (span) => {
                        span.classList.add('icon-card-icon-label');
                        span.innerHTML = this.options.text;
                    });
                });
            }
        }
        IconCard.style = `

        .next-admin-icon-card{
            width:140px;
            height:140px;
            display:inline-block;
            position:relative;

            .icon-card-icon-and-label{
                width:120px;
                height:120px;
                margin:10px;
                display:block;
                position:absolute;

                .icon-card-icon{
                    background:#fff;
                    border-radius:4px;
                    box-shadow:0px 0px 2px rgba(0,0,0,0.25);
                    width:84px;
                    height:84px;
                    margin-left:18px;
                    font-size:40px;
                    color:#444;
                    text-align:center;
                    line-height:84px;
                    cursor:pointer;
                }
                .icon-card-icon:hover{
                    box-shadow:inset 0px 0px 2px rgba(0,0,0,0.25);

                }
                .icon-card-icon-label{
                    height:36px;
                    text-align:center;
                    padding-top:5px;
                }
            }

            @media screen and (max-width: 440px) {
                width:120px;
                height:120px;
                .icon-card-icon-and-label{
                    margin:0px;
                }
            }
        }
        `;
        UI.IconCard = IconCard;
    })(UI = NextAdmin.UI || (NextAdmin.UI = {}));
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    var UI;
    (function (UI) {
        class ImageCard extends NextAdmin.UI.Control {
            constructor(options) {
                super('div', {
                    size: ImageCardSize.medium_4_3,
                    style: ImageCardStyle.imageLightBorderedTextLeft,
                    isResponsive: true,
                    ...options
                });
                NextAdmin.Style.append('Eshop.UI.Card', ImageCard.style);
                this.element.classList.add('next-admin-image-card-wrapper');
                if (this.options.isResponsive) {
                    this.element.classList.add('responsive');
                }
                this.card = this.element.appendHTML('a', (card) => {
                    card.classList.add('next-admin-image-card');
                    if (this.options.backgroundColor) {
                        card.style.background = this.options.backgroundColor;
                    }
                    this.cardImage = card.appendHTML('div', (imageContainer) => {
                        imageContainer.classList.add('next-admin-image-card-image');
                    });
                    this.imageTitle = card.appendHTML('div', (title) => {
                        title.classList.add('next-admin-image-card-title');
                    });
                    this.animatedHoverText = card.appendControl(new UI.AnimatedHoverText({
                        css: {
                            position: 'absolute',
                            bottom: '6%'
                        }
                    }));
                });
                this.textContainer = this.element.appendHTML('div', (textContainer) => {
                    textContainer.classList.add('next-admin-image-card-outside-text');
                    this.descriptionTitle = textContainer.appendHTML('div', (description) => {
                        description.classList.add('next-admin-image-card-outside-title');
                    });
                    this.description = textContainer.appendHTML('div', (description) => {
                        description.classList.add('next-admin-image-card-outside-description');
                    });
                });
                this.setSize(this.options.size);
                this.setStyle(this.options.style);
                if (this.options.imageUrl) {
                    this.setBackground(this.options.imageUrl);
                }
                if (this.options.imageTitle) {
                    this.setImageTitle(this.options.imageTitle);
                }
                if (this.options.outsideTitle) {
                    this.setDescriptionTitle(this.options.outsideTitle);
                }
                if (this.options.outsideDescription) {
                    this.setDescription(this.options.outsideDescription);
                }
                if (this.options.imageHoverText) {
                    this.setHoverText(this.options.imageHoverText);
                }
                this.element.addEventListener('pointerenter', () => {
                    if (!NextAdmin.String.isNullOrEmpty(this.animatedHoverText.getText())) {
                        this.animatedHoverText.animDisplayText();
                    }
                });
                this.element.addEventListener('pointerleave', () => {
                    if (!NextAdmin.String.isNullOrEmpty(this.animatedHoverText.getText())) {
                        this.animatedHoverText.animHideText();
                    }
                });
                if (this.options.href) {
                    this.card.href = this.options.href;
                }
            }
            setImageTitle(title) {
                this.imageTitle.innerHTML = title ?? '';
            }
            setDescriptionTitle(title) {
                this.descriptionTitle.innerHTML = title ?? '';
            }
            setDescription(title) {
                this.description.innerHTML = title ?? '';
            }
            setHoverText(hoverText) {
                this.animatedHoverText.setText(hoverText);
            }
            setSize(size) {
                switch (size) {
                    default:
                    case ImageCardSize.extraSmall_1_1:
                        this.element.classList.add('extra-small');
                        this.card.classList.add('next-admin-image-card-extra-small-1-1');
                        break;
                    case ImageCardSize.small_1_1:
                        this.element.classList.add('small');
                        this.card.classList.add('next-admin-image-card-small-1-1');
                        break;
                    case ImageCardSize.small_4_3:
                        this.element.classList.add('small');
                        this.card.classList.add('next-admin-image-card-small-4-3');
                        break;
                    case ImageCardSize.small_3_4:
                        this.element.classList.add('small');
                        this.card.classList.add('next-admin-image-card-small-3-4');
                        break;
                    case ImageCardSize.small_9_16:
                        this.element.classList.add('small');
                        this.card.classList.add('next-admin-image-card-small-9-16');
                        break;
                    case ImageCardSize.medium_1_1:
                        this.element.classList.add('medium');
                        this.card.classList.add('next-admin-image-card-medium-1-1');
                        break;
                    case ImageCardSize.medium_4_3:
                        this.element.classList.add('medium');
                        this.card.classList.add('next-admin-image-card-medium-4-3');
                        break;
                    case ImageCardSize.medium_3_4:
                        this.element.classList.add('medium');
                        this.card.classList.add('next-admin-image-card-medium-3-4');
                        break;
                    case ImageCardSize.medium_9_16:
                        this.element.classList.add('medium');
                        this.card.classList.add('next-admin-image-card-medium-9-16');
                        break;
                    case ImageCardSize.large_1_1:
                        this.element.classList.add('large');
                        this.card.classList.add('next-admin-image-card-large-1-1');
                        break;
                    case ImageCardSize.large_4_3:
                        this.element.classList.add('large');
                        this.card.classList.add('next-admin-image-card-large-4-3');
                        break;
                    case ImageCardSize.large_3_4:
                        this.element.classList.add('large');
                        this.card.classList.add('next-admin-image-card-large-3-4');
                        break;
                    case ImageCardSize.large_9_16:
                        this.element.classList.add('large');
                        this.card.classList.add('next-admin-image-card-large-9-16');
                        break;
                }
            }
            setStyle(style) {
                switch (style) {
                    default:
                    case ImageCardStyle.imageNoBorderTextCenter:
                        this.element.classList.add('next-admin-image-card-no-border');
                        break;
                    case ImageCardStyle.imageLightBorderedTextLeft:
                        this.element.classList.add('next-admin-image-card-light-bordered');
                        break;
                    case ImageCardStyle.imageLightBorderedTextCenter:
                        this.element.classList.add('next-admin-image-card-light-bordered-text-center');
                        break;
                    case ImageCardStyle.imageShadowedBorderRadiusTextLeft:
                        this.element.classList.add('next-admin-image-card-border-radius');
                        break;
                    case ImageCardStyle.imageShadowedBorderRadiusTextCenter:
                        this.element.classList.add('next-admin-image-card-border-text-center');
                        break;
                    case ImageCardStyle.imageShadowedBorderRadiusBTextLeft:
                        this.element.classList.add('next-admin-image-card-border-radius-b');
                        break;
                    case ImageCardStyle.imageShadowedBorderRadiusBTextCenter:
                        this.element.classList.add('next-admin-image-card-border-radius-b-text-center');
                        break;
                }
            }
            setBackground(url) {
                if (url) {
                    this.cardImage.style.background = 'url("' + url + '")';
                    this.cardImage.style.backgroundSize = 'cover';
                    this.cardImage.style.backgroundRepeat = 'no-repeat';
                    this.cardImage.style.backgroundPosition = 'center';
                }
                else {
                    this.cardImage.style.background = 'unset';
                }
            }
        }
        ImageCard.style = `

        .next-admin-image-card-wrapper{
            display:inline-block;
            width:fit-content;
            position:relative;
        }

        .next-admin-image-card{
            display:block;
            cursor:pointer;
            overflow: hidden;
            position:relative;
            width:100%;
        }

        .next-admin-image-card-image{
            width:100%;
            height:100%;
            display:block;
            position:relative;
            transition: transform 0.9s;
        }

        .next-admin-image-card-title{
            position:absolute;
            pointer-events: none;
            font-size:34px;
            font-weight:bold;
            width:100%;
            top:6%;
            padding-left:20px;
            padding-right:20px;
            color:#fff;
            text-shadow:0px 0px 2px rgba(0,0,0,0.75)
        }

        .next-admin-image-card-image:hover{
            transform: scale(1.1);
        }
        .next-admin-image-card-no-border {
            .next-admin-image-card{
                border:0px;
            }
            .next-admin-image-card-outside-title{
                text-align:center;
            }
            .next-admin-image-card-outside-description{
                text-align:center;
            }
        }
        .next-admin-image-card-light-bordered {
            .next-admin-image-card{
                border:1px solid #e6e6e6;
            }
        }
        .next-admin-image-card-light-bordered-text-center{
            .next-admin-image-card{
                border:1px solid #e6e6e6;
            }
            .next-admin-image-card-outside-title{
                text-align:center;
            }
            .next-admin-image-card-outside-description{
                text-align:center;
            }
        }

        .next-admin-image-card-border-radius{
            .next-admin-image-card{
                border-radius:16px;
                box-shadow:0px 0px 20px rgba(0,0,0,0.25);
            }
        }
        .next-admin-image-card-border-radius-text-center{
            .next-admin-image-card{
                border-radius:16px;
                box-shadow:0px 0px 20px rgba(0,0,0,0.25);
            }
            .next-admin-image-card-outside-title{
                text-align:center;
            }
            .next-admin-image-card-outside-description{
                text-align:center;
            }
        }

        .next-admin-image-card-border-radius-b{
            .next-admin-image-card{
                border-radius:16px;
                box-shadow: 0px 0px 2px rgba(0,0,0,0.5);
            }
        }

        .next-admin-image-card-border-radius-b-text-center{
            .next-admin-image-card{
                border-radius:16px;
                box-shadow: 0px 0px 2px rgba(0,0,0,0.5);
            }
            .next-admin-image-card-outside-title{
                text-align:center;
            }
            .next-admin-image-card-outside-description{
                text-align:center;
            }
        }

        .next-admin-image-card-wrapper.extra-small{
            width:200px;
            .next-admin-image-card-title{
                font-size:16px;
            }
        }
        .next-admin-image-card-wrapper.small{
            width:300px;
            .next-admin-image-card-title{
                font-size:18px;
            }
        }
        .next-admin-image-card-wrapper.medium{
            width:400px;
            .next-admin-image-card-title{
                font-size:20px;
            }
        }
        .next-admin-image-card-wrapper.large{
            width:500px;
            .next-admin-image-card-title{
                font-size:24px;
            }
        }


        .next-admin-image-card-extra-small-1-1{
            height:200px;
        }

        .next-admin-image-card-small-1-1 {
            height:300px;
        }

        .next-admin-image-card-small-4-3 {
            height:225px;
        }

        .next-admin-image-card-small-3-4 {
            height:400px;
        }

        .next-admin-image-card-small-9-16 {
            height:531px;
        }

        .next-admin-image-card-medium-1-1 {
            height:400px;
        }

        .next-admin-image-card-medium-4-3 {
            height:300px;
        }

        .next-admin-image-card-medium-3-4 {
            height:532px;
        }

        .next-admin-image-card-medium-9-16 {
            height:708px;
        }

        .next-admin-image-card-large-1-1 {
            height:500px;
        }

        .next-admin-image-card-large-4-3 {
            height:375px;
        }

        .next-admin-image-card-large-3-4 {
            height:665;
        }

        .next-admin-image-card-large-9-16 {
            height:885px;
        }

        .next-admin-image-card-outside-text{
            width:100%;
            height:50px;
            padding-top:10px;
            font-size:14px;
            .next-admin-image-card-outside-title{
                text-overflow: ellipsis;
                color:#999;
            }

            .next-admin-image-card-outside-description{
                text-overflow: ellipsis;
                color:#444;
            }
        }
        .next-admin-image-card-wrapper.small{
            .next-admin-image-card-outside-text{
                height:40px;
            }
        }
        .next-admin-image-card-wrapper.extra-small{
            .next-admin-image-card-outside-text{
                height:30px;
            }
        }


        .next-admin-image-card-wrapper.extra-small.responsive{
            @media (max-width: 1024px) {
                width:160px;
                .next-admin-image-card-outside-text{
                    padding-top:5px;
                    font-size:12px;
                }
            }
            @media (max-width: 768px) {
                width:140px;
                .next-admin-image-card-outside-text{
                    padding-top:4px;
                    font-size:11px;
                }
            }
            @media (max-width: 512px) {
                width:100px;
                .next-admin-image-card-outside-text{
                    padding-top:2px;
                    font-size:10px;
                }
            }
        }

        .next-admin-image-card-wrapper.small.responsive{
            @media (max-width: 1024px) {
                width:240px;
                .next-admin-image-card-outside-text{
                    padding-top:6px;
                    font-size:13px;
                }
            }
            @media (max-width: 768px) {
                width:180px;
                .next-admin-image-card-outside-text{
                    padding-top:5px;
                    font-size:12px;
                }
            }
            @media (max-width: 512px) {
                width:160px;
                .next-admin-image-card-outside-text{
                    padding-top:4px;
                    font-size:11px;
                }
            }
        }
        .next-admin-image-card-wrapper.medium.responsive{
            @media (max-width: 1024px) {
                width:300px;
                .next-admin-image-card-outside-text{
                    padding-top:8px;
                    font-size:14px;
                }
            }
            @media (max-width: 768px) {
                width:240px;
                .next-admin-image-card-outside-text{
                    padding-top:6px;
                    font-size:13px;
                }
            }
            @media (max-width: 512px) {
                width:180px;
                .next-admin-image-card-outside-text{
                    padding-top:5px;
                    font-size:12px;
                }
            }
        }
        .next-admin-image-card-wrapper.large.responsive{
            @media (max-width: 1024px) {
                width:400px;
            }
            @media (max-width: 768px) {
                width:300px;
                .next-admin-image-card-outside-text{
                    padding-top:8px;
                    font-size:13px;
                }
            }
            @media (max-width: 512px) {
                width:240px;
                .next-admin-image-card-outside-text{
                    padding-top:6px;
                    font-size:12px;
                }
            }
        }


        .next-admin-image-card-wrapper.responsive{

            .next-admin-image-card-extra-small-1-1{
                @media (max-width: 1024px) {
                    height:160px;
                }
                @media (max-width: 768px) {
                    height:140px;
                }
                @media (max-width: 512px) {
                    height:100px;
                }
            }
            .next-admin-image-card-small-1-1 {
                @media (max-width: 1024px) {
                    height:240px;
                }
                @media (max-width: 768px) {
                    height:180px;
                }
                @media (max-width: 512px) {
                    height:160px;
                }
            }
            .next-admin-image-card-small-4-3 {
                @media (max-width: 1024px) {
                    height:180px;
                }
                @media (max-width: 768px) {
                    height:135px;
                }
                @media (max-width: 400px) {
                    height:120px;
                }
            }

            .next-admin-image-card-small-3-4 {
                @media (max-width: 1024px) {
                    height:320px;
                }
                @media (max-width: 768px) {
                    height:240px;
                }
                @media (max-width: 400px) {
                    height:212px;
                }
            }

            .next-admin-image-card-small-9-16 {
                @media (max-width: 1024px) {
                    height:424px;
                }
                @media (max-width: 768px) {
                    height:318px;
                }
                @media (max-width: 400px) {
                    height:284px;
                }
            }

            .next-admin-image-card-medium-1-1 {
                @media (max-width: 1024px) {
                    height:300px;
                }
                @media (max-width: 768px) {
                    height:240px;
                }
                @media (max-width: 400px) {
                    height:180px;
                }
            }

            .next-admin-image-card-medium-4-3 {
                @media (max-width: 1024px) {
                    height:225px;
                }
                @media (max-width: 768px) {
                    height:180px;
                }
                @media (max-width: 400px) {
                    height:135px;
                }
            }

            .next-admin-image-card-medium-3-4 {
                @media (max-width: 1024px) {
                    height:400px;
                }
                @media (max-width: 768px) {
                    height:320px;
                }
                @media (max-width: 400px) {
                    height:240px;
                }
            }

            .next-admin-image-card-medium-9-16 {
                @media (max-width: 1024px) {
                    height:531px;
                }
                @media (max-width: 768px) {
                    height:424px;
                }
                @media (max-width: 400px) {
                    height:318px;
                }
            }

            .next-admin-image-card-large-1-1 {
                @media (max-width: 1024px) {
                    height:400px;
                }
                @media (max-width: 768px) {
                    height:300px;
                }
                @media (max-width: 400px) {
                    height:240px;
                }
            }

            .next-admin-image-card-large-4-3 {
                @media (max-width: 1024px) {
                    height:300px;
                }
                @media (max-width: 768px) {
                    height:225x;
                }
                @media (max-width: 400px) {
                    height:180x;
                }
            }

            .next-admin-image-card-large-3-4 {
                @media (max-width: 1024px) {
                    height:532px;
                }
                @media (max-width: 768px) {
                    height:400px;
                }
                @media (max-width: 400px) {
                    height:320px;
                }
            }

            .next-admin-image-card-large-9-16 {
                @media (max-width: 1024px) {
                    height:708px;
                }
                @media (max-width: 768px) {
                    height:531px;
                }
                @media (max-width: 400px) {
                    height:425px;
                }
            }
        }


        `;
        UI.ImageCard = ImageCard;
        let ImageCardSize;
        (function (ImageCardSize) {
            ImageCardSize[ImageCardSize["extraSmall_1_1"] = 100] = "extraSmall_1_1";
            ImageCardSize[ImageCardSize["small_1_1"] = 300] = "small_1_1";
            ImageCardSize[ImageCardSize["small_4_3"] = 301] = "small_4_3";
            ImageCardSize[ImageCardSize["small_3_4"] = 302] = "small_3_4";
            ImageCardSize[ImageCardSize["small_9_16"] = 303] = "small_9_16";
            ImageCardSize[ImageCardSize["medium_1_1"] = 500] = "medium_1_1";
            ImageCardSize[ImageCardSize["medium_4_3"] = 501] = "medium_4_3";
            ImageCardSize[ImageCardSize["medium_3_4"] = 502] = "medium_3_4";
            ImageCardSize[ImageCardSize["medium_9_16"] = 503] = "medium_9_16";
            ImageCardSize[ImageCardSize["large_1_1"] = 700] = "large_1_1";
            ImageCardSize[ImageCardSize["large_4_3"] = 701] = "large_4_3";
            ImageCardSize[ImageCardSize["large_3_4"] = 702] = "large_3_4";
            ImageCardSize[ImageCardSize["large_9_16"] = 703] = "large_9_16";
        })(ImageCardSize = UI.ImageCardSize || (UI.ImageCardSize = {}));
        let ImageCardStyle;
        (function (ImageCardStyle) {
            ImageCardStyle[ImageCardStyle["imageNoBorderTextCenter"] = 0] = "imageNoBorderTextCenter";
            ImageCardStyle[ImageCardStyle["imageLightBorderedTextLeft"] = 10] = "imageLightBorderedTextLeft";
            ImageCardStyle[ImageCardStyle["imageLightBorderedTextCenter"] = 11] = "imageLightBorderedTextCenter";
            ImageCardStyle[ImageCardStyle["imageShadowedBorderRadiusTextLeft"] = 20] = "imageShadowedBorderRadiusTextLeft";
            ImageCardStyle[ImageCardStyle["imageShadowedBorderRadiusTextCenter"] = 21] = "imageShadowedBorderRadiusTextCenter";
            ImageCardStyle[ImageCardStyle["imageShadowedBorderRadiusBTextLeft"] = 30] = "imageShadowedBorderRadiusBTextLeft";
            ImageCardStyle[ImageCardStyle["imageShadowedBorderRadiusBTextCenter"] = 31] = "imageShadowedBorderRadiusBTextCenter";
        })(ImageCardStyle = UI.ImageCardStyle || (UI.ImageCardStyle = {}));
    })(UI = NextAdmin.UI || (NextAdmin.UI = {}));
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    var UI;
    (function (UI) {
        class ImageViewerModal extends UI.NoUiModal {
            constructor(options) {
                super({
                    size: NextAdmin.UI.ModalSize.ultraLarge,
                    ...options,
                });
                this.body.appendControl(new UI.Slider({
                    navigationButtonsStyle: NextAdmin.UI.ButtonStyle.noBgWhite,
                    imagesSize: 'contain',
                    imagePosition: 'center center',
                    imageUrls: this.options.imageUrls,
                    css: { height: '100%' }
                }));
            }
        }
        UI.ImageViewerModal = ImageViewerModal;
    })(UI = NextAdmin.UI || (NextAdmin.UI = {}));
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    var UI;
    (function (UI) {
        class LanguageSelectorDropDown extends UI.DropDownButton {
            constructor(options) {
                super({
                    languages: [
                        { code: 'en', label: 'English', iconUrl: LanguageSelectorDropDown.iconEn },
                        { code: 'fr', label: 'Français', iconUrl: LanguageSelectorDropDown.iconFr }
                    ],
                    languageChangedAction: (language) => {
                        if (NextAdmin.FrontApp) {
                            NextAdmin.FrontApp.setCulture(language, true);
                        }
                    },
                    ...options
                });
                for (let language of this.options.languages) {
                    this.addItem({
                        text: this.getLanguageItemContent(language),
                        action: () => {
                            this.setLanguage(language.code, true);
                        }
                    });
                }
                if (NextAdmin.FrontApp) {
                    this.setLanguage(NextAdmin.FrontApp.getLanguage());
                }
            }
            getLanguageItemContent(languageInfo, caret) {
                return '<div style="display:flex;flex-direction:row"><img src="' + languageInfo.iconUrl + '" style="height:16px;margin-right:5px" /><div style="flex-grow:1">' + languageInfo.label + '</div>' + (caret ? '<div style="width:20px;padding-left:5px">' + NextAdmin.Resources.iconCaretDown + '</div>' : '') + '</div>';
                //return '<table style="min-width:100%"><tr><td style="display:flex;width:35px"><img src="' + languageInfo.iconUrl + '" style="height:20px;margin-right:5px" /></td><td>' + languageInfo.label + '</td>' + (caret ? '<td style="width:20px;padding-left:5px">' + NextAdmin.Resources.iconCaretDown + '</td>' : '') + '</tr></table>';
            }
            getLanguageInfo(languageCode) {
                return this.options.languages.firstOrDefault(a => a.code == languageCode);
            }
            setLanguage(languageCode, fireChanged) {
                let languageInfo = this.getLanguageInfo(languageCode);
                this.setText(this.getLanguageItemContent(languageInfo, true));
                if (fireChanged) {
                    this.options.languageChangedAction(languageCode);
                }
            }
        }
        LanguageSelectorDropDown.iconFr = 'data:image/png;base64,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';
        LanguageSelectorDropDown.iconEn = 'data:image/png;base64,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';
        LanguageSelectorDropDown.iconDe = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAQ/SURBVHjavJc9rFRVEMd/c87Zu8vjPR48UYGCGCUxGEI0FBQWGENhjIkWRittLLDT1orWxEYTC2O0o9HKaKE2Ei3s/AhCIhg0iqAhfgXeE+7uPfO3uHv3+32A8M7m7M3szD3znzMz/3PWiqJgcmR3ghkCYoyEYFS9alHSEeBRd38IsRe0BBhmfwO/hBC+FToZLHweU/rTc8bdEZBiJLVatIoWkga+bC0AmGFwr6SXcs7PS9oOYGb1y337ZrlmYTNbNrMTMcbXJZ116eYAuHRc7sclWeN0o0NSDdTs1RDCKylGYkrrAzAzcs67JH3g7odv1PFMICGcSjE+VbTbP7WKFu4+0Acx+gHgPnc/fSucNwHJ/WC32/0uez44pU9FawQuS57zeaTt3ALnkzuBURbt9r4Y469NGkIrtWi1WrRSQu4ndRucD3dC7W5ZfpE9I3fcnYiE3Mk5H3f3Z+02OB8Fgdgh1xLwiVxYTAmkOyVdZhOHRbsHs58b+c1+O2/mfB/Anlnc1cm5XDZTRGzuiMVCeuuuvUcX80qUCWGb5jso808x/3S6mJcfW+51qUKY0TsjfDvKuVMJHdcJNQU300ZAS5llLT+eYq4OZQwf5XJsmuht0MuDxVV/Mdo5A5vp82FMriwQPD+QotjrzeEy2YI2o41sqLNRA2Ma/AybRnYgwM5ksI0JtAPimJSbiPtOGvI2GbKxHAztG1D9dMqGa5hsa7IRiJM7MBbNqF5DJ4PIZVO7ZrJh7o2JdNWpCu66Qj9SSXXUmii8pnhcY7syKTe/jXa7XGO1VL8DZiDxb/LABZzdYwuj6YrX8Kk++oHcvGsTqbTZehC4qAJ/BJG+GSv1KS6ob0ZTw5ndthuUJWHEs6l7gU/l6di4c41AsoFsIxmpS8xWbZpaa2OhjVOCqLCP7cKLu+eT+VUDNCgyjfbVuEy/klHdSJMABLIJAhm1UR+eGd2cdpgu3QFx+R1C+cIwiasw4C1jaoG3Pyw1/6Rd+WoPgd6eufDXxXpjwqqcO7qlbIyVZ+iFmVP64v2u4lxI7RI6dqkX516r+Zh6D2dMbeCQXdum7q6uz71bWTxH6GHXvt5WF5MCbVZ+MOvtE2mdOG7yEoLI2G/XvLOnkQPlFux6G5UdunnbEVm8buT1r1Y36Nr6hVVq6RFnAdiKmCdUbaPqBHJHdGNxqdTCYWEra4GYZL/13WeypVxqy8Oxl891co8iZ4qcCVABFWb1zMRTFXMHRXGmBqH/Ve0Bx4nnq9B+0Gl/megSKAl0+7MhIDX/9xywH3ssHsja+kZNNr6B+mf6AFGgovN2Zst+sNOBjPqZr59GWH0BgPbL0twBt+KEYyvWADGfom4DzNQHGkojvlfROVRa+5hBb7UA0lpRGI6IZ9DcczLf2aN6IiofNfl+8LvNtNA/2K46XJbi9yJ9FggfBVW/Y6G5a63KYv8NAIUgjhBr5taTAAAAAElFTkSuQmCC';
        LanguageSelectorDropDown.iconEs = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAHvSURBVHjaxNe/S5VRHMfx13m4/RBTyowIHSpFg7IfQxAlhZBNTUFDtDYV1NLQUG4NDhHU0FBQS9AQ9AeEEkXUFqFgF4waKiEiQlH6Yfdp8NyIm+Y1732eNzzTc875fjjf8/0VXulWJatxGAexCx1oRcAnvMFLPMEQpqo5NFQhYDPO4QQ2Vin2M+7hGorLETCASyj4fwZxYakCNuE+9qsNL3Acryt/JPMs3oHRGhqHPRjBvsUErMMztKg9DXiK9n8JGMYa9SPBo4UEXMRu9acDV38/wjHdAhvwUbZsSXlbmDUrnQu1rLkcOBkmrx8olGZKk0oahIxMp3P5M2lMmgtNZ5r7BQ3yIHW0YPxHv/zoT2JhyYueBJ05CmhPsD5HAU1JrOe5kcTanRdTyXwlMkMmkthG5cVIwdYVQ4KzQsxQWVC2lRoO03d6V5Vm0sm0ZGWmmTiQNIaWMKpTKr2JUxlf/4MgHAtjuhDa8C5jAdtIi0kQBN4HBkN0TwbfrUAxCH91xUV01Tv00FZ+8pU9YR9+1llA35/xVingA3rxtU7Gj1ROSvPNBc/RE/v4WjEeG96H1Qwm5Q07caUGxm9g+0IZN1lk8/ko5Daml2D0G+5iL07j+3Km4zKt0YeHoovasDZG1pf4fkbxOF71RDWH/hoAYRJr3D62rwYAAAAASUVORK5CYII=';
        UI.LanguageSelectorDropDown = LanguageSelectorDropDown;
        let LanguageSelectorSuportedLanguage;
        (function (LanguageSelectorSuportedLanguage) {
            LanguageSelectorSuportedLanguage["en"] = "en";
            LanguageSelectorSuportedLanguage["fr"] = "fr";
            LanguageSelectorSuportedLanguage["es"] = "es";
            LanguageSelectorSuportedLanguage["de"] = "de";
        })(LanguageSelectorSuportedLanguage = UI.LanguageSelectorSuportedLanguage || (UI.LanguageSelectorSuportedLanguage = {}));
    })(UI = NextAdmin.UI || (NextAdmin.UI = {}));
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    var UI;
    (function (UI) {
        class MultiImageTextCard extends UI.Control {
            constructor(options) {
                super('div', {
                    ...options
                });
                NextAdmin.Style.append('NextAdmin.UI.TextMultiImagesCard', MultiImageTextCard.style);
                this.element.classList.add('next-admin-multi-image-text-card');
                this.cardBody = this.element.appendControl(new NextAdmin.UI.HorizontalFlexLayout({ classes: ['multi-image-text-card-body'] }), (horizontalLayout) => {
                    horizontalLayout.appendHTML('div', (leftContainer) => {
                        this.imageViewer = leftContainer.appendControl(new NextAdmin.UI.SliderImageViewer({
                            classes: ['multi-image-text-card-images-viewer'],
                            autoPlay: this.options.autoPlay,
                            page: this.options.page,
                            imageUrls: this.options.imageUrls
                        }), (slider) => {
                            slider.element.centerVertically();
                        });
                    });
                    horizontalLayout.appendHTMLStretch('div', (rightContainer) => {
                        rightContainer.appendHTML('div', (contentContainer) => {
                            contentContainer.style.padding = '10px';
                            contentContainer.appendControl(new NextAdmin.UI.Title({
                                htmlTag: 'h2',
                                style: NextAdmin.UI.TitleStyle.darkGreyThin,
                                size: NextAdmin.UI.TitleSize.large,
                                text: this.options.title,
                            }));
                            contentContainer.appendControl(new NextAdmin.UI.Title({
                                htmlTag: 'h3',
                                style: NextAdmin.UI.TitleStyle.darkGreyThin,
                                size: NextAdmin.UI.TitleSize.medium,
                                text: this.options.subTitle,
                            }));
                            contentContainer.appendControl(new NextAdmin.UI.Text({
                                htmlTag: 'p',
                                size: NextAdmin.UI.TextSize.large,
                                style: NextAdmin.UI.TextStyle.greyThin,
                                text: this.options.text,
                            }));
                            contentContainer.centerVertically();
                        });
                    });
                });
            }
            dispose() {
                if (this.imageViewer) {
                    this.imageViewer.dispose();
                }
            }
        }
        MultiImageTextCard.style = `

        .next-admin-multi-image-text-card{

            padding-top:50px;
            padding-bottom:50px;

            .multi-image-text-card-body{

                border-radius:20px;
                box-shadow: 0px 0px 50px rgba(0,0,0,0.05);
                background:#fff;
                position:relative;

                .multi-image-text-card-images-viewer{
                    width:600px;
                    min-width:600px;
                    height:400px;
                    @media (max-width: 1280px) {
                        width:512px;
                        min-width:512;
                        height:337px;
                    }
                    @media (max-width: 1024px) {
                        width:400px;
                        min-width:400px;
                        height:300px;
                    }
                    @media (max-width: 768px) {
                        width:300px;
                        min-width:300px;
                        height:200px;
                    }
                    @media (max-width: 450px) {
                        width:170px;
                        min-width:170px;
                        height:120px;
                    }
                }
                .multi-image-text-card-images-viewer.responsive{
                    @media (max-width: 1280px) {
                        width:512px;
                        min-width:512;
                        height:337px;
                    }
                    @media (max-width: 1024px) {
                        width:400px;
                        min-width:400px;
                        height:300px;
                    }
                    @media (max-width: 768px) {
                        width:300px;
                        min-width:300px;
                        height:200px;
                    }
                    @media (max-width: 450px) {
                        width:170px;
                        min-width:170px;
                        height:120px;
                    }
                }
            }
        }

        `;
        UI.MultiImageTextCard = MultiImageTextCard;
    })(UI = NextAdmin.UI || (NextAdmin.UI = {}));
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    var UI;
    (function (UI) {
        class MultiImageViwer extends UI.Control {
            constructor(options) {
                super('div', {
                    aspectRationWidth: 1,
                    aspectRationHeight: 1,
                    isResponsive: true,
                    ...options
                });
                this._images = new NextAdmin.Dictionary();
                NextAdmin.Style.append('NextAdmin.UI.MultiImageViwer', MultiImageViwer.style);
                this.element.classList.add('next-admin-multi-image-viewer');
                if (this.options.isResponsive) {
                    this.element.classList.add('next-admin-multi-image-viewer-responsive');
                }
                this.mainImageContainer = this.element.appendControl(new UI.AspectRatioContainer({
                    width: this.options.aspectRationWidth,
                    height: this.options.aspectRationHeight
                }));
                this.miniatureImagesContainer = this.element.appendHTML('div', (miniatureImagesContainer) => {
                    miniatureImagesContainer.style.marginTop = '5px';
                    miniatureImagesContainer.style.display = 'none';
                });
                if (this.options.imageItems) {
                    for (let imageItem of this.options.imageItems) {
                        this.addImageItem(imageItem);
                    }
                }
                if (this.options.imageUrls) {
                    for (let imageUrl of this.options.imageUrls) {
                        this.addImageItem({ url: imageUrl });
                    }
                }
            }
            addImageItem(imageItem) {
                let imageId = NextAdmin.Guid.createStrGuid();
                this._images.add(imageId, imageItem);
                this.miniatureImagesContainer.appendHTML('div', (imageMin) => {
                    imageMin.classList.add('image-viewer-image-min');
                    imageMin.id = imageId;
                    if (this.options.miniatureImageSize) {
                        imageMin.style.width = this.options.miniatureImageSize;
                        imageMin.style.height = this.options.miniatureImageSize;
                    }
                    imageMin.setBackgroundImage(imageItem.url);
                    imageMin.addEventListener('click', () => {
                        this.setActiveImage(imageId);
                    });
                });
                if (this._images.getValues().length > 1) {
                    this.miniatureImagesContainer.style.display = '';
                }
                if (this._activeImageId == null) {
                    this.setActiveImage(imageId);
                }
            }
            addImage(url) {
                this.addImageItem({ url: url });
            }
            addImages(urls) {
                for (let url of urls) {
                    this.addImage(url);
                }
            }
            setActiveImage(imageId) {
                let activeImageMin = this.getMiniatureImage(imageId);
                let imageItem = this._images.get(imageId);
                if (activeImageMin == null || imageItem == null) {
                    return;
                }
                this._activeImageId = imageId;
                for (let imageMin of this.getMiniatureImages()) {
                    imageMin.classList.remove('image-viewer-image-min-active');
                }
                activeImageMin.classList.add('image-viewer-image-min-active');
                this.mainImageContainer.body.innerHTML = '';
                this.mainImageContainer.body.appendHTML('img', (mainImage) => {
                    mainImage.classList.add('image-viewer-main-image');
                    mainImage.src = imageItem.url;
                });
            }
            getMiniatureImages() {
                return this.miniatureImagesContainer.getChildrenElements();
            }
            getMiniatureImage(imageId) {
                return this.getMiniatureImages().firstOrDefault(a => a.id == imageId);
            }
        }
        MultiImageViwer.style = `

        .next-admin-multi-image-viewer{

            .image-viewer-main-image {
                width:100%;
                height:100%;
                object-fit: contain;
                background-color:#f9f9f9;
                border-radius:6px;
                box-shadow: 0px 0px 2px rgba(0,0,0,0.25);
            }

            .image-viewer-image-min{
                display:inline-block;
                margin:5px;
                border-radius:6px;
                box-shadow: 0px 0px 2px rgba(0,0,0,0.25);
                cursor:pointer;
                width:128px;
                height:128px;
            }

            .image-viewer-image-min-active {
                box-shadow: inset 0px 0px 2px rgba(0,0,0,0.5);
            }
        }
        .next-admin-multi-image-viewer-responsive{
            .image-viewer-image-min{
                @media (max-width: 1024px) {
                    width:96px;
                    height:96px;
                }
                @media (max-width: 768px) {
                    width:64px;
                    height:64px;
                }
            }
        }
        `;
        UI.MultiImageViwer = MultiImageViwer;
    })(UI = NextAdmin.UI || (NextAdmin.UI = {}));
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    var UI;
    (function (UI) {
        class NavigationTopBar extends UI.Control {
            constructor(options) {
                super('div', {
                    isFixed: true,
                    style: NavigationTopBarStyle.white,
                    maxContainerWidth: UI.FrontDefaultStyle.PageContentMaxWidth,
                    ...options
                });
                this.pageLinks = new NextAdmin.Dictionary();
                NextAdmin.Style.append('NextAdmin.UI.Topbar', NavigationTopBar.style);
                this.element.classList.add('next-admin-top-bar');
                if (this.options.isFixed) {
                    this.element.style.position = 'fixed';
                }
                this.container = this.element.appendHTML('div', (container) => {
                    container.classList.add('next-admin-top-bar-container');
                    this.layout = container.appendControl(new NextAdmin.UI.FlexLayout({ direction: NextAdmin.UI.FlexLayoutDirection.horizontal }), (layout) => {
                        layout.element.classList.add('next-admin-top-bar-center-container');
                        if (this.options.maxContainerWidth) {
                            layout.element.style.maxWidth = this.options.maxContainerWidth;
                        }
                        this.logoLink = layout.appendHTML('a', (logoLink) => {
                            logoLink.classList.add('top-bar-logo-link');
                            logoLink.centerContentVertically();
                            if (this.options.textLogoHtmlContent) {
                                logoLink.innerHTML = this.options.textLogoHtmlContent;
                            }
                            if (this.options?.navigationController?.options?.defaultPage) {
                                logoLink.href = this.options.navigationController.options.defaultPage;
                            }
                            if (this.options.imageLogoUrl) {
                                this.logoImage = logoLink.appendHTML('img', (logoImage) => {
                                    logoImage.classList.add('top-bar-logo');
                                    logoImage.src = this.options.imageLogoUrl;
                                });
                            }
                        });
                        this.leftToolbar = layout.appendControl(new UI.Toolbar());
                        this.stretchArea = layout.appendHTMLStretch('div');
                        this.rightToolbar = layout.appendControl(new UI.Toolbar());
                    });
                });
                if (this.options.navigationController) {
                    this.options.navigationController.onPageChanged.subscribe((sender, page) => {
                        for (let keyValue of this.pageLinks.getKeysValues()) {
                            keyValue.value.setActive(keyValue.key == page.options.name);
                        }
                    });
                }
                this.setStyle(this.options.style);
            }
            setStyle(style) {
                switch (style) {
                    default:
                    case NavigationTopBarStyle.white:
                        this.element.classList.add('next-admin-top-bar-white');
                        break;
                    case NavigationTopBarStyle.noBackgroundStickyDarkBlue:
                        this.element.classList.add('next-admin-top-bar-glass');
                        window.addEventListener('scroll', (ev) => {
                            if (window.scrollY > 50) {
                                if (!this.element.classList.contains('scroll')) {
                                    this.element.classList.add('scroll');
                                }
                            }
                            else {
                                this.element.classList.remove('scroll');
                            }
                        });
                        break;
                }
            }
            addLeftNavigationLink(url, label, style) {
                return this.leftToolbar.appendControl(this.addNavigationLink(url, label, style));
            }
            addRightNavigationLink(url, label, style) {
                return this.rightToolbar.appendControl(this.addNavigationLink(url, label, style));
            }
            addNavigationLink(url, label, style) {
                let link = new NavigationLink({
                    text: label,
                    href: '/' + url,
                    style: style ?? this.getDefaultLinkStyle()
                });
                link.element.classList.add('next-admin-top-bar-link');
                this.pageLinks.add(url, link);
                return link;
            }
            appendRightLink(text, action, style) {
                return this.rightToolbar.appendControl(new NavigationLink({
                    text: text,
                    action: action,
                    style: style ?? this.getDefaultLinkStyle()
                }));
            }
            getDefaultLinkStyle() {
                switch (this.options.style) {
                    default:
                    case NavigationTopBarStyle.white:
                        return UI.LinkStyle.dark;
                    case NavigationTopBarStyle.noBackgroundStickyDarkBlue:
                        return UI.LinkStyle.white;
                }
            }
        }
        NavigationTopBar.style = `

        .next-admin-top-bar{
            width:100%;
            height:50px;
            z-index:100;

            .next-admin-top-bar-container{
                position:relative;
                padding-left:10px;
                padding-right:10px;
                height:100%;
            }

            .top-bar-logo-link{
                height:100%;
                text-decoration:none;
                font-size:30px;
                font-weight:bold;
                transition: transform 0.1s;
                border-radius:10px;
                margin-right:10px;
            }
            .top-bar-logo-link:hover{
                box-shadow:inset 0px 0px 2px #444;
                transform: scale(0.99);
            }

            .top-bar-logo{
                margin-left:5px;
                margin-right:5px;
                max-height:80%;
                @media (max-width: 512px) {
                    max-height:50%;
                }
            }
            
            .next-admin-top-bar-center-container{
                position:relative;
                left:50%;
                height:100%;
                transform:perspective(1px) translateX(-50%);
            }
            .next-admin-top-bar-link{


            }
        }
        .next-admin-top-bar-white{
            background-color:#fff;
            box-shadow:0px 0px 2px rgba(0,0,0,0.25);
        }
        .next-admin-top-bar-glass{
            .next-admin-top-bar-center-container{
                padding-top:10px;
                padding-bottom:10px;
                border-bottom:1px solid rgba(255,255,255,0.1)
            }
        }

        .next-admin-top-bar-glass.scroll {
            background-color:` + UI.DefaultStyle.BlueTwo + `;
            box-shadow:0px 0px 2px rgba(0,0,0,0.25);
            .next-admin-top-bar-center-container{
                padding-top:0px;
                padding-bottom:0px;
                border-bottom:0px;
            }
        }

        `;
        UI.NavigationTopBar = NavigationTopBar;
        class NavigationLink extends UI.Link {
            constructor(options) {
                super(options);
                NextAdmin.Style.append('NextAdmin.UI.NavigationLink', NavigationLink.style);
                this.element.classList.add('next-admin-navigation-link');
            }
            setActive(value = true) {
                if (value && !this.element.classList.contains('next-admin-navigation-link-active')) {
                    this.element.classList.add('next-admin-navigation-link-active');
                }
                else if (!value && this.element.classList.contains('next-admin-navigation-link-active')) {
                    this.element.classList.remove('next-admin-navigation-link-active');
                }
            }
        }
        NavigationLink.style = `

        .next-admin-navigation-link{
            font-size:16px;
            margin-left:10px;
            margin-right:10px;
        }

        .next-admin-navigation-link-active.dark{
            color:` + UI.DefaultStyle.BlueOne + `;
        }

        .next-admin-navigation-link-active.blue{
            color:` + UI.DefaultStyle.BlueTwo + `;
        }

        .next-admin-navigation-link-active.white{
            color:#fff;
            font-weight:600;
        }

        `;
        UI.NavigationLink = NavigationLink;
        let NavigationTopBarStyle;
        (function (NavigationTopBarStyle) {
            NavigationTopBarStyle[NavigationTopBarStyle["white"] = 0] = "white";
            NavigationTopBarStyle[NavigationTopBarStyle["noBackgroundStickyDarkBlue"] = 1] = "noBackgroundStickyDarkBlue";
        })(NavigationTopBarStyle = UI.NavigationTopBarStyle || (UI.NavigationTopBarStyle = {}));
    })(UI = NextAdmin.UI || (NextAdmin.UI = {}));
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    var UI;
    (function (UI) {
        class PinsCard extends UI.Control {
            constructor(options) {
                super('div', {
                    backgroundColor: '#fff',
                    iconColor: UI.DefaultStyle.BlueTwo,
                    textColor: '#777',
                    isResponsive: true,
                    ...options
                });
                NextAdmin.Style.append('NextAdmin.UI.PinsCard', PinsCard.style);
                this.element.classList.add('next-admin-pins-card');
                if (this.options.isResponsive) {
                    this.element.classList.add('responsive');
                }
                this.element.appendHTML('div', (pins) => {
                    pins.classList.add('next-admin-pins-card-pins');
                    pins.style.backgroundColor = this.options.backgroundColor;
                    pins.style.color = this.options.iconColor;
                    pins.centerContent();
                    pins.innerHTML = this.options.icon ?? '';
                });
                this.element.appendHTML('div', (text) => {
                    text.classList.add('next-admin-pins-card-text');
                    text.style.color = this.options.textColor;
                    text.innerHTML = this.options.text ?? '';
                });
            }
        }
        PinsCard.style = `

        .next-admin-pins-card{
            width:180px;
            height:180px;
            .next-admin-pins-card-pins{
                margin:0 auto;
                box-shadow:0px 0px 2px rgba(0,0,0,25);
                border-radius:100%;
                width:100px;
                height:100px;
                font-size:60px;
            }
            .next-admin-pins-card-text{
                margin-top:15px;
                text-shadow:0px 0px 2px rgba(0,0,0,0.25);
                text-align:center;
                font-size:14px;
            }
        }
        .next-admin-pins-card.responsive{
            @media (max-width: 1280px) {
                width:140px;
                height:140px;
                .next-admin-pins-card-pins{
                    width:80px;
                    height:80px;
                    font-size:45px;
                }
                .next-admin-pins-card-text{
                    margin-top:10px;
                    font-size:12px;
                }
            }
            @media (max-width: 768px) {
                width:100px;
                height:100px;
                .next-admin-pins-card-pins{
                    width:60px;
                    height:60px;
                    font-size:35px;
                }
                .next-admin-pins-card-text{
                    margin-top:6px;
                    font-size:11px;
                }
            }
        }
        `;
        UI.PinsCard = PinsCard;
    })(UI = NextAdmin.UI || (NextAdmin.UI = {}));
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    var UI;
    (function (UI) {
        class Separator extends UI.Control {
            constructor(options) {
                super('div', options);
                NextAdmin.Style.append('NextAdmin.UI.Separator', Separator.style);
                this.element.classList.add('next-admin-separator');
            }
        }
        Separator.style = `

        .next-admin-separator{
            margin-top:40px;
            margin-bottom:40px;
            height:1px;
            background-color:#ccc;
            box-shadow:0px 0px 12px rgba(0,0,0,0.25);
        }
        `;
        UI.Separator = Separator;
    })(UI = NextAdmin.UI || (NextAdmin.UI = {}));
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    var UI;
    (function (UI) {
        class Slider extends NextAdmin.UI.Control {
            constructor(options) {
                super('div', {
                    changeSlideDelaySecond: 10,
                    navigationButtonsStyle: NextAdmin.UI.ButtonStyle.noBg,
                    ...options
                });
                this.slides = new Array();
                this._updateCarousel = false;
                NextAdmin.Style.append('NextAdmin.UI.Slider', Slider.style);
                this.element.classList.add('next-admin-slider');
                this.slidesContainer = this.element.appendHTML('div', (slidesContainer) => {
                    slidesContainer.classList.add('next-admin-slides-container');
                });
                this.previousSlideArrowContainer = this.element.appendHTML('div', (leftArrowContainer) => {
                    leftArrowContainer.classList.add('next-admin-slider-left-arrow-container');
                    leftArrowContainer.appendControl(new UI.Button({
                        text: NextAdmin.Resources.iconCaretLeft,
                        style: this.options.navigationButtonsStyle,
                        size: UI.ButtonSize.large,
                        action: () => {
                            this.passToPreviousSlide();
                        }
                    }), (btnPreviousSlide) => {
                        btnPreviousSlide.element.center();
                    });
                });
                this.nextSlideArrowContainer = this.element.appendHTML('div', (rightArrowContainer) => {
                    rightArrowContainer.classList.add('next-admin-slider-right-arrow-container');
                    rightArrowContainer.appendControl(new UI.Button({
                        text: NextAdmin.Resources.iconCaretRight,
                        style: this.options.navigationButtonsStyle,
                        size: UI.ButtonSize.large,
                        action: () => {
                            this.passToNextSlide();
                        }
                    }), (btnNextSlide) => {
                        btnNextSlide.element.center();
                    });
                });
                if (this.options.slides?.length) {
                    for (let item of this.options.slides) {
                        this.addSlideItem(item);
                    }
                }
                if (this.options.imageUrls?.length) {
                    for (let imageUrl of this.options.imageUrls) {
                        this.addSlideItem({
                            imageUrl: imageUrl,
                            imageSize: this.options.imagesSize,
                            imagePosition: this.options.imagePosition,
                        });
                    }
                }
                if (this.options.autoPlay) {
                    this.startPlay();
                    if (this.options.page) {
                        this.options.page.onEndNavigateFrom.subscribe(this.dispose);
                    }
                }
            }
            async startPlay() {
                if (this._updateCarousel)
                    return;
                this._updateCarousel = true;
                while (this._updateCarousel) {
                    await NextAdmin.Timer.sleep(this.options.changeSlideDelaySecond * 1000);
                    this.passToNextSlide();
                }
            }
            stopPlay() {
                this._updateCarousel = false;
            }
            addSlideItem(itemOption) {
                return this.appendSlide(new Slide(itemOption));
            }
            appendSlide(control, configAction) {
                this.slides.add(control);
                if (this.getActiveSlide() == null) {
                    this.setActiveSlide(control);
                }
                if (configAction) {
                    configAction(control);
                }
                this.updateSlideNavigationArrows();
                return control;
            }
            setActiveSlide(slide) {
                let activeItem = this.getActiveSlide();
                if (activeItem) {
                    activeItem.element.remove();
                }
                this.slidesContainer.appendControl(slide);
                slide.element.anim('fadeIn', { animationSpeed: NextAdmin.AnimationSpeed.faster });
                this._activeSlide = slide;
            }
            getActiveSlide() {
                return this._activeSlide;
            }
            passToNextSlide() {
                let nextSlide = this.getNextSlide();
                if (nextSlide == null || nextSlide == this._activeSlide) {
                    return;
                }
                this.setActiveSlide(nextSlide);
            }
            passToPreviousSlide() {
                let previousSlide = this.getPreviousSlide();
                if (previousSlide == null || previousSlide == this._activeSlide) {
                    return;
                }
                this.setActiveSlide(previousSlide);
            }
            getNextSlide() {
                if (!this.slides?.length) {
                    return null;
                }
                let activeSlide = this.getActiveSlide();
                if (activeSlide == null) {
                    return null;
                }
                let nextSlideIndex = this.slides.indexOf(activeSlide) + 1;
                if (nextSlideIndex >= this.slides.length) { //last slide
                    return this.slides.firstOrDefault();
                }
                return this.slides[nextSlideIndex];
            }
            getPreviousSlide() {
                if (!this.slides?.length) {
                    return null;
                }
                let activeSlide = this.getActiveSlide();
                if (activeSlide == null) {
                    return null;
                }
                let previousSlideIndex = this.slides.indexOf(activeSlide) - 1;
                if (previousSlideIndex < 0) {
                    return this.slides.lastOrDefault();
                }
                return this.slides[previousSlideIndex];
            }
            updateSlideNavigationArrows() {
                if (this.slides.length > 1) {
                    this.previousSlideArrowContainer.style.display = '';
                    this.nextSlideArrowContainer.style.display = '';
                }
                else {
                    this.previousSlideArrowContainer.style.display = 'none';
                    this.nextSlideArrowContainer.style.display = 'none';
                }
            }
            dispose() {
                this._updateCarousel = false;
                if (this.options.page) {
                    this.options.page.onEndNavigateFrom.unsubscribe(this.dispose);
                }
            }
        }
        Slider.style = `
        .next-admin-slider{

            position:relative;
            height:600px;

            .next-admin-slides-container{
                position:relative;
                width:100%;
                height:100%;
            }

            .next-admin-slider-left-arrow-container{
                position:absolute;
                left:0px;
                top:0px;
                width:40px;
                height:100%;
            }
            .next-admin-slider-right-arrow-container{
                position:absolute;
                right:0px;
                top:0px;
                width:40px;
                height:100%;
            }
        }
        `;
        UI.Slider = Slider;
        class Slide extends UI.Control {
            constructor(options) {
                super('div', {
                    imageSize: 'cover',
                    imagePosition: 'center top',
                    ...options
                });
                NextAdmin.Style.append('NextAdmin.UI.Slide', Slide.style);
                this.element.classList.add('next-admin-slide');
                if (this.options.imageUrl) {
                    this.element.style.background = 'url("' + this.options.imageUrl + '")';
                    this.element.style.backgroundSize = this.options.imageSize;
                    this.element.style.backgroundRepeat = 'no-repeat';
                    this.element.style.backgroundPosition = this.options.imagePosition;
                }
                if (this.options.content) {
                    this.element.appendChild(this.options.content);
                }
            }
        }
        Slide.style = `

        .next-admin-slide{
            height:100%;
            position:relative;
        }

        `;
        UI.Slide = Slide;
        class HeadingSlide extends Slide {
            constructor(options) {
                super({
                    textColor: '#ffffff',
                    ...options
                });
                this.element.appendControl(new UI.HorizontalFlexLayout(), (flexLayout) => {
                    flexLayout.element.style.height = '100%';
                    flexLayout.appendHTML('div', (emptyLeftArea) => {
                        emptyLeftArea.style.width = '80px';
                    });
                    flexLayout.appendHTMLStretch('div', (centerArea) => {
                        centerArea.appendHTML('a', (content) => {
                            content.centerVertically();
                            if (this.options.textColor) {
                                content.style.color = this.options.textColor;
                                content.style.textDecoration = 'none';
                                content.style.textShadow = '0px 0px 2px rgba(0,0,0,0.75)';
                            }
                            if (this.options.targetUrl) {
                                content.href = this.options.targetUrl;
                            }
                            if (this.options.title) {
                                content.appendHTML('div', (title) => {
                                    title.style.fontSize = '34px';
                                    title.innerHTML = this.options.title;
                                });
                            }
                            if (this.options.subTitle) {
                                content.appendHTML('div', (title) => {
                                    title.style.fontSize = '24px';
                                    title.style.fontWeight = '100';
                                    title.innerHTML = this.options.subTitle;
                                });
                            }
                            if (this.options.hoverText) {
                                content.appendControl(new UI.AnimatedHoverText({
                                    text: this.options.hoverText,
                                    color: this.options.textColor,
                                }), (hoverText) => {
                                    hoverText.element.style.width = 'fit-content';
                                    this.element.addEventListener('pointerenter', () => {
                                        hoverText.animDisplayText();
                                    });
                                    this.element.addEventListener('pointerleave', () => {
                                        hoverText.animHideText();
                                    });
                                });
                            }
                        });
                    });
                    flexLayout.appendHTML('div', (emptyRightArea) => {
                        emptyRightArea.style.width = '40px';
                    });
                });
            }
        }
        UI.HeadingSlide = HeadingSlide;
    })(UI = NextAdmin.UI || (NextAdmin.UI = {}));
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    var UI;
    (function (UI) {
        class SliderImageViewer extends UI.Slider {
            constructor(options) {
                super({
                    openInFullScreenText: NextAdmin.FrontEndResources.display,
                    navigationButtonsStyle: NextAdmin.UI.ButtonStyle.noBg,
                    isImageHoverZoomEnabled: true,
                    imagesSize: 'contain',
                    ...options
                });
                NextAdmin.Style.append('NextAdmin.UI.SliderImageViewer', SliderImageViewer.style);
                this.element.classList.add('next-admin-slider-image-viewer');
                this.hoverText = this.element.appendControl(new UI.AnimatedHoverText({
                    css: {
                        position: 'absolute',
                        bottom: '20%'
                    },
                    text: this.options.openInFullScreenText
                }));
            }
            appendSlide(control, configAction) {
                let slide = super.appendSlide(control, configAction);
                slide.element.classList.add('image-viewer-slide-image');
                if (this.options.isImageHoverZoomEnabled) {
                    slide.element.classList.add('image-viewer-slide-image-zoom');
                }
                slide.element.addEventListener('pointerenter', () => {
                    this.hoverText.animDisplayText();
                });
                slide.element.addEventListener('pointerleave', () => {
                    this.hoverText.animHideText();
                });
                slide.element.addEventListener('click', () => {
                    this.openImagesViewerModal();
                });
                return slide;
            }
            openImagesViewerModal() {
                new UI.ImageViewerModal({ imageUrls: this.slides.where(a => a.options.imageUrl != null).select(a => a.options.imageUrl) }).open();
            }
        }
        SliderImageViewer.style = `
        .next-admin-slider-image-viewer{

            .image-viewer-slide-image{
                cursor:pointer;
                transition: all 0.9s;
            }
            .image-viewer-slide-image-zoom{
                transform: scale(0.95);
            }
            .image-viewer-slide-image-zoom:hover{
                transform: scale(1.02);
            }
        }

        `;
        UI.SliderImageViewer = SliderImageViewer;
    })(UI = NextAdmin.UI || (NextAdmin.UI = {}));
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    var UI;
    (function (UI) {
        class ThirdPartyOauthPanel extends UI.Control {
            constructor(options) {
                super('div', {
                    afterOAuthUrlCookieName: 'AFTER_OAUTH_URL',
                    afterOAuthUrl: options.afterOAuthPageName ? (window.location.origin + '/' + options.afterOAuthPageName) : window.location.href,
                    ...options
                });
                this.element.appendControl(new NextAdmin.UI.HorizontalFlexLayout({ css: { marginBottom: '20px', marginTop: '20px' } }), (flexLayout) => {
                    flexLayout.appendHTMLStretch('div', (stretchContainer) => {
                        stretchContainer.appendHTML('div', (border) => {
                            border.style.borderBottom = '1px solid #ddd';
                            border.centerVertically();
                        });
                    });
                    flexLayout.appendHTML('div', (text) => {
                        text.style.padding = '10px';
                        text.innerHTML = NextAdmin.FrontEndResources.or.toUpperCase();
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
                        text: NextAdmin.FrontEndResources.googleIcon + ' ' + NextAdmin.FrontEndResources.signInWithGoogle,
                        action: () => {
                            if (this.options.afterOAuthUrlCookieName) {
                                NextAdmin.Cookies.set(this.options.afterOAuthUrlCookieName, this.options.afterOAuthUrl);
                            }
                            window.location.href = ThirdPartyOauthPanel.getOAuthUrl(this.options.googleOauthOptions, this.options.emailAddress);
                        }
                    }), (btn) => {
                        btn.element.style.width = '100%';
                    });
                }
            }
            static getOAuthUrl(oAuthOptions, userGmailEmailAddress) {
                let url = oAuthOptions?.oauthUrl ?? ('https://accounts.google.com/o/oauth2/v2/auth?client_id='
                    + oAuthOptions.clientId
                    + '&redirect_uri=' + oAuthOptions.redirectionUrl
                    + '&response_type=code'
                    + '&scope=' + encodeURI((oAuthOptions.scopes ?? ['https://www.googleapis.com/auth/userinfo.email']).join(' ')));
                if (userGmailEmailAddress) {
                    url += '&login_hint=' + userGmailEmailAddress;
                }
                return url;
            }
        }
        UI.ThirdPartyOauthPanel = ThirdPartyOauthPanel;
    })(UI = NextAdmin.UI || (NextAdmin.UI = {}));
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    var UI;
    (function (UI) {
        class ChangeEmailModal extends UI.Modal {
            constructor(options) {
                super({
                    title: NextAdmin.Resources.emailIcon + ' ' + NextAdmin.Resources.changeEmailModalTitle,
                    backdropColor: 'rgba(0,0,0,0.2)',
                    size: UI.ModalSize.smallFitContent, ...options
                });
                this.body.appendHTML('div', (container) => {
                    container.style.padding = '20px';
                    let newEmailInput = container.appendControl(new NextAdmin.UI.Input({
                        label: NextAdmin.Resources.newEmail,
                        labelPosition: NextAdmin.UI.FormControlLabelPosition.top,
                        size: NextAdmin.UI.InputSize.large
                    }), (input) => {
                        input.element.style.marginBottom = '20px';
                    });
                    container.appendControl(new UI.Button({
                        text: NextAdmin.Resources.emailIcon + ' ' + NextAdmin.Resources.confirmEmail,
                        style: NextAdmin.UI.ButtonStyle.lightBlue,
                        size: NextAdmin.UI.ButtonSize.large,
                        action: async (button) => {
                            this.startSpin();
                            let step1Response = await this.options.userClient.changeEmailStep1(newEmailInput.getValue());
                            this.stopSpin();
                            if (!step1Response?.isSuccess) {
                                this.displayStep1Error(step1Response);
                                return;
                            }
                            button.element.style.display = 'none';
                            newEmailInput.disable();
                            NextAdmin.UI.MessageBox.createOk(NextAdmin.Resources.emailIcon + " " + NextAdmin.Resources.confirmationCode, NextAdmin.Resources.confirmationCodeMessage);
                            let timer = new NextAdmin.Timer();
                            let confirmationCodeInput = container.appendControl(new NextAdmin.UI.Input({
                                label: NextAdmin.Resources.confirmationCode,
                                labelPosition: NextAdmin.UI.FormControlLabelPosition.top,
                                size: NextAdmin.UI.InputSize.large
                            }), (confirmationCodeInput) => {
                                confirmationCodeInput.onValueChanged.subscribe((sender, args) => {
                                    confirmCodeButton.executeAction();
                                });
                            });
                            confirmationCodeInput.element.style.marginBottom = '20px';
                            let confirmCodeButton = container.appendControl(new NextAdmin.UI.Button({
                                text: NextAdmin.Resources.checkIcon + ' ' + NextAdmin.Resources.validate,
                                style: NextAdmin.UI.ButtonStyle.lightBlue,
                                size: NextAdmin.UI.ButtonSize.large,
                                action: (btn) => {
                                    timer.throttle(async () => {
                                        btn.startSpin();
                                        let confirmCodeResponse = await this.options.userClient.changeEmailStep2(newEmailInput.getValue(), confirmationCodeInput.getValue());
                                        btn.stopSpin();
                                        if (confirmCodeResponse?.isSuccess) {
                                            this.close();
                                            if (this.options.onEmailUpdated) {
                                                this.options.onEmailUpdated(newEmailInput.getValue());
                                            }
                                        }
                                    }, 100);
                                }
                            }));
                            confirmCodeButton.changeEnableStateOnControlsRequiredValueChanged(() => !NextAdmin.String.isNullOrEmpty(confirmationCodeInput.getValue()), confirmationCodeInput);
                        }
                    }), (btn) => {
                        btn.changeEnableStateOnControlsRequiredValueChanged(() => !NextAdmin.String.isNullOrEmpty(newEmailInput.getValue()), newEmailInput);
                    });
                });
            }
            displayStep1Error(apiResponse) {
                switch (apiResponse?.code) {
                    case 'EMAIL_ALREADY_USED':
                        NextAdmin.UI.MessageBox.createOk(NextAdmin.Resources.error, NextAdmin.Resources.userAlreadyExist);
                    case 'UNABLE_TO_SEND_EMAIL':
                        NextAdmin.UI.MessageBox.createOk(NextAdmin.Resources.error, NextAdmin.Resources.unableToSendEmail);
                    case 'INVALID_EMAIL':
                        NextAdmin.UI.MessageBox.createOk(NextAdmin.Resources.error, NextAdmin.Resources.invalidEmail);
                    case 'INVALID_PASSWORD':
                        NextAdmin.UI.MessageBox.createOk(NextAdmin.Resources.error, NextAdmin.Resources.invalidPassword);
                    default:
                        NextAdmin.UI.MessageBox.createOk(NextAdmin.Resources.error, NextAdmin.Resources.unknownError);
                }
            }
        }
        UI.ChangeEmailModal = ChangeEmailModal;
    })(UI = NextAdmin.UI || (NextAdmin.UI = {}));
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    var UI;
    (function (UI) {
        class SendSupportMessageModal extends NextAdmin.UI.Modal {
            constructor(options) {
                super({
                    title: NextAdmin.Resources.emailIcon + ' ' + NextAdmin.FrontEndResources.contact,
                    size: NextAdmin.UI.ModalSize.smallFitContent,
                    backdropColor: 'rgba(0,0,0,0.2)',
                    ...options
                });
                this.body.appendHTML('div', container => {
                    container.style.padding = '20px';
                    this.emailInput = container.appendControl(new NextAdmin.UI.Input({
                        inputType: NextAdmin.UI.InputType.email,
                        labelPosition: NextAdmin.UI.FormControlLabelPosition.top,
                        label: 'E-mail',
                        value: this.options.email,
                        required: true,
                        css: {
                            marginBottom: '20px'
                        }
                    }));
                    this.textArea = container.appendControl(new NextAdmin.UI.TextArea({
                        displayMode: NextAdmin.UI.TextAreaDisplayMode.stretchHeight,
                        css: {
                            minHeight: '200px',
                            marginBottom: '20px'
                        }
                    }));
                    this.sendMessageButton = container.appendControl(new NextAdmin.UI.Button({
                        text: NextAdmin.Resources.emailIcon + ' ' + NextAdmin.FrontEndResources.send,
                        style: NextAdmin.UI.ButtonStyle.lightBlue,
                        size: NextAdmin.UI.ButtonSize.large,
                        css: { cssFloat: 'right' },
                        action: async () => {
                            this.startSpin();
                            let response = await this.options.commonServicesClient.sendContactMessage(this.textArea.getValue(), this.emailInput.getValue());
                            if (response?.isSuccess) {
                                this.close();
                                NextAdmin.UI.MessageBox.createOk(NextAdmin.FrontEndResources.messageSentTitle, NextAdmin.FrontEndResources.messageSentText);
                            }
                            else {
                                NextAdmin.UI.MessageBox.createOk(NextAdmin.Resources.error, NextAdmin.Resources.unknownError);
                            }
                            this.stopSpin();
                        }
                    }));
                    this.sendMessageButton.changeEnableStateOnControlsRequiredValueChanged(() => !NextAdmin.String.isNullOrEmpty(this.textArea.getValue()) && !NextAdmin.String.isNullOrEmpty(this.emailInput.getValue()), this.textArea, this.emailInput);
                });
            }
        }
        UI.SendSupportMessageModal = SendSupportMessageModal;
    })(UI = NextAdmin.UI || (NextAdmin.UI = {}));
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    var UI;
    (function (UI) {
        class SignInModal extends NextAdmin.UI.Modal {
            constructor(options) {
                super({
                    title: NextAdmin.Resources.signIn,
                    size: NextAdmin.UI.ModalSize.smallFitContent,
                    backdropColor: 'rgba(0,0,0,0.2)',
                    recoverPasswordModalFactory: (options) => new NextAdmin.UI.RecoverPasswordModal(options),
                    ...options
                });
                this.container = this.body.appendHTML('div', (container) => {
                    container.style.padding = '40px';
                    this.userNameInput = container.appendControl(new NextAdmin.UI.Input({
                        label: NextAdmin.Resources.login,
                        labelPosition: NextAdmin.UI.FormControlLabelPosition.top,
                        size: NextAdmin.UI.InputSize.large
                    }));
                    this.userNameInput.element.style.marginBottom = '20px';
                    this.passwordInput = container.appendControl(new NextAdmin.UI.Input({
                        label: NextAdmin.Resources.password,
                        inputType: NextAdmin.UI.InputType.password,
                        labelPosition: NextAdmin.UI.FormControlLabelPosition.top,
                        size: NextAdmin.UI.InputSize.large
                    }), (passwordInput) => {
                        passwordInput.input.addEventListener('keyup', (args) => {
                            if (args.keyCode == 13) {
                                this.tryLogUser();
                            }
                        });
                    });
                    this.passwordInput.element.style.marginBottom = '20px';
                    container.appendHTML('table', (table) => {
                        table.style.width = '100%';
                        table.style.marginBottom = '20px';
                        table.appendHTML('tr', (tr) => {
                            tr.appendHTML('td', (td) => {
                                td.style.width = '60%';
                                this.rememberMeCheckbox = td.appendControl(new NextAdmin.UI.Input({
                                    labelWidth: '70%',
                                    inputType: NextAdmin.UI.InputType.checkbox,
                                    size: NextAdmin.UI.InputSize.large,
                                    value: true,
                                    label: NextAdmin.Resources.rememberMe,
                                }));
                            });
                            tr.appendHTML('td', (td) => {
                                td.appendControl(new NextAdmin.UI.Button({
                                    text: NextAdmin.Resources.forgottenPassword + ' ?',
                                    style: NextAdmin.UI.ButtonStyle.noBgBlue,
                                    action: () => {
                                        this.close();
                                        this.options.recoverPasswordModalFactory({
                                            userClient: this.options.userClient,
                                            email: this.userNameInput.getValue(),
                                            onClose: () => {
                                                this.open();
                                            }
                                        }).open();
                                    }
                                }));
                            });
                        });
                    });
                    container.appendHTML('table', (table) => {
                        table.style.marginBottom = '20px';
                        table.appendHTML('tr', (tr) => {
                            tr.appendHTML('td', (td) => {
                                this.buttonSignIn = td.appendControl(new NextAdmin.UI.Button({
                                    text: NextAdmin.Resources.keyIcon + ' ' + NextAdmin.Resources.signIn,
                                    style: NextAdmin.UI.ButtonStyle.lightBlue,
                                    size: NextAdmin.UI.ButtonSize.large,
                                    action: () => {
                                        this.tryLogUser();
                                    }
                                }));
                                this.buttonSignIn.changeEnableStateOnControlsRequiredValueChanged(() => !NextAdmin.String.isNullOrEmpty(this.userNameInput.getValue()) && !NextAdmin.String.isNullOrEmpty(this.passwordInput.getValue()), this.userNameInput, this.passwordInput);
                            });
                            tr.appendHTML('td', (td) => {
                                td.style.paddingLeft = '10px';
                                this.signInMessageContainer = td.appendHTML('span');
                                this.signInMessageContainer.style.color = '#cf0e0e';
                                this.signInMessageContainer.style.fontWeight = '600';
                            });
                        });
                    });
                    if (this.options.signUpAction) {
                        container.appendHTML('div', (footer) => {
                            footer.appendHTML('span', NextAdmin.Resources.noAccount);
                            footer.appendControl(new NextAdmin.UI.Button({
                                text: NextAdmin.Resources.createAccount,
                                style: NextAdmin.UI.ButtonStyle.noBgBlue,
                                action: () => {
                                    this.close();
                                    this.options.signUpAction();
                                }
                            }));
                        });
                    }
                    if (this.options.googleOauthOptions) {
                        container.appendControl(new UI.ThirdPartyOauthPanel({ googleOauthOptions: this.options.googleOauthOptions }));
                    }
                });
            }
            async tryLogUser() {
                let userName = this.userNameInput.getValue();
                let password = this.passwordInput.getValue();
                if (NextAdmin.String.isNullOrEmpty(userName) || NextAdmin.String.isNullOrEmpty(password))
                    return;
                this.signInMessageContainer.innerHTML = '';
                this.modal.startSpin();
                let authTokenResponse = await this.options.userClient.authUser(userName, password, this.rememberMeCheckbox.getValue());
                this.modal.stopSpin();
                if (!authTokenResponse?.isSuccess) {
                    this.signInMessageContainer.innerHTML = NextAdmin.Resources.invalidCredentials;
                    return;
                }
                if (this.options.onSignIn) {
                    this.close();
                    this.options.onSignIn(authTokenResponse);
                }
            }
        }
        UI.SignInModal = SignInModal;
    })(UI = NextAdmin.UI || (NextAdmin.UI = {}));
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    var UI;
    (function (UI) {
        class SignUpModal extends NextAdmin.UI.Modal {
            constructor(options) {
                super({
                    title: NextAdmin.Resources.signUp,
                    backdropColor: 'rgba(0,0,0,0.2)',
                    size: NextAdmin.UI.ModalSize.smallFitContent,
                    ...options
                });
                this.container = this.body.appendHTML('div', (container) => {
                    container.style.padding = '40px';
                    this.step1Container = container.appendHTML('div', (step1Container) => {
                        this.emailInput = step1Container.appendControl(new NextAdmin.UI.Input({
                            label: NextAdmin.Resources.login,
                            labelPosition: NextAdmin.UI.FormControlLabelPosition.top,
                            size: NextAdmin.UI.InputSize.large
                        }));
                        this.emailInput.element.style.marginBottom = '20px';
                        this.passwordInput = step1Container.appendControl(new NextAdmin.UI.Input({
                            label: NextAdmin.Resources.password,
                            inputType: NextAdmin.UI.InputType.password,
                            labelPosition: NextAdmin.UI.FormControlLabelPosition.top,
                            size: NextAdmin.UI.InputSize.large
                        }));
                        this.passwordInput.element.style.marginBottom = '20px';
                        this.verifyEmailButton = step1Container.appendControl(new NextAdmin.UI.Button({
                            text: NextAdmin.Resources.checkIcon + ' ' + NextAdmin.FrontEndResources.verifyInformations,
                            style: NextAdmin.UI.ButtonStyle.lightBlue,
                            size: NextAdmin.UI.ButtonSize.large,
                            action: async (btn) => {
                                let signUpData = this.getSignUpData();
                                if (signUpData == null) {
                                    return;
                                }
                                this.stepOneErrorContainer.innerHTML = "";
                                this.modal.startSpin();
                                let signUpUserResponse = await this.options.userClient.signUpUser(signUpData);
                                this.modal.stopSpin();
                                if (!signUpUserResponse?.isSuccess) {
                                    this.stepOneErrorContainer.innerHTML = this.getSignUpErrorMessage(signUpUserResponse) ?? '';
                                    return;
                                }
                                step1Container.disable();
                                this.verifyEmailButton.element.style.display = 'none';
                                if (this.signInContainer) {
                                    this.signInContainer.style.display = 'none';
                                }
                                NextAdmin.UI.MessageBox.createOk(NextAdmin.Resources.emailIcon + " " + NextAdmin.Resources.confirmationCode, NextAdmin.Resources.confirmationCodeMessage);
                                let timer = new NextAdmin.Timer();
                                this.confirmationCodeInput = this.step2Container.appendControl(new NextAdmin.UI.Input({
                                    label: NextAdmin.Resources.confirmationCode,
                                    labelPosition: NextAdmin.UI.FormControlLabelPosition.top,
                                    size: NextAdmin.UI.InputSize.large
                                }), (confirmationCodeInput) => {
                                    confirmationCodeInput.onValueChanged.subscribe((sender, args) => {
                                        this.confirmCodeButton.executeAction();
                                    });
                                });
                                this.confirmationCodeInput.element.style.marginBottom = '20px';
                                this.confirmCodeButton = this.step2Container.appendControl(new NextAdmin.UI.Button({
                                    text: NextAdmin.Resources.checkIcon + ' ' + NextAdmin.Resources.validate,
                                    style: NextAdmin.UI.ButtonStyle.lightBlue,
                                    size: NextAdmin.UI.ButtonSize.large,
                                    action: (btn) => {
                                        timer.throttle(async () => {
                                            btn.startSpin();
                                            let confirmCodeResponse = await this.options.userClient.confirmUserSignUpEmailCode(signUpUserResponse.data, this.confirmationCodeInput.getValue());
                                            btn.stopSpin();
                                            if (confirmCodeResponse?.isSuccess) {
                                                this.close();
                                                this.options.onSignUp(this.emailInput.getValue(), this.passwordInput.getValue());
                                            }
                                        }, 100);
                                    }
                                }));
                            }
                        }));
                        this.verifyEmailButton.element.style.marginBottom = '20px';
                        setTimeout(() => {
                            this.verifyEmailButton.changeEnableStateOnControlsRequiredValueChanged(() => this.getRequiredFormControls().firstOrDefault(a => !a.getValue()) == null, ...this.getRequiredFormControls());
                        }, 1);
                        this.stepOneErrorContainer = step1Container.appendHTML('div', (errorMessageContainer) => {
                            errorMessageContainer.style.color = NextAdmin.UI.DefaultStyle.RedOne;
                        });
                    });
                    this.step2Container = container.appendHTML('div');
                    if (this.options.signInAction) {
                        this.signInContainer = container.appendHTML('div', (footer) => {
                            footer.appendHTML('span', NextAdmin.Resources.haveAnAccount);
                            footer.appendControl(new NextAdmin.UI.Button({
                                text: NextAdmin.Resources.signIn,
                                style: NextAdmin.UI.ButtonStyle.noBgBlue,
                                action: () => {
                                    this.close();
                                    this.options.signInAction();
                                }
                            }));
                        });
                    }
                    if (this.options.googleOauthOptions) {
                        container.appendControl(new UI.ThirdPartyOauthPanel({ googleOauthOptions: this.options.googleOauthOptions }));
                    }
                });
            }
            getSignUpErrorMessage(apiResponse) {
                switch (apiResponse?.code) {
                    case 'USER_ALREADY_EXIST':
                        return NextAdmin.Resources.userAlreadyExist;
                    case 'UNABLE_TO_SEND_EMAIL':
                        return NextAdmin.Resources.unableToSendEmail;
                    case 'INVALID_EMAIL':
                        return NextAdmin.Resources.invalidEmail;
                    case 'INVALID_PASSWORD':
                        return NextAdmin.Resources.invalidPassword;
                    default:
                        return NextAdmin.Resources.unknownError;
                }
            }
            getSignUpData() {
                return {
                    email: this.emailInput.getValue(),
                    password: this.passwordInput.getValue()
                };
            }
            getRequiredFormControls() {
                return [this.emailInput, this.passwordInput];
            }
        }
        UI.SignUpModal = SignUpModal;
    })(UI = NextAdmin.UI || (NextAdmin.UI = {}));
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    var UI;
    (function (UI) {
        class FrontPage extends UI.Page {
            constructor(options) {
                super({
                    navigateToAnimation: 'fadeIn',
                    navigateToAnimationSpeed: NextAdmin.AnimationSpeed.faster,
                    navigateFromAnimation: null,
                    navigateFromAnimationSpeed: NextAdmin.AnimationSpeed.faster,
                    ...options
                });
                NextAdmin.Style.append('NextAdmin.UI.FrontPage', FrontPage.style);
                this.element.classList.add('next-admin-front-page');
            }
            async navigateTo(args) {
                await super.navigateTo(args);
                if (!NextAdmin.String.isNullOrEmpty(this.options.navigateToAnimation)) {
                    this.element.anim(this.options.navigateToAnimation, { animationSpeed: this.options.navigateToAnimationSpeed });
                }
            }
            async navigateFrom(args) {
                await super.navigateFrom(args);
                if (!NextAdmin.String.isNullOrEmpty(this.options.navigateFromAnimation)) {
                    this.element.anim(this.options.navigateFromAnimation, { animationSpeed: this.options.navigateFromAnimationSpeed });
                    await NextAdmin.Timer.sleep(250);
                }
            }
            appendContainer(options, configAction) {
                options = {
                    hasPadding: true,
                    maxWidth: UI.FrontDefaultStyle.PageContentMaxWidth,
                    ...options
                };
                let container = this.element.appendHTML('div', configAction);
                container.classList.add('next-admin-front-page-container');
                if (options?.hasPadding) {
                    container.classList.add('padding');
                }
                if (options?.maxWidth) {
                    container.style.maxWidth = options.maxWidth;
                }
                if (options?.minHeight) {
                    container.style.minHeight = options.minHeight;
                }
                return container;
            }
        }
        FrontPage.style = `

        .next-admin-front-page {
            width: 100%;
            min-height:100vh;
        }

        .next-admin-front-page-container{
            margin: 0 auto;
        }
        .next-admin-front-page-container.padding{
            padding:20px;
            @media (max-width: 1024px) {
                padding:16px;
            }
            @media (max-width: 768px) {
                padding:8px;
            }
            @media (max-width: 512px) {
                padding:4px;
            }
        }

        `;
        UI.FrontPage = FrontPage;
    })(UI = NextAdmin.UI || (NextAdmin.UI = {}));
})(NextAdmin || (NextAdmin = {}));
//# sourceMappingURL=NextAdmin.FrontEnd.js.map