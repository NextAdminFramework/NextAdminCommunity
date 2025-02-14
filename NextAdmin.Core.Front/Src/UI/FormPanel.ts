/// <reference path="Panel.ts"/>

namespace NextAdmin.UI {

    export class FormPanel extends Panel implements IForm {

        saveButton: Button;

        deleteButton: Button;

        cancelButton: Button;

        footerToolBar: Toolbar;

        dataController: NextAdmin.Business.DataController_;

        options: FormPanelOptions;

        constructor(options?: FormPanelOptions) {
            super({
                hasFooterToolbar: true,
                hasFooter: options.hasFooterToolbar === false ? false : true,
                dataController: options.dataController == null && NextAdmin.Business.DataController_.factory != null ? NextAdmin.Business.DataController_.factory(options.dataName) : options.dataController
                , ...options
            } as FormPanelOptions);
            this.dataController = this.options.dataController;

            if (this.options.label) {
                this.leftHeader.innerHTML = this.options.label;
            }

            this.body.style.padding = '10px';
            if (this.options.hasFooterToolbar) {
                this.footer.appendControl(new NextAdmin.UI.Toolbar(), (toolbar) => {
                    toolbar.element.style.cssFloat = 'right';
                    toolbar.appendControl(this.cancelButton = new Button({
                        text: Resources.refreshIcon + ' ' + Resources.cancel,
                        action: () => {
                            if (this.dataController != null) {
                                this.dataController.cancel();
                            }
                        }
                    }));
                    this.deleteButton = new Button({ text: Resources.deleteIcon + ' ' + Resources.delete });
                    toolbar.appendControl(this.saveButton = new Button({
                        text: Resources.saveIcon + ' ' + Resources.save,
                        style: ButtonStyle.green,
                        action: () => {
                            if (this.dataController != null) {
                                this.dataController.save();
                            }
                        }
                    }));
                });
            }

            if (this.dataController != null) {
                this.dataController.bindToForm(this);
            }
        }

        enableReadOnly() {

        }

        disableReadOnly() {

        }

    }

    export interface FormPanelOptions extends FormOptions, PanelOptions {

        hasFooterToolbar?: boolean;


    }

}