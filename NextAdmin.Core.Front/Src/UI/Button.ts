﻿
/// <reference path="Control.ts"/>
/// <reference path="DefaultStyle.ts"/>

namespace NextAdmin.UI {

    export class Button extends Control implements IActionControl {

        public element: HTMLButtonElement;

        public options: ButtonOptions;

        action: (btn: Button, event?: MouseEvent) => void;

        public static onCreated = new EventHandler<Button, ButtonOptions>();

        public onActionExecuting = new EventHandler<Button, any>();

        public onActionExecuted = new EventHandler<Button, any>();



        public static style = ".next-admin-btn {border:1px solid #ccc;font-weight:bold;cursor:pointer;box-sizing:border-box;white-space:nowrap;text-overflow: ellipsis;border-radius:5px;transition:0.2s}"

            + '.next-admin-btn-extra-small{height:12.5px;font-size:10px;padding:0px;}'
            + ".next-admin-btn-small{height:24px;font-size:10px;padding-left:2px;padding-right:2px}"
            + ".next-admin-btn-medium{height:34px;font-size:14px;font-weight:500;padding-left:5px;padding-right:5px}"
            + ".next-admin-btn-large{height:44px;font-size:18px;padding-left:7px;padding-right:7px}"


            + ".next-admin-btn-default{background:#FFF;color:#444;}.next-admin-btn-default:hover,.next-admin-btn-white.next-admin-btn-pressed{background:#f0f0f0;box-shadow:inset 0px 0px 2px #444}"
            + ".next-admin-btn-red{background:#FFF;color:" + DefaultStyle.RedOne + ";}.next-admin-btn-red:hover,.next-admin-btn-red.next-admin-btn-pressed{background:#f0f0f0;box-shadow:inset 0px 0px 2px #444}"
            + ".next-admin-btn-green{background:#FFF;color:" + DefaultStyle.GreenOne + ";}.next-admin-btn-green:hover,.next-admin-btn-green.next-admin-btn-pressed{background:#f0f0f0;box-shadow:inset 0px 0px 2px #444}"
            + ".next-admin-btn-blue{background:#FFF;color:" + DefaultStyle.BlueOne + ";}.next-admin-btn-blue:hover,.next-admin-btn-blue.next-admin-btn-pressed{background:#f0f0f0;box-shadow:inset 0px 0px 2px #444}"
            + ".next-admin-btn-light-blue{background:#FFF;color:#0d6efd;}.next-admin-btn-blue:hover,.next-admin-btn-blue.next-admin-btn-pressed{background:#f0f0f0;box-shadow:inset 0px 0px 2px #444}"

            + ".next-admin-btn-bg-blue{background:#0d6efd;color:#f0f0f0;}.next-admin-btn-bg-blue:hover,.next-admin-btn-bg-blue.next-admin-btn-pressed{background:#0b5ed7;box-shadow:inset 0px 0px 2px #444}"
            + ".next-admin-btn-bg-white{background:#FFF;color:#444;}.next-admin-btn-bg-white:hover,.next-admin-btn-bg-white.next-admin-btn-pressed{background:#f0f0f0;box-shadow:inset 0px 0px 2px #444}"
            + ".next-admin-btn-bg-light-grey{background:#f0f0f0;color:#444;}.next-admin-btn-bg-light-grey:hover,.next-admin-btn-bg-light-grey.next-admin-btn-pressed{background:#fff;box-shadow:inset 0px 0px 2px #444}"
            + ".next-admin-btn-bg-grey{background:#87939f;color:#fff;}.next-admin-btn-bg-grey:hover,.next-admin-btn-bg-grey.next-admin-btn-pressed{background:#929da8;box-shadow:inset 0px 0px 2px #444}"
            + ".next-admin-btn-bg-green{background:#8EDA2F;color:#fff;}.next-admin-btn-bg-green:hover,.next-admin-btn-bg-green.next-admin-btn-pressed{background:#446D11;box-shadow:inset 0px 0px 2px #444}"
            + ".next-admin-btn-bg-red{background:#E32D2D;color:#fff;}.next-admin-btn-bg-red:hover,.next-admin-btn-bg-red.next-admin-btn-pressed{background:#FF1414;box-shadow:inset 0px 0px 4px #444}"
            + ".next-admin-btn-bg-black{background:#3A3A3A;color:#fff;}.next-admin-btn-bg-black:hover,.next-admin-btn-bg-black.next-admin-btn-pressed{background:#151515;box-shadow:inset 0px 0px 4px #444}"
            + ".next-admin-btn-no-bg{background:rgba(255,255,255,0);color:#000; border:0px}.next-admin-btn-no-bg:hover,.next-admin-btn-no-bg.next-admin-btn-pressed{color:#105ABE;text-decoration: underline;border:0px!important;}"
            + ".next-admin-btn-no-bg-white{background:rgba(255,255,255,0);color:#fff; border:0px}.next-admin-btn-no-bg-white:hover,.next-admin-btn-no-bg-white.next-admin-btn-pressed{color:#f0f0f0;text-decoration: underline;border:0px!important;}"
            + ".next-admin-btn-no-bg-blue{background:rgba(255,255,255,0);color:#0d6efd; border:0px}.next-admin-btn-no-bg-blue:hover,.next-admin-btn-no-blue-bg.next-admin-btn-pressed{color:#053b8a;text-decoration: underline;border:0px!important;}"
            + ".next-admin-btn-no-bg-dark-blue{background:rgba(255,255,255,0);color:" + DefaultStyle.BlueTwo + "; border:0px}.next-admin-btn-no-bg-dark-blue:hover,.next-admin-btn-no-bg.next-admin-btn-pressed{color:#053b8a;text-decoration: underline;border:0px!important;}"
            + ".next-admin-btn-no-bg-red{background:rgba(255,255,255,0);color:" + DefaultStyle.RedOne + "; border:0px}.next-admin-btn-no-bg-red:hover,.next-admin-btn-no-bg.next-admin-btn-pressed{color:#053b8a;text-decoration: underline;border:0px!important;}";

