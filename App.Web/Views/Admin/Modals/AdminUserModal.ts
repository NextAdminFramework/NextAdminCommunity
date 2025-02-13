class AdminUserModal extends NextAdmin.UI.DataFormModal<Models.AdminUser> {


    constructor(option?: NextAdmin.UI.DataFormModalOptions) {
        super({
            size: NextAdmin.UI.ModalSize.smallFitContent,
            canMoveAndResize: true,
            canMinimize: true,
            dataName: EntityNames.AdminUser,
            ...option
        });

        this.body.appendControl(new NextAdmin.UI.FormLayout({ dataController: this.dataController }), (formLayout) => {

            formLayout.addItem({
                col: 1, row: 1, colSpan: 2,
                propertyName: this.getPropertyName(a => a.userName),
                useDefaultControl: true
            });

            formLayout.addItem({
                col: 1, row: 2, colSpan: 2,
                propertyName: this.getPropertyName(a => a.password),
                control: new NextAdmin.UI.Input({ inputType: NextAdmin.UI.InputType.password })
            });

            formLayout.addItem({
                col: 1, row: 3, colSpan: 2,
                propertyName: this.getPropertyName(a => a.culture),
                control: new NextAdmin.UI.Select({
                    items: [{ value: '' },
                    { value: 'fr', label: 'FR - ' + Resources.french },
                    { value: 'en', label: 'EN - ' + Resources.english }
                    ]
                })
            });

            formLayout.addItem({
                col: 1, row: 4, colSpan: 1,
                propertyName: this.getPropertyName(a => a.disabled),
                labelWidth: '50%',
                useDefaultControl: true
            });

            formLayout.addItem({
                col: 2, row: 4, colSpan: 1,
                propertyName: this.getPropertyName(a => a.isSuperAdmin),
                labelWidth: '50%',
                control: new NextAdmin.UI.Input({
                    inputType: NextAdmin.UI.InputType.checkbox,
                    disabled: true
                }),
            });

        });
    }

    async initialize(data: Models.AdminUser, dataState: NextAdmin.Business.DataState) {
        await super.initialize(data, dataState);
        if (data.isSuperAdmin) {
            this.dataController.getControl(a => a.disabled).disable();
            if (!AdminApp.isSuperAdmin()) {
                this.dataController.getControl(a => a.userName).disable();
                this.dataController.getControl(a => a.password).disable();
                this.dataController.getControl(a => a.culture).disable();
            }
        }
    }


}
