
/// <reference path="StretchLayout.ts" />

namespace NextAdmin.UI {

    export class Panel extends StretchLayout {

        public options: PanelOptions;

        public leftHeader: HTMLTableCellElement;

        public rightHeader: HTMLTableCellElement;

        public header: HTMLDivElement;

        public body: HTMLDivElement;

        public footer: HTMLDivElement;

        public static style = `
        .next-admin-panel-body {
            border:1px solid #ccc;
            background:#FFF;
        }
        .next-admin-panel-header {
            background:#FEFEFC;
            border-top:1px solid #ccc;
            border-left:1px solid #ccc;
            border-right:1px solid #ccc;
            min-height:25px;
            padding:5px;
            border-top-left-radius:5px;
            border-top-right-radius:5px;
            font-size:16px;
            color:#444;
            font-weight:500;

        }
        .next-admin-panel-footer {
            background:#FEFEFC;
            border-bottom:1px solid #ccc;
            border-left:1px solid #ccc;
            border-right:1px solid #ccc;
            min-height:25px;padding:5px;
            border-bottom-left-radius:5px;
            border-bottom-right-radius:5px
        }
        .next-admin-left-panel-header{
            padding:5px;
        }
        .next-admin-right-panel-header{
            padding:5px;
        }
        .next-admin-panel-no-border{
            .next-admin-panel-body {
                border:0px;
            }
            .next-admin-panel-header {
                border:0px;
            }
            .next-admin-panel-footer {
                border:0px;
            }
        }

        `;

        public static onCreated = new EventHandler<Panel, PanelOptions>();

        constructor(options?: PanelOptions) {
            super({
                hasHeader:true,
                ...options
            } as PanelOptions);

            Style.append('Panel', Panel.style);
            this.header = this.fixedContainer;
            this.body = this.stretchContainer;

            this.element.classList.add('next-admin-panel');
            this.fixedContainer.classList.add('next-admin-panel-header');
            this.stretchContainer.classList.add('next-admin-panel-body');
            this.footer = this.element.appendHTML('div');
            this.footer.classList.add('next-admin-panel-footer');
            if (!this.options.hasHeader) {
                this.header.style.display = 'none';
            }
            if (!this.options.hasFooter) {
                this.footer.style.display = 'none';
            }

            this.fixedContainer.appendHTML('table', (table) => {
                table.style.borderSpacing = '0px';
                table.style.width = '100%';
                table.appendHTML('tr', (tr) => {
                    this.leftHeader = tr.appendHTML('td');
                    this.leftHeader.classList.add('next-admin-left-panel-header');
                    this.rightHeader = tr.appendHTML('td');
                    this.rightHeader.classList.add('next-admin-right-panel-header');
                });
            });

            this.setStyle(this.options.style);

            Panel.onCreated.dispatch(this, this.options);
        }


        setStyle(style?: PanelStyle) {

            switch (style) {
                case PanelStyle.noBorder:
                    this.element.classList.add('next-admin-panel-no-border');
                    break;
                default:
                case PanelStyle.default:
                    break;
            }

        }


    }

    export interface PanelOptions extends StretchLayoutOptions {

        hasFooter?: boolean;

        hasHeader?: boolean;

        style?: PanelStyle;

    }

    export enum PanelStyle {
        default,
        noBorder
    }

}