        //next-admin-btn-no-bg-red

        public constructor(options?: ButtonOptions) {
            super(options?.htmlTag ?? 'button', {
                stopClickEventPropagation: true,
                style: ButtonStyle.default, ...options
            } as ButtonOptions);
            Style.append("Button", Button.style);

            this.action = this.options.action;
            this.element.classList.add('next-admin-btn');

            if (this.options.text != null) {
                this.element.innerHTML = this.options.text;
            }
            if (this.options.popover) {
                this.element.setPopover(this.options.popover);
            }

            this.setColorStyle(this.options.style);

            switch (this.options.size) {

                case ButtonSize.extraSmall:
                    this.element.classList.add('next-admin-btn-extra-small');
                    break;
                case ButtonSize.small:
                    this.element.classList.add('next-admin-btn-small');
                    break;
                default:
                case ButtonSize.medium:
                    this.element.classList.add('next-admin-btn-medium');
                    break;

                case ButtonSize.large:
                    this.element.classList.add('next-admin-btn-large');
                    break;
            }


            this.element.addEventListener('click', (event) => {
                if (this.options.stopClickEventPropagation) {
                    event.stopPropagation();
                }
                if (!this._isPressed && this.isEnable()) {
                    this.executeAction();
                }
            });
            Button.onCreated.dispatch(this, this.options);
        }

        private _currentStyle = null;
        public setColorStyle(style: ButtonStyle) {
            if (this._currentStyle == style) {
                return;
            }
            if (this._currentStyle != null) {
                this.element.classList.remove(Button.getColorStyleClass(this._currentStyle));
            }
            this._currentStyle = style;
            this.element.classList.add(Button.getColorStyleClass(style));
        }

        public getColorStyle(): ButtonStyle {
            return this._currentStyle;
        }


        public static getColorStyleClass(style: ButtonStyle) {

            switch (style) {

                case ButtonStyle.default:
                    return 'next-admin-btn-default';
                case ButtonStyle.blue:
                    return 'next-admin-btn-blue';
                case ButtonStyle.lightBlue:
                    return 'next-admin-btn-light-blue';
                case ButtonStyle.green:
                    return 'next-admin-btn-green';
                case ButtonStyle.red:
                    return 'next-admin-btn-red';

                case ButtonStyle.bgWhite:
                    return 'next-admin-btn-bg-white';
                case ButtonStyle.bgLightGrey:
                    return 'next-admin-btn-bg-light-grey';
                case ButtonStyle.bgGrey:
                    return 'next-admin-btn-bg-grey';
                case ButtonStyle.bgBlack:
                    return 'next-admin-btn-bg-black';
                case ButtonStyle.bgBlue:
                    return 'next-admin-btn-bg-blue';
                case ButtonStyle.bgGreen:
                    return 'next-admin-btn-bg-green';
                case ButtonStyle.bgRed:
                    return 'next-admin-btn-bg-red';
                case ButtonStyle.noBg:
                    return 'next-admin-btn-no-bg';
                case ButtonStyle.noBgWhite:
                    return 'next-admin-btn-no-bg-white';
                case ButtonStyle.noBgDarkBlue:
                    return 'next-admin-btn-no-bg-dark-blue';
                case ButtonStyle.noBgBlue:
                    return 'next-admin-btn-no-bg-blue';
                case ButtonStyle.noBgRed:
                    return 'next-admin-btn-no-bg-red';
            }

        }


        private _isPressed = false;

        public press(disbaleClick = true) {
            this._isPressed = disbaleClick;
            this.element.classList.add('next-admin-btn-pressed');

        }

        public release() {
            this._isPressed = false;
            this.element.classList.remove('next-admin-btn-pressed');
        }



        public executeAction(event?: MouseEvent) {
            this.onActionExecuting.dispatch(this, this.action);
            if (this.action != null) {
                this.action(this, event);
            }
            this.onActionExecuted.dispatch(this, this.action);
        }

        setText(text: string): Button {
            this.element.innerHTML = text;
            return this;
        }

        getText(): string {
            return this.element.innerHTML;
        }


        public startSpin(): { spinnerContainer: HTMLDivElement, spinner: HTMLImageElement } {
            return this.element.startSpin('rgba(255,255,255,0.5)', 20);
        }

        public stopSpin() {
            this.element.stopSpin();
        }


    }


    export interface ButtonOptions extends ControlOptions {

        text?: string;

        action?: (btn: Button, event?: MouseEvent) => void;

        size?: ButtonSize;

        style?: ButtonStyle;

        stopClickEventPropagation?: boolean;//used to disabled form submite

        popover?: string;

        htmlTag?: string;

    }



    export enum ButtonStyle {
        default,
        lightBlue,
        blue,
        green,
        red,
        bgWhite,
        bgLightGrey,
        bgGrey,
        bgBlack,
        bgBlue,
        bgGreen,
        bgRed,
        noBg,
        noBgWhite,
        noBgBlue,
        noBgDarkBlue,
        noBgRed,
    }


    export enum ButtonSize {
        extraSmall,
        small,
        medium,
        large,
    }



}

