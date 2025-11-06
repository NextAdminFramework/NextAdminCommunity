namespace NextAdmin.UI {

    export class NoUiModal extends NextAdmin.UI.Modal {

        options: noUiModalOptions;

        public static style = `

        .next-admin-no-ui-modal-container{

            .next-admin-modal{
                background:unset;
                box-shadow:unset;
                .next-admin-modal-header{
                    color:#fff;
                    font-weight:bold;
                    border:0px;
                    .next-admin-modal-btn-close{
                        font-size:32px
                    }
                }
                .next-admin-modal-body{
                    background:unset;
                }
                .next-admin-modal-footer{
                    color:#fff;
                    font-weight:bold;
                    border:0px;
                }
            }
        }
        `;

        constructor(options: noUiModalOptions) {
            super({
                size: NextAdmin.UI.ModalSize.ultraLarge,
                style: ModalStyle.default,
                canMoveAndResize: false,
                canChangeScreenMode: false,
                canMinimize: false,
                closeOnClickOutside: true,
                backdropColor: 'rgba(0,0,0,0.25)',
                ...options,
            } as noUiModalOptions);
            this.buttonClose.innerHTML = Resources.closeIcon;
            Style.append('NextAdmin.UI.NoUiModal', NoUiModal.style);
            this.element.classList.add('next-admin-no-ui-modal-container');
        }
    }

    export interface noUiModalOptions extends ModalOptions {



    }

}