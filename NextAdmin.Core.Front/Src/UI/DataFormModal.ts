/// <reference path="Modal.ts"/>

namespace NextAdmin.UI {


    export class DataFormModal<T> extends Modal implements IForm {

        rightFooterToolBar: Toolbar;

        footerCloseButton: Button;

        saveButton: Button;

        deleteButton: Button;

        cancelButton: Button;

        validateButton: NextAdmin.UI.Button;

        options: DataFormModalOptions;

        dataController: NextAdmin.Business.DataController<T>;

        onValidate = new EventHandler<DataFormModal<T>, T>();

        onEndOpen = new EventHandler<DataFormModal<T>, T>();

        originalData?: T;

        public static Style = `
            .next-admin-modal-modern{
                .next-admin-modal-body{

                }
            }    
        `;

        public static onCreated = new EventHandler<DataFormModal_, DataFormModalOptions>();

        public static formModalByDataNameFactory?: (dataName: string, options?: DataFormModalOptions) => DataFormModal_;

        public static createUnique<TFormModal extends DataFormModal_>(className: string, options?: DataFormModalOptions): TFormModal {
            let formModal: TFormModal;
            eval('formModal = new ' + className + '(options)');
            if (formModal == null) {
                console.log('Unable to instanciate FormModal : ' + className);
                return null;
            }
            return DataFormModal.getUnique(formModal, options?.dataPrimaryKey);
        }
        public static createUniqueByDataName<TFormModal extends DataFormModal_>(dataName: string, options?: DataFormModalOptions): TFormModal {
            let formModal = DataFormModal.formModalByDataNameFactory(dataName, options) as TFormModal;
            if (formModal == null) {
                console.log('Unable to instanciate FormModal for data : ' + dataName);
                return null;
            }
            return DataFormModal.getUnique(formModal, options?.dataPrimaryKey);
        }

        public static getUnique<TFormModal extends DataFormModal_>(formModal: TFormModal, formModalDataPrimaryKey?: string): TFormModal {
            if (formModalDataPrimaryKey) {
                let newModalKey = formModal.computeKey(formModalDataPrimaryKey);
                let registeredModal = Modal.getRegisteredModal(newModalKey);
                if (registeredModal) {
                    formModal = registeredModal as any;
                }
            }
            return formModal;
        }

        public constructor(options: DataFormModalOptions) {
            super({
                hasBodyOverflow: true,
                hasFooterCloseButton: true,
                dataController: options.dataController == null && NextAdmin.Business.DataController_.factory ? NextAdmin.Business.DataController_.factory(options.dataName) : options.dataController,
                canSave: true,
                canDelete: true,
                canCancel: true,
                ...options
            } as DataFormModalOptions);
            Style.append('NextAdmin.UI.FormModal', DataFormModal_.Style);
            this.dataController = this.options.dataController;
            if (this.dataController == null) {
                this.options.isDetailFormModal = true;
                this.dataController = new NextAdmin.Business.LocalDataController<T>({ dataName: this.options.dataName });
            }

            this.dataController.onStartChangeData.subscribe(async (sender, args) => {
                await this.initialize(args.newData, args.newDataState);
            });
            this.dataController.onStartSaveData.subscribe(async (sender, args) => {
                await this.beforeSave(args);
            });

            if (this.options.onDataSaved && this.dataController) {
                this.dataController.onDataSaved.subscribe((sender, args) => this.options.onDataSaved(this, args));
            }
            if (this.options.onDataDeleted && this.dataController) {
                this.dataController.onDataDeleted.subscribe((sender, data) => this.options.onDataDeleted(this, data));
            }
            if (this.options.title == null) {
                this.setTitle(this.dataController.getDataDisplayName());
                this.dataController.onDataChanged.subscribe(() => {
                    this.setTitle(this.dataController.getDataDisplayName() + ' : ' + this.dataController.getDataDisplayValue());
                });
                this.dataController.onControlChanged.subscribe(() => {
                    this.setTitle(this.dataController.getDataDisplayName() + ' : ' + this.dataController.getDataDisplayValue());
                });
            }

            this.rightFooterToolBar = this.rightFooter.appendControl(new Toolbar(), (toolBar) => {
                toolBar.element.style.cssFloat = 'right';

                this.cancelButton = new Button({
                    text: Resources.refreshIcon + ' ' + Resources.cancel, action: () => {
                        this.dataController.cancel();
                    }
                });

                if (this.options.canCancel) {
                    toolBar.appendControl(this.cancelButton);
                }

                this.deleteButton = new Button({
                    text: Resources.deleteIcon + ' ' + Resources.delete,
                    style: ButtonStyle.red,
                    action: () => {
                        MessageBox.createYesCancel(Resources.formDeleteMessageTitle, Resources.formDeleteMessage, async () => {
                            this.startSpin();
                            let result = await this.dataController.delete();
                            this.stopSpin();
                            if (result.success) {
                                this.close({ chackDataState: false });
                            }
                        });
                    }
                });

                if (this.options.canDelete) {
                    toolBar.appendControl(this.deleteButton);
                }

                this.saveButton = new Button({
                    text: Resources.saveIcon + ' ' + Resources.save,
                    style: ButtonStyle.green,
                    action: () => {
                        this.dataController.save();
                    }
                })
                if (this.options.canSave) {
                    toolBar.appendControl(this.saveButton);
                }


                if (this.options.hasFooterCloseButton) {
                    toolBar.appendControl(this.footerCloseButton = new Button({
                        text: Resources.closeIcon + ' ' + Resources.close,
                        action: () => {
                            this.close({ chackDataState: true });
                        }
                    }));
                }
            });
            this.dataController.bindToForm(this);
            this.dataController.onDataChanged.subscribe((sender, args) => {
                this._key = this.computeKey(args.newData[this.dataController.options.dataPrimaryKeyName]);
                if (UserAgent.isMobile()) {
                    setTimeout(() => {
                        if (document.activeElement) {
                            (document.activeElement as HTMLElement).blur();
                            if (args.previousData == null || Object.keys(args.previousData).length === 1) {
                                this.body.scrollTo(0, 0);
                            }

                        }
                    }, 10);
                }

            });


            if (this.options.isDetailFormModal) {
                this.saveButton.element.remove();
                this.deleteButton.element.remove();
                //this.cancelButton.element.remove();
                if (this.footerCloseButton) {
                    this.footerCloseButton.element.remove();
                }


                this.validateButton = this.rightFooterToolBar.appendControl(new NextAdmin.UI.Button({
                    text: NextAdmin.Resources.checkIcon + ' ' + NextAdmin.Resources.validate,
                    css: { cssFloat: 'right' },
                    action: () => {
                        this.validate();
                    }
                }));

                this.dataController.onDataStateChanged.subscribe((sender, args) => {
                    if (args.newState == NextAdmin.Business.DataState.append || args.newState == NextAdmin.Business.DataState.edited) {
                        this.validateButton.enable();
                    }
                    else if (args.newState == NextAdmin.Business.DataState.serialized) {
                        this.validateButton.disable();
                    }
                });
            }

            DataFormModal_.onCreated.dispatch(this, this.options);
        }

