
/// <reference path="Control.ts"/>

namespace NextAdmin.UI {

    export class Collapsible extends Control {

        header: HTMLDivElement;

        title: HTMLElement;

        caret: HTMLElement;

        collapsableContainer: HTMLDivElement;

        body: HTMLDivElement;

        options: CollapsibleOptions;

        onOpen = new NextAdmin.EventHandlerBase();

        onClose = new NextAdmin.EventHandlerBase();

        private _isOpen = false;

        private _isAnimating = false;

        public static style = `

        .next-admin-collapsible-header {
            color:#444;
            font-size:14px;
        }

        .next-admin-collapsible-header:hover {
            color:#666;
        }

        `;


        public constructor(options?: CollapsibleOptions) {
            super('div', options);

            NextAdmin.Style.append('NextAdmin.UI.Collapsible', Collapsible.style)

            this.header = this.element.appendHTML('div', (header) => {

                header.style.cursor = 'pointer';
                header.classList.add('next-admin-collapsible-header');
                this.title = header.appendHTML('span', (titleContainer) => {
                    titleContainer.innerHTML = this.options.title ?? '';
                });
                this.caret = header.appendHTML('span', (dropDownIconContainer) => {
                    dropDownIconContainer.style.cssFloat = 'right';
                    dropDownIconContainer.innerHTML = NextAdmin.Resources.iconCaretDown;
                });

                header.addEventListener('click', () => {
                    this.toggle();
                });
            });

            this.collapsableContainer = this.element.appendHTML('div', (collapsableContainer) => {

                this.body = collapsableContainer.appendHTML('div', (body) => {
                    body.style.paddingTop = '10px';
                    if (this.options.content) {
                        this.setContent(this.options.content);
                    }
                });
                collapsableContainer.style.transition = '0.3s';
                collapsableContainer.style.height = '0px';
                collapsableContainer.style.overflow = 'auto';
                if (UserAgent.isDesktop()) {
                    collapsableContainer.appendPerfectScrollbar();
                }
            });
            if (this.options.isOpen) {
                this.open(false);
            }
        }

        async toggle() {
            if (!this._isOpen) {
                await this.open();
            }
            else {
                await this.close();
            }
        }

        async open(animate = true) {
            if (this._isOpen || this._isAnimating) {
                return;
            }
            this._isAnimating = true;
            this.collapsableContainer.style.height = this.body.clientHeight + 'px';
            this.caret.innerHTML = NextAdmin.Resources.iconCaretLeft;

            //2023-12-10:Big hack to solve chrome bug, that cause blanck inputs inside container, so we force the rerender...
            this.collapsableContainer.style.width = '95%';
            if (animate) {
                await NextAdmin.Timer.sleep(20);
                this.collapsableContainer.style.width = '100%';
                await NextAdmin.Timer.sleep(280);
            }

            this.collapsableContainer.style.height = 'unset';
            this.collapsableContainer.style.overflow = '';
            this._isOpen = true;
            this._isAnimating = false;
            this.onOpen.dispatch();
        }

        async close() {
            if (!this._isOpen || this._isAnimating) {
                return;
            }
            this._isAnimating = true;
            this.collapsableContainer.style.height = this.collapsableContainer.clientHeight + 'px';
            this.caret.innerHTML = NextAdmin.Resources.iconCaretDown;

            await NextAdmin.Timer.sleep(20);

            this.collapsableContainer.style.height = '0px';
            this.collapsableContainer.style.overflow = 'auto';

            await NextAdmin.Timer.sleep(280);

            this._isOpen = false;
            this._isAnimating = false;
            this.onClose.dispatch();
        }

        public setContent(content?: string | Control | HTMLElement) {
            if (content == null) {
                this.body.innerHTML = '';
            }
            else if (content instanceof Control) {
                this.body.appendControl(content as Control);
            }
            else if (typeof content === 'string') {
                this.body.innerHTML = content;
            }
            else {
                this.body.appendChild(content as HTMLElement);
            }
        }

    }


    export interface CollapsibleOptions extends ControlOptions {

        title?: string;

        content?: string | Control | HTMLElement;

        isOpen?: boolean;

    }
}