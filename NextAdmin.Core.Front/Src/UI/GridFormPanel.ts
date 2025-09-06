/// <reference path="Panel.ts"/>

namespace NextAdmin.UI {

    export class GridFormPanel<T> extends Control {


        options: GridFormPanelOptions;

        grid: DataGrid<T>;

        formPanel: FormPanel;

        public static style = `

        .next-admin-grid-form{
            display:flex;
            flex-direction:row;
            min-height:300px;
            width:100%;

            .next-admin-grid-form-left-container{
                width:50%;
                min-width:50%;
                max-width:50%;
                min-height:100%;
                padding-right:15px;
            }

            .next-admin-grid-form-right-container{
                flex-grow:1;
                min-height:100%;
                padding-left:15px;
            }
        }

        @media screen and (min-width: 1600px) {
            .next-admin-grid-form{
                .next-admin-grid-form-left-container{
                    width:800px;
                    min-width:800px;
                    max-width:800px;
                }
            }
        }

        `;

        constructor(options?: GridFormPanelOptions) {
            super('div', options);


            NextAdmin.Style.append('NextAdmin.UI.GridFormPanel', GridFormPanel.style);
            this.element.classList.add('next-admin-grid-form');

            this.element.style.display = 'flex';
            this.element.style.flexDirection = 'row';

            this.element.appendHTML('div', (leftContainer) => {
                leftContainer.classList.add('next-admin-grid-form-left-container');

                this.grid = leftContainer.appendControl(new NextAdmin.UI.DataGrid_({
                    style: NextAdmin.UI.TableStyle.card,
                    openAction: null,
                    hasActionMenu: false,
                    canExport: false,
                    canPrint: false,
                    stretchHeight: false,
                    rowSelectionMode: NextAdmin.UI.RowSelectionMode.singleSelect,
                    rowHoverable: true,
                    addAction: async () => {
                        let data = {};
                        if (this.grid.options.datasetController) {
                            this.grid.startSpin();
                            let appendDataResult = await this.grid.options.datasetController.append();
                            this.grid.stopSpin();
                            if (appendDataResult?.success) {
                                data = appendDataResult.data;
                            }
                            else {
                                NextAdmin.UI.MessageBox.createOk(Resources.error, Resources.unknownError);
                                return;
                            }
                        }
                        if (this.options.onAppendDataItem) {
                            this.options.onAppendDataItem(this, data);
                        }
                        let row = this.grid.addDataItem(data, NextAdmin.Business.DataState.append);
                        this.grid.selectRow(row);
                    },
                    ...this.options.gridOptions
                }));
                this.grid.onSelectedRowsChanged.subscribe((grid, rows) => {
                    let row = rows.firstOrDefault();
                    if (row == null) {
                        return;
                    }
                    if (this.options.onSelectedDataChanged) {
                        this.options.onSelectedDataChanged(row, this.formPanel);
                    }
                    if (this.formPanel.dataController != null) {
                        this.formPanel.display();
                        this.formPanel.startSpin();
                        this.formPanel.dataController.load(row.data[this.formPanel.dataController.options.dataPrimaryKeyName], {
                            onGetResponse: () => {
                                this.formPanel.stopSpin();
                            }
                        })
                    }
                });
                this.grid.onRowAdded.subscribe((sender, row) => {
                    setTimeout(() => {
                        if (this.grid.getSelectedDataRows().length == 0) {
                            this.grid.selectRow(row);
                        }
                    }, 20);
                });
                this.grid.onDatasetChanged.subscribe((sender, items) => {
                    if (!items?.length) {
                        this.formPanel.hide();
                    }
                });

            });

            this.element.appendHTML('div', (rightContainer) => {
                rightContainer.classList.add('next-admin-grid-form-right-container');
                this.formPanel = rightContainer.appendControl(new NextAdmin.UI.FormPanel({
                    style: NextAdmin.UI.PanelStyle.noBorder,
                    ...this.options.formPanelOption
                }));
                if (this.formPanel.dataController) {
                    this.formPanel.dataController.onDataDeleted.subscribe((sender, result) => {
                        if (this.grid.datasetController) {
                            this.grid.load({ tryPreserveSelectionAndScroll: true });
                        }
                    });
                    this.formPanel.dataController.onDataSaved.subscribe((sender, result) => {
                        if (result.success && this.grid.datasetController) {
                            this.grid.load({ tryPreserveSelectionAndScroll: true });
                        }
                    });
                }
                this.formPanel.hide();
            });
            if (this.grid.noDataMessageContainer) {
                this.element.appendChild(this.grid.noDataMessageContainer);
            }
        }
    }

    export interface GridFormPanelOptions extends ControlOptions {


        gridOptions?: DataGridOptions_;

        formPanelOption?: FormPanelOptions;

        onSelectedDataChanged?: (row: DataGridRow_, panel: FormPanel) => void;

        onAppendDataItem?: (sender: GridFormPanel_, data: any) => void;

    }


    export class GridFormPanel_ extends GridFormPanel<any> {





    }

}