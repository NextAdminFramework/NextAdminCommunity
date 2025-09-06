declare namespace NextAdmin {
    class FrontAppController<TUser extends NextAdmin.Models.User> extends NavigationController {
        httpClient: NextAdmin.Services.HttpClient;
        userClient: NextAdmin.Services.FrontEndUserClient;
        user: TUser;
        onUserSignIn: EventHandler<FrontAppController<TUser>, TUser>;
        onUserSignUp: EventHandler<FrontAppController<TUser>, TUser>;
        onUserLogged: EventHandler<FrontAppController<TUser>, TUser>;
        onUserLogOut: EventHandler<FrontAppController<TUser>, TUser>;
        onCultureChanged: EventHandler<FrontAppController<TUser>, string>;
        options: FrontAppControllerOptions;
        static style: string;
        constructor(options: FrontAppControllerOptions);
        startApp(navigateToUrl?: boolean): Promise<void>;
        logUser(user: TUser): Promise<void>;
        logOutUser(): void;
        signIn(onSignIn?: (user: NextAdmin.Models.User) => void): void;
        signUp(onSignUp?: (user: NextAdmin.Models.User) => void): void;
        getCulture(): string;
        getLanguage(): string;
        setCulture(culture: any, updateUserCulture?: boolean): Promise<void>;
        protected initializeResources(language: string): string;
    }
    interface FrontAppControllerOptions extends NavigationControllerOptions {
        httpClient?: NextAdmin.Services.HttpClient;
        userClient?: NextAdmin.Services.FrontEndUserClient;
        canSignIn?: boolean;
        canSignUp?: boolean;
        defaultFontPath?: string;
        signUpModalFactory?: (options?: NextAdmin.UI.SignUpModalOptions) => NextAdmin.UI.SignUpModal;
        signInModalFactory?: (options?: NextAdmin.UI.SignInModalOptions) => NextAdmin.UI.SignInModal;
    }
    var FrontApp: FrontAppController<NextAdmin.Models.User>;
}
declare namespace NextAdmin.Models {
    interface UserInvoiceDto {
        date?: Date;
        code: string;
        amount: number;
        stripeInvoiceLink: string;
    }
}
declare namespace NextAdmin {
    class FrontEndResourcesBase {
        googleIcon: string;
    }
}
declare namespace NextAdmin {
    class FrontEndResourcesEn extends FrontEndResourcesBase {
        contact: string;
        send: string;
        messageSentTitle: string;
        messageSentText: string;
        display: string;
        verifyInformations: string;
        or: string;
        signInWithGoogle: string;
        signUpWithGoogle: string;
    }
}
declare namespace NextAdmin {
    class FrontEndResourcesFr extends FrontEndResourcesEn {
        contact: string;
        send: string;
        messageSentTitle: string;
        messageSentText: string;
        display: string;
        verifyInformations: string;
        or: string;
        signInWithGoogle: string;
        signUpWithGoogle: string;
    }
    var FrontEndResources: FrontEndResourcesEn;
}
declare namespace NextAdmin.Services {
    class FrontEndServiceClient extends HttpClient {
        authTokenName?: string;
        constructor(rootServiceURL?: string, authTokenName?: string, authToken?: string);
        setAuthToken(authToken: string): void;
        getAuthToken(): any;
        sendSupportMessage(message: string, email?: string): Promise<NextAdmin.Models.ApiResponse>;
    }
}
declare namespace NextAdmin.Services {
    class FrontEndUserClient extends UserClient {
        authTokenName?: string;
        changeEmailStep1(email: string, authToken?: string): Promise<NextAdmin.Models.ApiResponse>;
        changeEmailStep2(email: string, code: string, authToken?: string): Promise<NextAdmin.Models.ApiResponse>;
        deleteUser(authToken?: string): Promise<NextAdmin.Models.ApiResponse>;
        signUpUser(args: NextAdmin.Models.SignUpUserArgs): Promise<NextAdmin.Models.ApiResponse<string>>;
        confirmUserSignUpEmailCode(userId: any, code: string): Promise<NextAdmin.Models.ApiResponse>;
        isUserAccountExist(email: string): Promise<boolean>;
    }
}
declare namespace NextAdmin.Services {
    class StripePaymentClient extends HttpClient {
        authTokenName?: string;
        static defaultControllerUrl: string;
        constructor(rootServiceURL?: string, authTokenName?: string, authToken?: string);
        setAuthToken(authToken: string): void;
        getItemStripePaymentLink(itemId: string): Promise<NextAdmin.Models.ApiResponse<string>>;
    }
}
declare namespace NextAdmin.Services {
    class StripeSubscriptionPlanClient extends HttpClient {
        authTokenName?: string;
        static defaultControllerUrl: string;
        constructor(rootServiceURL?: string, authTokenName?: string);
        setAuthToken(authToken: string): void;
        getSubscriptionStripePaymentLink(planId: string): Promise<NextAdmin.Models.ApiResponse<string>>;
        cancelSubscriptionAutoRenew(subscriptionId: string): Promise<NextAdmin.Models.ApiResponse>;
        resumeSubscriptionAutoRenew(subscriptionId: string): Promise<NextAdmin.Models.ApiResponse>;
        getUserInvoices(): Promise<NextAdmin.Models.ApiResponse<Array<Models.UserInvoiceDto>>>;
    }
}
declare namespace NextAdmin.UI {
    class FrontDefaultStyle {
        static PageContentMaxWidth: string;
        static PrimaryColor: string;
    }
}
declare namespace NextAdmin.UI {
    class AnimatedHoverText extends NextAdmin.UI.Control {
        hoverCenterredContainer: HTMLElement;
        hoverText: HTMLElement;
        underLine: HTMLDivElement;
        static style: string;
        options: AnimatedHoverTextOptions;
        constructor(options?: AnimatedHoverTextOptions);
        setText(text?: string): void;
        getText(): string;
        setColor(color: string): void;
        private _isHovertextVisible;
        animDisplayText(): Promise<void>;
        animHideText(): Promise<void>;
    }
    interface AnimatedHoverTextOptions extends ControlOptions {
        text?: string;
        color?: string;
    }
}
declare namespace NextAdmin.UI {
    class Card extends Control {
        static style: string;
        title: NextAdmin.UI.Title;
        body: HTMLDivElement;
        textContainer: HTMLDivElement;
        footer: HTMLDivElement;
        options: CardOptions;
        constructor(options?: CardOptions);
    }
    interface CardOptions extends ControlOptions {
        imageUrl?: string;
        imageSize?: string;
        imagePosition?: string;
        title?: string;
        text?: string;
        content?: HTMLElement;
        isResponsive?: boolean;
    }
}
declare namespace NextAdmin.UI {
    class CardPanel extends Control {
        static style: string;
        options: CardPanelOptions;
        constructor(options?: CardPanelOptions);
        setStyle(style?: CardPanelStyle): void;
    }
    interface CardPanelOptions extends ControlOptions {
        isResponsive?: boolean;
        style?: CardPanelStyle;
    }
    enum CardPanelStyle {
        none = 0,
        lightBackgroundLargeFont = 1
    }
}
declare namespace NextAdmin.UI {
    class CardsGrid extends NextAdmin.UI.Control {
        options: CardsGridOptions;
        header: HTMLDivElement;
        body: HTMLDivElement;
        footer: HTMLDivElement;
        static style: string;
        constructor(options?: CardsGridOptions);
        appendCard<TCard extends Control>(card: TCard, controlOption?: (card: TCard) => void): TCard;
        appendControl<TControl extends NextAdmin.UI.IControl>(control: TControl, configAction?: (control: TControl) => void): TControl;
        clear(): void;
    }
    interface CardsGridOptions extends NextAdmin.UI.ControlOptions {
        margin?: string;
    }
    class CardsDataGrid<TData> extends CardsGrid {
        protected dataset: TData[];
        cardFactory(data: TData): NextAdmin.UI.Control;
        clear(): void;
        setDataset(dataset?: Array<TData>): void;
        getDataset(): TData[];
        addDataset(dataset?: Array<TData>): void;
    }
}
declare namespace NextAdmin.UI {
    class IconCard extends Control {
        static style: string;
        options: IconCardOptions;
        constructor(options?: IconCardOptions);
    }
    interface IconCardOptions extends ControlOptions {
        icon?: string;
        imageUrl?: string;
        text?: string;
        action?: () => void;
    }
}
declare namespace NextAdmin.UI {
    class ImageCard extends NextAdmin.UI.Control {
        options: ImageCardOptions;
        element: HTMLDivElement;
        card: HTMLAnchorElement;
        cardImage: HTMLDivElement;
        imageTitle?: HTMLDivElement;
        textContainer?: HTMLDivElement;
        descriptionTitle?: HTMLDivElement;
        description?: HTMLDivElement;
        animatedHoverText: AnimatedHoverText;
        static style: string;
        constructor(options?: ImageCardOptions);
        setImageTitle(title?: string): void;
        setDescriptionTitle(title?: string): void;
        setDescription(title?: string): void;
        setHoverText(hoverText?: string): void;
        setSize(size: ImageCardSize): void;
        setStyle(style: ImageCardStyle): void;
        setBackground(url?: string): void;
    }
    interface ImageCardOptions extends NextAdmin.UI.ControlOptions {
        size?: ImageCardSize;
        style?: ImageCardStyle;
        imageUrl?: string;
        backgroundColor?: string;
        imageTitle?: string;
        imageHoverText?: string;
        outsideTitle?: string;
        outsideDescription?: string;
        href?: string;
        isResponsive?: boolean;
        action?: (card: ImageCard) => void;
    }
    enum ImageCardSize {
        extraSmall_1_1 = 0,
        small_1_1 = 1,
        small_4_3 = 2,
        small_3_4 = 3,
        small_9_16 = 4,
        medium_1_1 = 5,
        medium_4_3 = 6,
        medium_3_4 = 7,
        medium_9_16 = 8,
        large_1_1 = 9,
        large_4_3 = 10,
        large_3_4 = 11,
        large_9_16 = 12
    }
    enum ImageCardStyle {
        fullImageLightBordered = 0,
        fullImageShadowedBorderRadius = 1,
        fullImageShadowedBorderRadiusB = 2
    }
}
declare namespace NextAdmin.UI {
    class ImageViewerModal extends NoUiModal {
        options: ImageViewerModalOptions;
        constructor(options: ImageViewerModalOptions);
    }
    interface ImageViewerModalOptions extends ModalOptions {
        imageUrls?: Array<string>;
    }
}
declare namespace NextAdmin.UI {
    class LanguageSelectorDropDown extends DropDownButton {
        options: LanguageSelectorDropDownButtonOptions;
        static iconFr: string;
        static iconEn: string;
        static iconDe: string;
        static iconEs: string;
        constructor(options?: LanguageSelectorDropDownButtonOptions);
        protected getLanguageItemContent(languageInfo?: LanguageInfo, caret?: boolean): string;
        getLanguageInfo(languageCode: string): LanguageInfo;
        setLanguage(languageCode?: string, fireChanged?: boolean): void;
    }
    interface LanguageSelectorDropDownButtonOptions extends DropDownButtonOptions {
        languages?: Array<LanguageInfo>;
        languageChangedAction?: (language?: string) => void;
    }
    enum LanguageSelectorSuportedLanguage {
        en = "en",
        fr = "fr",
        es = "es",
        de = "de"
    }
    interface LanguageInfo {
        code?: string;
        label?: string;
        iconUrl?: string;
    }
}
declare namespace NextAdmin.UI {
    class MultiImageTextCard extends Control {
        options: TextMultiImagesCardOptions;
        cardBody: NextAdmin.UI.HorizontalFlexLayout;
        imageViewer: SliderImageViewer;
        static style: string;
        constructor(options?: TextMultiImagesCardOptions);
        dispose(): void;
    }
    interface TextMultiImagesCardOptions extends ControlOptions {
        imageUrls?: Array<string>;
        title?: string;
        subTitle?: string;
        text?: string;
        page?: Page;
        autoPlay?: boolean;
        isResponsive?: boolean;
    }
}
declare namespace NextAdmin.UI {
    class MultiImageViwer extends Control {
        options: MultiImageViwerOptions;
        mainImageContainer: AspectRatioContainer;
        miniatureImagesContainer: HTMLDivElement;
        private _images;
        private _activeImageId?;
        static style: string;
        constructor(options?: MultiImageViwerOptions);
        addImageItem(imageItem: MultiImageViwerImageItem): void;
        addImage(url: string): void;
        addImages(urls: Array<string>): void;
        setActiveImage(imageId?: string): void;
        getMiniatureImages(): Array<HTMLElement>;
        getMiniatureImage(imageId: string): HTMLElement;
    }
    interface MultiImageViwerOptions extends ControlOptions {
        aspectRationWidth?: number;
        aspectRationHeight?: number;
        miniatureImageSize?: string;
        isResponsive?: boolean;
        imageItems?: Array<MultiImageViwerImageItem>;
        imageUrls?: Array<string>;
    }
    interface MultiImageViwerImageItem {
        url?: string;
        description?: string;
    }
}
declare namespace NextAdmin.UI {
    class NavigationTopBar extends Control {
        options: NavigationTopBarOptions;
        container?: HTMLDivElement;
        layout?: FlexLayout;
        logoImage?: HTMLImageElement;
        logoLink: HTMLAnchorElement;
        leftToolbar: Toolbar;
        rightToolbar: Toolbar;
        stretchArea: HTMLDivElement;
        pageLinks: Dictionary<NavigationLink>;
        static style: string;
        constructor(options?: NavigationTopBarOptions);
        setStyle(style: NavigationTopBarStyle): void;
        addLeftNavigationLink(url: string, label: string, style?: LinkStyle): NavigationLink;
        addRightNavigationLink(url: string, label: string, style?: LinkStyle): NavigationLink;
        private addNavigationLink;
        appendRightLink(text: string, action?: () => void, style?: LinkStyle): NavigationLink;
        getDefaultLinkStyle(): LinkStyle;
    }
    class NavigationLink extends Link {
        static style: string;
        constructor(options: LinkOptions);
        setActive(value?: boolean): void;
    }
    interface NavigationTopBarOptions extends ControlOptions {
        isFixed?: boolean;
        maxContainerWidth?: string;
        imageLogoUrl?: string;
        textLogoHtmlContent?: string;
        navigationController?: NavigationController;
        style?: NavigationTopBarStyle;
    }
    enum NavigationTopBarStyle {
        white = 0,
        noBackgroundStickyDarkBlue = 1
    }
}
declare namespace NextAdmin.UI {
    class PinsCard extends Control {
        static style: string;
        options: PinsCardOptions;
        constructor(options: PinsCardOptions);
    }
    interface PinsCardOptions extends ControlOptions {
        text?: string;
        icon?: string;
        backgroundColor?: string;
        iconColor?: string;
        textColor?: string;
        isResponsive?: boolean;
    }
}
declare namespace NextAdmin.UI {
    class Separator extends Control {
        static style: string;
        constructor(options?: ControlOptions);
    }
}
declare namespace NextAdmin.UI {
    class Slider extends NextAdmin.UI.Control {
        options: SliderOptions;
        slides: Slide[];
        slidesContainer: HTMLDivElement;
        previousSlideArrowContainer: HTMLDivElement;
        nextSlideArrowContainer: HTMLDivElement;
        private _activeSlide?;
        static style: string;
        constructor(options?: SliderOptions);
        private _updateCarousel;
        startPlay(): Promise<void>;
        stopPlay(): void;
        addSlideItem(itemOption: SlideOptions): Slide;
        appendSlide(control: Slide, configAction?: (control: Slide) => void): Slide;
        setActiveSlide(slide: Slide): void;
        getActiveSlide(): Slide;
        passToNextSlide(): void;
        passToPreviousSlide(): void;
        getNextSlide(): Slide;
        getPreviousSlide(): Slide;
        updateSlideNavigationArrows(): void;
        dispose(): void;
    }
    interface SliderOptions extends NextAdmin.UI.ControlOptions {
        slides?: SlideOptions[];
        imageUrls?: Array<string>;
        imagesSize?: string;
        imagePosition?: string;
        autoPlay?: boolean;
        page?: Page;
        changeSlideDelaySecond?: number;
        navigationButtonsStyle?: NextAdmin.UI.ButtonStyle;
    }
    class Slide extends Control {
        options: SlideOptions;
        static style: string;
        constructor(options?: SlideOptions);
    }
    interface SlideOptions extends ControlOptions {
        imageUrl?: string;
        imageSize?: string;
        imagePosition?: string;
        content?: HTMLElement;
    }
    class HeadingSlide extends Slide {
        options: HeadingSlideOptions;
        constructor(options?: HeadingSlideOptions);
    }
    interface HeadingSlideOptions extends SlideOptions {
        textColor?: string;
        title?: string;
        subTitle?: string;
        hoverText?: string;
        targetUrl?: string;
    }
}
declare namespace NextAdmin.UI {
    class SliderImageViewer extends Slider {
        options: SliderImageViewerOptions;
        hoverText: AnimatedHoverText;
        static style: string;
        constructor(options?: SliderImageViewerOptions);
        appendSlide(control: Slide, configAction?: (control: Slide) => void): Slide;
        openImagesViewerModal(): void;
    }
    interface SliderImageViewerOptions extends SliderOptions {
        openInFullScreenText?: string;
        isImageHoverZoomEnabled?: boolean;
    }
}
declare namespace NextAdmin.UI {
    class ThirdPartyOauthPanel extends Control {
        options: ThirdPartyOauthPanelOptions;
        constructor(options?: ThirdPartyOauthPanelOptions);
        static getOAuthUrl(oAuthOptions: GoogleOauthOptions, userGmailEmailAddress?: string): string;
    }
    interface ThirdPartyOauthPanelOptions extends ControlOptions {
        googleOauthOptions?: GoogleOauthOptions;
        afterOAuthUrlCookieName?: string;
    }
    interface GoogleOauthOptions {
        oauthUrl?: string;
        clientId?: string;
        redirectionUrl?: string;
        scopes?: Array<string>;
    }
}
declare namespace NextAdmin.UI {
    class ChangeEmailModal extends UI.Modal {
        options: ChangeEmailModalOptions;
        constructor(options?: ChangeEmailModalOptions);
        displayStep1Error(apiResponse: NextAdmin.Models.ApiResponse): void;
    }
    interface ChangeEmailModalOptions extends NextAdmin.UI.ModalOptions {
        userClient?: NextAdmin.Services.FrontEndUserClient;
        onEmailUpdated?: (newEmai?: string) => void;
    }
}
declare namespace NextAdmin.UI {
    export class SendSupportMessageModal extends NextAdmin.UI.Modal {
        emailInput: NextAdmin.UI.Input;
        textArea: NextAdmin.UI.TextArea;
        sendMessageButton: NextAdmin.UI.Button;
        options: SendSupportMessageModalOptions;
        constructor(options: SendSupportMessageModalOptions);
    }
    interface SendSupportMessageModalOptions extends NextAdmin.UI.ModalOptions {
        commonServicesClient?: NextAdmin.Services.FrontEndServiceClient;
        email?: string;
    }
    export {};
}
declare namespace NextAdmin.UI {
    class SignInModal extends NextAdmin.UI.Modal {
        options: SignInModalOptions;
        userNameInput: NextAdmin.UI.Input;
        passwordInput: NextAdmin.UI.Input;
        rememberMeCheckbox: NextAdmin.UI.Input;
        buttonSignIn: NextAdmin.UI.Button;
        container: HTMLDivElement;
        signInMessageContainer: HTMLSpanElement;
        constructor(options: SignInModalOptions);
        tryLogUser(): Promise<void>;
    }
    interface SignInModalOptions extends NextAdmin.UI.ModalOptions {
        userClient?: NextAdmin.Services.UserClient;
        recoverPasswordModalFactory?: (options?: RecoverPasswordModalOptions) => RecoverPasswordModal;
        signUpAction?: () => void;
        onSignIn?: (authTokenResponse?: NextAdmin.Models.AuthTokenResponse) => void;
        googleOauthOptions?: GoogleOauthOptions;
    }
}
declare namespace NextAdmin.UI {
    class SignUpModal extends NextAdmin.UI.Modal {
        options: SignUpModalOptions;
        container: HTMLDivElement;
        step1Container: HTMLDivElement;
        step2Container: HTMLDivElement;
        emailInput: NextAdmin.UI.Input;
        passwordInput: NextAdmin.UI.Input;
        confirmationCodeInput: NextAdmin.UI.Input;
        verifyEmailButton: NextAdmin.UI.Button;
        stepOneErrorContainer: HTMLDivElement;
        confirmCodeButton: NextAdmin.UI.Button;
        signInContainer: HTMLDivElement;
        constructor(options: SignUpModalOptions);
        getSignUpErrorMessage(apiResponse: NextAdmin.Models.ApiResponse<string>): string;
        getSignUpData(): NextAdmin.Models.SignUpUserArgs;
        getRequiredFormControls(): Array<NextAdmin.UI.FormControl>;
    }
    interface SignUpModalOptions extends NextAdmin.UI.ModalOptions {
        userClient?: NextAdmin.Services.FrontEndUserClient;
        onSignUp?: (userName?: string, password?: string) => void;
        signInAction?: () => void;
        googleOauthOptions?: GoogleOauthOptions;
    }
}
declare namespace NextAdmin.UI {
    class FrontPage extends UI.Page {
        options: FrontPageOptions;
        static style: string;
        constructor(options?: FrontPageOptions);
        appendContainer(options?: FrontPageContaineOptions, configAction?: (container: HTMLDivElement) => void): HTMLDivElement;
    }
    interface FrontPageOptions extends PageOptions {
    }
    interface FrontPageContaineOptions {
        hasPadding?: boolean;
        maxWidth?: string;
    }
}