        public async validate(): Promise<boolean> {
            this.onValidate.dispatch(this, this.dataController.data);
            this.close();
            return true;
        }


        public computeKey(dataPrimaryKey: any): string {
            if (dataPrimaryKey == null) {
                return null;
            }
            return this['constructor'].name + '_' + this.dataController.options.dataName + '_' + dataPrimaryKey;
        }

        public getKey() {
            return this.computeKey(this.dataController.getDataPrimaryKeyValue());
        }

        public async open(openArgs?: FormModalOpenArgs<T>) {
            let isAlreadyRegistered = this.isRegistered();
            super.open(openArgs);
            if (!isAlreadyRegistered && openArgs != null) {
                if (this.options.isDetailFormModal && openArgs.data == null && !openArgs.appendNewData) {
                    throw new Error("Form modal used as detail form modal require data");
                }
                this.startSpin();
                if (openArgs.data != null) {
                    this.originalData = openArgs.data;
                    await this.dataController.setData(Copy.clone(openArgs.data), openArgs.dataState);
                }
                else if (openArgs.dataPrimaryKey != null) {
                    await this.dataController.load(openArgs.dataPrimaryKey, {
                        onGetResponse: (result) => {
                            if (result.success && openArgs?.onDataLoaded) {
                                openArgs.onDataLoaded(result.data);
                            }
                        }
                    });
                }
                else if (openArgs.appendNewData) {
                    await this.dataController.append({
                        onGetResponse: (result) => {
                            if (result.success && openArgs?.onDataLoaded) {
                                openArgs.onDataLoaded(result.data);
                            }
                        }
                    });
                }
                this.stopSpin();
                this.onEndOpen.dispatch(this, this.dataController.data);
            }

        }

        protected async initialize(data: T, dataState?: Business.DataState) {
            if (this.options.onInitialize) {
                this.options.onInitialize(this, {
                    data: data,
                    dataState: dataState
                });
            }
        }

        protected async beforeSave(args?: Business.SaveDataEventArgs) {


        }

        public close(args?: CloseFormModalArgs) {
            args = {
                chackDataState: !this.options.isDetailFormModal,
                ...args
            };
            if (args.chackDataState) {
                this.dataController.askUserToSaveDataIfNeededAndExecuteAction(() => {
                    super.close(args);
                });
            }
            else {
                super.close(args);
            }
        }


        enableReadOnly() {


        }

        disableReadOnly() {


        }

        public getData(): T {
            return this.dataController.data;
        }

        public getPropertyName(dataDefPropertyAction: (dataDef: T) => any): string {
            return this.dataController.getPropertyName(dataDefPropertyAction);
        }

    }

    export class DataFormModal_ extends DataFormModal<any> {


    }

    export interface DataFormModalOptions extends ModalOptions, FormOptions {

        dataName?: string;

        dataPrimaryKey?: any;

        isDetailFormModal?: boolean;

        hasFooterCloseButton?: boolean;

        canSave?: boolean;

        canDelete?: boolean;

        canCancel?: boolean;

        onDataSaved?: (sender: DataFormModal_, args: NextAdmin.Business.SaveDataResult) => void;

        onDataDeleted?: (sender: DataFormModal_, data: any) => void;

        onInitialize?: (sender: DataFormModal_, args: InitializeArgs) => void;

    }


    export interface FormModalOpenArgs<T> {

        data?: T;

        dataState?: NextAdmin.Business.DataState;

        dataPrimaryKey?: any;

        appendNewData?: boolean;

        onDataLoaded?: (data: T) => void;

    }

    export interface FormModalOpenArgs_ extends FormModalOpenArgs<any> {


    }

    export interface CloseFormModalArgs extends CloseModalArgs {

        chackDataState?: boolean;

    }


    export interface InitializeArgs {

        data: any;

        dataState: Business.DataState;

    }
}

