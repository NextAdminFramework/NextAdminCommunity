
/// <reference path="FrontEndResourcesEn.ts"/>

namespace NextAdmin {

    export class FrontEndResourcesFr extends FrontEndResourcesEn {

        contact = 'Contact';

        send = 'Envoyer';

        messageSentTitle = 'Message envoyé';

        messageSentText = 'Votre message a bien été envoyé, nous vous répondrons dans les plus brefs délais.';

        display = 'Afficher';
    }
    export var FrontEndResources: FrontEndResourcesEn;
    try {
        FrontEndResources = navigator?.language?.startsWith('fr') ? new FrontEndResourcesFr() : new FrontEndResourcesEn();
    }
    catch
    {

    }
}