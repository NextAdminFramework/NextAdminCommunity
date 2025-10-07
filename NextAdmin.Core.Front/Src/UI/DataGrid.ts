/// <reference path="FormControl.ts"/>
/// <reference path="Modal.ts"/>
/// <reference path="FormLayout.ts"/>
/// <reference path="DefaultStyle.ts"/>


namespace NextAdmin.UI {

    export class DataGrid<T> extends FormControl {


        public static defaultStyle?: TableStyle;

        columns = new Array<DataGridColumn>();

        actionColumn: DataGridColumn = null;

        rows = new Array<DataGridRow<T>>();

        rowDictionary = {};

        onRenderCell = new EventHandler<DataGridCell<T>, any>();

        onRenderRow = new EventHandler<DataGrid_, DataGridRow<T>>();

        onSelectedRowsChanged = new EventHandler<DataGrid_, DataGridRow<T>[]>();

        onRowSelected = new EventHandler<DataGrid_, DataGridRow<T>>();

        onRowUnselected = new EventHandler<DataGrid_, DataGridRow<T>>();

        onRowRemoved = new EventHandler<DataGrid_, DataGridRow<T>>();

        onRowAdded = new EventHandler<DataGrid_, DataGridRow<T>>();

        onAddingData = new EventHandler<DataGrid_, { data: any, state: Business.DataState }>();

        onRemovingData = new EventHandler<DataGrid_, { cancel?: boolean, data: any }>();

        onAddingDataset = new EventHandler<DataGrid_, Array<any>>();

        onLoading = new EventHandler<DataGrid_, Array<any>>();

        onSaving = new EventHandler<DataGrid_, Array<any>>();

        onValueChanged = new EventHandler<DataGrid_, ValueChangeEventArgs>();

        onFormModalCreated = new EventHandler<DataFormModal_, any>();

        onDatasetChanged = new EventHandler<DataGrid_, Array<any>>();

        onViewsUpdated = new EventHandler<DataGrid_, GridViewOptions[]>();

        onUpdateWhereQuery = new EventHandler<DataGrid_, Business.QueryBuilder>();

        onViewChanged = new EventHandler<DataGrid_, GridViewOptions>();

        onDoubleClickRow = new EventHandler<DataGridRow_, MouseEvent>();

        onOpenContextMenu = new EventHandler<DataGrid_, OpenContextMenuArgs>();

        onFilterValueChanged = new EventHandler<DataGrid_, { filterName?: string, filter?: FormControl, changeArgs: ValueChangeEventArgs }>();

        onColumnOrderChanged = new EventHandler<DataGridColumn, ColumnOrdering>();

        onColumnFilterSearchValueChanged = new EventHandler<DataGridColumn, string>();

        onColumnFilterSelectedValuesChanged = new EventHandler<DataGridColumn, Array<any>>();

        currentDraggingRow?: DataGridRow<T>;

        currentHovredRow?: DataGridRow<T>;

        headerRow: HTMLTableRowElement;

        tHead: HTMLTableSectionElement;

        tFoot: HTMLTableSectionElement;

        tBody: HTMLTableSectionElement;

        table: HTMLTableElement;

        tableContainer: HTMLDivElement;

        layout: FlexLayout;

        leftHeader: HTMLDivElement;

        rightHeader: HTMLDivElement;

        topBar: HTMLDivElement;

        bottomBar: HTMLDivElement;

        stretchContainer: HTMLDivElement;

        toolBar: Toolbar;

        buttonAdd: Button;

        buttonSave: Button;

        actionMenuDropDownButton: DropDownButton;

        buttonMultiDelete: Button;

        buttonRefresh: Button;

        searchBox: Input;

        viewSelect: Select;

        exportButton: Button;

        generateReportButton: DropDownButton;

        filtersContainer: HTMLDivElement;

        viewFiltersLayout: CollapsibleFilter<T>;

        options: DataGridOptions_;

        datasetController?: Business.DatasetController<T>;

        noDataMessageContainer: HTMLElement;

        emptyArea: HTMLDivElement;

        protected _masterFormController: Business.DataController_;

        protected _currentView: GridViewOptions;

        protected _foreignKeyName?: string;

        protected _suspendUpdateDataFromDataController?: boolean;

        public static onCreated = new EventHandler<DataGrid_, DataGridOptions_>();

        public static onCreating = new EventHandler<DataGrid_, DataGridOptions_>();

        public static style = `

        .next-admin-table-column-header-required{
            text-decoration:underline;
        } 
        .next-admin-table-header{
            background-color:#FEFEFC;
            padding:5px;
            border-bottom:1px solid #ccc;
        } 
        .next-admin-table-header-cell{
            z-index:1;
            position:sticky;
            top:0px;
            background-color:#FEFEFC; 
            padding:10px;
        } 
        .next-admin-table-cell{
            padding:5px;
        } 
        .next-admin-table-filter-container{

        }
        .next-admin-table-no-data-message{
            font-size:28px;
            text-align:center;
            font-weight:600px;
            color:#888;
        }

        .next-admin-drag-row-handler{
            cursor:grab;
            fontSize:20px;
            margin-left:4px;
            margin-right:4px;
            color:#888;
        }

        .next-admin-table-dragging-row{
            .next-admin-drag-row-handler{
                color:` + DefaultStyle.BlueOne + `;
            }
        }

        .next-admin-table-action-column-cell-header{
            position:sticky;
            left:0;
            z-index:2;
            background:#fff;
        }
        .next-admin-table-action-column-cell{
            position:sticky;
            left:0;
            z-index:1;
            background:#fff;
            //border-top:1px solid #ddd;
            box-shadow:0px 0px 1px rgba(0,0,0,0.5)
        }
        `;

        constructor(options?: DataGridOptions<T>) {
            super('div', {
                style: DataGrid_.defaultStyle,
                hasActionMenu: true,
                rowsBordered: false,
                synchronizeDataWithFormModal: true,
                stretchWidth: true,
                stretchHeight: true,
                datasetController: options.datasetController == null && Business.DatasetController_.factory != null ? Business.DatasetController_.factory(options.dataName) : options.datasetController,
                canDiscoverSchema: true,
                canEdit: true,
                actionColumnWidth: '100px',
                selectDataPrimaryKey: true,
                viewsDataPropertyName: 'controlName',
                viewsGridIdPropertyName: 'controlData',
                loadingMode: DataLoadingMode.query,
                displayNoDataMessage: true,
                minHeight: '200px',
                canSelectView: options?.views?.length > 1,
                enableDoubleClickOpenModal: true,
                hasHeader: true,
                hasTopBar: true,
                reorderingRowMode: DataGridReorderingRowMode.dragAndDropHandle,
                columns: [],
                reports: [],
                views: [],
                openAction: options.formModalFactory == null ? null : (row) => {
                    this.openData(row);
                },
                addAction: () => {
                    this.appendData();
                },
                deleteAction: (grid: DataGrid_, rows: Array<DataGridRow_>) => {
                    this.deleteRows(rows);
                },
                refreshAction: () => {
                    if (this.datasetController == null) {
                        return;
                    }
                    if (this.datasetController.isDataUpToDate() || (!this.options.canSave && this._masterFormController == null)) {
                        this.datasetController.load();
                    }
                    else {
                        MessageBox.createYesCancel(Resources.warning, Resources.lostDataNotSavedMessage, () => {
                            this.datasetController.load();
                        });
                    }
                },
                renderActionColumnCell: (cell) => {
                    cell.element.appendControl(this.createActionColumnCellToolbar(cell));
                },
                hasContextMenu: true,
                ...options
            } as DataGridOptions_);
            this.datasetController = this.options.datasetController;


            if (this.options.canExport == null) {
                this.options.canExport = this.datasetController != null;
            }
            if (this.options.canPrint == null) {
                this.options.canPrint = this.datasetController != null;
            }
            Style.append("NextAdmin.UI.Table", Table.style);
            Style.append("NextAdmin.UI.Grid", DataGrid_.style);

            if (this.options.hasActionColumn == undefined && ((options.deleteMode != null && options.deleteMode != DataDeleteMode.disabled) || options.formModalFactory != null || this.getRowOrderPropertyName() != null)) {
                this.options.hasActionColumn = true;
            }
            if (this.options.searchMode == null && this.options.canSave == true) {
                this.options.searchMode = DataSearchMode.disabled;
            }
            if (this.options.canAdd === undefined) {
                this.options.canAdd = options.formModalFactory != null || options.canEdit;
            }
            DataGrid_.onCreating.dispatch(this, this.options);

            this.element.style.width = this.options.stretchWidth ? '100%' : 'fit-content';
            this.layout = this.element.appendControl(new NextAdmin.UI.FlexLayout({ direction: FlexLayoutDirection.vertical }));


            this.topBar = this.layout.appendHTML('div');
            this.topBar.classList.add('next-admin-table-header');
            this.topBar.appendHTML('table', (table) => {
                table.style.borderSpacing = '0px';
                table.style.width = '100%';
                table.appendHTML('tr', (tr) => {
                    this.leftHeader = tr.appendHTML('td');
                    this.rightHeader = tr.appendHTML('td');
                });
            });
            if (!this.options.hasTopBar) {
                this.topBar.style.display = 'none';
            }

            this.stretchContainer = this.layout.appendHTMLStretch('div');
            this.stretchContainer.style.position = 'relative';

            this.bottomBar = this.layout.appendHTML('div');

            this.tableContainer = this.stretchContainer.appendHTML('div');
            this.tableContainer.style.width = this.options.stretchWidth ? '100%' : 'fit-content';
            this.tableContainer.style.display = 'flex';
            this.tableContainer.style.flexDirection = 'column';

            if (this.options.stretchHeight) {
                this.element.style.height = '100%';
                this.tableContainer.style.position = 'absolute';
                this.tableContainer.style.height = '100%';
                this.tableContainer.style.left = '0px';
                this.tableContainer.style.top = '0px';
                this.tableContainer.style.overflow = 'auto';
                /*
                if (UserAgent.isDesktop()) {
                    this.tableContainer.appendPerfectScrollbar();
                }*/
            }

            this.table = this.tableContainer.appendHTML('table');
            this.table.classList.add('next-admin-table');
            this.table.classList.add('next-admin-table');
            if (this.options.stretchWidth) {
                this.table.style.width = '100%';
            }
            this.tHead = document.createElement('thead');
            this.tHead.classList.add('next-admin-table-thead');
            this.table.appendChild(this.tHead);
            if (!this.options.hasHeader) {
                this.tHead.style.visibility = 'collapse';
            }

            this.headerRow = document.createElement('tr');
            this.headerRow.classList.add('next-admin-table-thead-row');
            this.tHead.appendChild(this.headerRow);

            this.tBody = document.createElement('tbody');
            this.table.appendChild(this.tBody);

            this.tFoot = document.createElement('tfoot');
            this.table.appendChild(this.tFoot);

            this.emptyArea = this.tableContainer.appendHTML('div', (emptyArea) => {
                emptyArea.style.flexGrow = '1';
                emptyArea.addEventListener('click', () => {
                    this.unselectRows(true);
                });
            });

            if (this.getRowOrderPropertyName()) {
                this._orderingColumnInfo = {
                    column: new DataGridColumn(this, null, { label: 'OrderColumn', propertyName: options.orderPropertyName }),
                    ordering: ColumnOrdering.ascending
                };
            }

            this.toolBar = this.leftHeader.appendControl(new Toolbar());

            this.filtersContainer = this.topBar.appendHTML('div');
            this.filtersContainer.classList.add('next-admin-table-filter-container');

            this.actionMenuDropDownButton = new DropDownButton({
                text: Resources.menuIcon + ' ' + Resources.menu,
                dropDownPosition: DropDownPosition.down
            });
            if (this.options.hasActionMenu) {
                this.toolBar.appendControl(this.actionMenuDropDownButton);

                this.buttonRefresh = this.actionMenuDropDownButton.addElement({
                    text: Resources.refreshIcon + ' ' + (this.options.canSave ? Resources.cancel + ' / ' + Resources.refresh : Resources.refresh),
                    action: () => {
                        if (this.options.refreshAction) {
                            this.options.refreshAction(this);
                        }
                    }
                }) as Button;
            }
            else {
                this.buttonRefresh = this.toolBar.appendControl(new Button({
                    text: Resources.refreshIcon + ' ' + (this.options.canSave ? Resources.cancel + ' / ' + Resources.refresh : ''),
                    style: ButtonStyle.bgWhite,
                    action: (btn) => {
                        if (this.options.refreshAction) {
                            this.options.refreshAction(this);
                        }
                    }
                }));
            }
            if ((this.options.canRefresh !== undefined && this.datasetController == null) || this.options.canRefresh === false || this.options.loadingMode == DataLoadingMode.disabled) {
                this.buttonRefresh.element.style.display = 'none';
            }

            let elementDisplayName = this?.datasetController?.getDataDisplayName();
            this.buttonAdd = this.toolBar.appendControl(new Button({
                text: this.options.buttonAddText ?? (elementDisplayName ? Resources.addIcon + ' ' + Resources.add + ' : ' + this?.datasetController?.getDataDisplayName() : Resources.addIcon + ' ' + Resources.add),
                style: ButtonStyle.blue,
                action: () => {
                    if (this.options.addAction != null) {
                        this.options.addAction(this);
                    }
                }
            }));
            if (!this.options.canAdd) {
                this.buttonAdd.element.style.display = 'none';
            }


            //update entities
            this.buttonSave = this.toolBar.appendControl(new Button({
                text: Resources.saveIcon + ' ' + Resources.save, style: ButtonStyle.green, action: () => {
                    this.datasetController.save();
                }
            }));
            this.buttonSave.disable();
            if (!this.options.canSave) {
                this.buttonSave.element.style.display = 'none';
            }

            this.buttonMultiDelete = new Button({
                text: Resources.deleteIcon + ' ' + Resources.deleteMulti,
                action: () => {
                    if (this.options.deleteAction) {
                        this.options.deleteAction(this, this.getSelectedRows());
                    }
                }
            });

            if (this.isMultiDeleteEnabled()) {
                if (this.options.hasActionMenu) {
                    this.actionMenuDropDownButton.appendControl(this.buttonMultiDelete);
                }
                else {
                    this.toolBar.appendControl(this.buttonMultiDelete);
                    this.buttonMultiDelete.setColorStyle(ButtonStyle.red);
                }

                this.buttonMultiDelete.disable();
                this.onDatasetChanged.subscribe(() => {
                    if (this.getRows().where(a => a.isSelected()).length > 0) {
                        this.buttonMultiDelete.enable();
                    }
                    else {
                        this.buttonMultiDelete.disable();
                    }
                });
                this.onSelectedRowsChanged.subscribe((sender, selectedRows) => {
                    if (this.getRows().where(a => a.isSelected()).length > 0) {
                        this.buttonMultiDelete.enable();
                    }
                    else {
                        this.buttonMultiDelete.disable();
                    }
                });
            }

            this.generateReportButton = new NextAdmin.UI.DropDownButton({ text: Resources.printIcon + ' ' + Resources.generateDocument });
            this.generateReportButton.dropDown.onOpen.subscribe((dropDown) => {
                dropDown.clearItems();
                dropDown.addElement(new DropDownButton({
                    text: Resources.standardListExport, items: [
                        {
                            text: Resources.printAll,
                            action: () => {
                                this.generateReportButton.closeDropDown();
                                this.exportData({
                                    exportFormat: 'print',
                                    exportSelectedDataOnly: false,
                                    exportVisibleColumnOnly: true,
                                    exportColumnsDisplayNames: true,
                                    exportFormatedValues: true
                                });
                            }
                        },
                        {
                            text: Resources.printSelection,
                            action: () => {
                                this.generateReportButton.closeDropDown();
                                this.exportData({
                                    exportFormat: 'print',
                                    exportSelectedDataOnly: true,
                                    exportVisibleColumnOnly: true,
                                    exportColumnsDisplayNames: true,
                                    exportFormatedValues: true
                                });
                            }
                        }
                    ]
                }));
                if (this.options.reports != null) {
                    for (let report of this.options.reports) {

                        this.generateReportButton.addElement(new DropDownButton({
                            text: report.label, items: [
                                {
                                    text: Resources.printAll,
                                    action: () => {
                                        this.actionMenuDropDownButton.closeDropDown();
                                        let tempDataController = this.datasetController.clone();
                                        tempDataController.take(null);
                                        tempDataController.skip(null);
                                        tempDataController.select(this.datasetController.options.dataPrimaryKeyName);
                                        tempDataController.load({
                                            onGetResponse: (result) => {
                                                if (result.success) {
                                                    let dataIds = result.dataset.select(e => e[this.datasetController.options.dataPrimaryKeyName]);
                                                    report.action(this, dataIds);
                                                }
                                            }
                                        });
                                    }
                                },
                                {
                                    text: Resources.printSelection,
                                    action: () => {
                                        this.actionMenuDropDownButton.closeDropDown();
                                        let tempDataController = this.datasetController.clone();
                                        tempDataController.take(null);
                                        tempDataController.skip(null);
                                        tempDataController.select(this.datasetController.options.dataPrimaryKeyName);
                                        let ids = this.getSelectedDataRows().select(e => e.data[this.datasetController.options.dataPrimaryKeyName]);
                                        tempDataController.where(this.datasetController.options.dataPrimaryKeyName + ' IN(' + ids.select(e => '?') + ')', ...ids);
                                        tempDataController.load({
                                            onGetResponse: (result) => {
                                                if (result.success) {
                                                    let dataIds = result.dataset.select(e => e[this.datasetController.options.dataPrimaryKeyName]);
                                                    report.action(this, dataIds);
                                                }
                                            }
                                        });
                                    }
                                }
                            ]
                        }));
                    }
                }

            });

            this.actionMenuDropDownButton.addElement(this.generateReportButton);
            if (!this.options.canPrint) {
                this.generateReportButton.element.style.display = 'none';
            }

            this.exportButton = this.actionMenuDropDownButton.addElement({
                text: Resources.downloadIcon + ' ' + Resources.export,
                action: () => {
                    new ExportModal(this).open();
                }
            }) as Button;

            if (!this.options.canExport) {
                this.exportButton.element.style.display = 'none';
            }

            //GridOption
            if (this.options.actionMenuItems) {
                this.actionMenuDropDownButton.addItems(this.options.actionMenuItems)
            }

            this.searchBox = new Input({ css: { cssFloat: 'right', maxWidth: '180px' } });
            this.searchBox.setPlaceholder(Resources.search);
            if (this.options.searchMode == DataSearchMode.server || this.options.searchMode == DataSearchMode.local || (this.options.searchMode === undefined && this.options.columns != null && this.options.columns.firstOrDefault(e => e.searchable) != null)) {
                this.rightHeader.appendControl(this.searchBox);
                this.enableSearch();
            }
            else {
                this.searchBox.element.style.display = 'none';
            }

            this.viewSelect = new Select();
            this.viewSelect.element.style.width = '150px';

            this.initializeViews();

            if (this.options.paginItemCount && this.datasetController != null) {
                this.datasetController.take(this.options.paginItemCount);
                this.enableScrollLoading();
            }

            if (this.datasetController != null) {
                this.datasetController.onStartRequest.subscribe(() => {

                    if (this.options.loadingMode == DataLoadingMode.query) {
                        let containId = false;
                        let columnsToSelect = this.columns.where(e => e != this.actionColumn && e.isQueryble()).select(e => e.options).addRange(this.options.columns.where(e2 => e2.hidden == true)).select((gco: DataGridColumnOptions_) => {
                            if (gco.selectQuery == null) {
                                if (gco.propertyName == this.datasetController.options.dataPrimaryKeyName) {
                                    containId = true;
                                }
                                return gco.propertyName;
                            }
                            let selectQuey = gco.selectQuery;
                            if (!selectQuey.toLowerCase().contains(' as ')) {
                                selectQuey = selectQuey + ' as ' + gco.propertyName;
                            }
                            if (gco.propertyName == this.datasetController.options.dataPrimaryKeyName) {
                                containId = true;
                            }
                            return selectQuey;
                        });
                        if (!containId && this.options.selectDataPrimaryKey) {
                            columnsToSelect.add(this.datasetController.options.dataPrimaryKeyName);
                        }
                        let orderPropertyName = this.getRowOrderPropertyName();
                        if (orderPropertyName && !columnsToSelect.contains(orderPropertyName)) {
                            columnsToSelect.add(orderPropertyName);
                        }
                        this.datasetController.select(...columnsToSelect);
                    }
                    else {
                        this.datasetController.select();
                    }
                    if (!this._suspendUpdateDataFromDataController) {
                        if (this.buttonAdd.isEnable()) {
                            this.buttonAdd.startSpin();
                        }
                        if (this.buttonSave.isEnable()) {
                            this.buttonSave.startSpin();
                        }
                        if (this.buttonRefresh.isEnable()) {
                            this.buttonRefresh.startSpin();
                        }
                        this.startSpin();
                    }
                });
                this.datasetController.onEndRequest.subscribe(() => {
                    this.buttonAdd.stopSpin();
                    this.buttonSave.stopSpin();
                    this.buttonRefresh.stopSpin();
                    this.stopSpin();
                });
                this.datasetController.onDataLoaded.subscribe((sender, result) => {
                    if (!this._suspendUpdateDataFromDataController) {
                        this.setDataset(result.dataset, NextAdmin.Business.DataState.serialized, false);
                    }
                });

                this.datasetController.onDataAdded.subscribe((sender, result) => {
                    this.addDataset(result.dataset, NextAdmin.Business.DataState.serialized);
                });

                this.datasetController.onDataSaved.subscribe((sender, result) => {
                    if (result.success) {
                        this.setDataset(result.newDataset, NextAdmin.Business.DataState.serialized);
                        this.buttonSave.disable();
                        this.setError(null);
                    }
                    else if (result.errors != null && result.errors.length > 0) {
                        //find member label from columns
                        for (let error of result.errors) {
                            if (error.propertyDisplayName == null) {
                                let columnMember = this.columns.firstOrDefault(e => e.options.propertyName == error.propertyName);
                                if (columnMember != null && columnMember.options.label != null) {
                                    error.propertyDisplayName = columnMember.options.label;
                                }
                            }
                        }
                        this.setError(result.errors);
                        this.datasetController.displayDataErrors(null, Business.DataControllerActionType.save, result);
                    }
                    else {
                        if (this.datasetController.dataset.firstOrDefault(e => NextAdmin.Business.DataStateHelper.getDataState(e) == NextAdmin.Business.DataState.deleted)) {
                            MessageBox.createOk(Resources.error, Resources.defaultDeleteError);
                        }
                        else {
                            this.datasetController.displayDefaultError(result);
                        }
                    }
                });

                this.datasetController.onDataAppened.subscribe((sender, result) => {
                    if (this.options.formModalFactory != null) {
                        let modal = this.createModal(result.data);
                        if (modal != null) {
                            modal.open({ data: result.data, dataPrimaryKey: NextAdmin.Business.DataState.append });
                        }
                    }
                    else {
                        this.addDataItem(result.data, NextAdmin.Business.DataState.append, true);
                    }
                });

                this.datasetController.onDataCleared.subscribe((result) => {
                    this.clear();
                });
            }

            if (this.options.page != null && this.options.canSave && this.datasetController != null) {
                let checkDataState = true;
                let navigateFromFunc = (sender, args: NavigateFromArgs) => {
                    if (checkDataState) {
                        args.cancelNavigation = true;
                        this.datasetController.askUserToSaveDataIfNeededAndExecuteAction(async () => {
                            checkDataState = false;
                            await this.options.page.navigationController.navigateTo(args.nextPage.options.name, args.nextPageParameters);
                            checkDataState = true;
                        });
                    }
                };
                this.options.page.onNavigateFrom.subscribe(navigateFromFunc);
            }

            if (this.options.hasContextMenu) {
                this.tableContainer.oncontextmenu = (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    this.openContextMenu(e);
                    return false;
                };
            }
            this.setStyle(this.options.style);
            if (this.options.minHeight) {
                this.stretchContainer.style.minHeight = this.options.minHeight;
            }
            if (this.options.displayNoDataMessage) {
                this.noDataMessageContainer = this.stretchContainer.appendHTML('div', (noDataMessageContainer) => {
                    noDataMessageContainer.style.pointerEvents = 'none';
                    noDataMessageContainer.style.position = 'absolute';
                    noDataMessageContainer.style.left = '0px';
                    noDataMessageContainer.style.top = '0px';
                    noDataMessageContainer.style.height = '100%';
                    noDataMessageContainer.style.width = '100%';
                    noDataMessageContainer.anim('fadeIn');
                    noDataMessageContainer.appendHTML('div', (noDataMessage) => {
                        noDataMessage.classList.add('next-admin-table-no-data-message');
                        noDataMessage.style.pointerEvents = 'none';
                        noDataMessage.center();
                        noDataMessage.innerHTML = NextAdmin.Resources.noDataIcon + ' ' + NextAdmin.Resources.noDataAvailable;
                    });
                    this.onRowAdded.subscribe(() => {
                        noDataMessageContainer.style.display = 'none';
                    });
                    this.onRowRemoved.subscribe(() => {
                        if (this.rows.length == 0) {
                            noDataMessageContainer.style.display = '';
                        }
                    });
                });
            }

            if (this.hasDragAndDropEnabled()) {
                this.initilizeDragAndDrop();
            }
            DataGrid_.onCreated.dispatch(this, this.options);
        }

        openData(row: DataGridRow<T>) {
            let openModel = () => {
                let modal = this.createModal(row.data);
                if (modal != null) {
                    if (this.options.openFormModalWithRowData) {
                        modal.open({ data: row.data });
                    }
                    else {
                        modal.open({ dataPrimaryKey: row.data[modal.dataController.options.dataPrimaryKeyName] });
                    }
                }
            };
            if (!this.options.openFormModalWithRowData && this.options.canSave && this.options.formModalFactory) {
                this.datasetController.askUserToSaveDataIfNeededAndExecuteAction(() => {
                    openModel();
                });
            }
            else if (!this.options.openFormModalWithRowData && this._dataController != null && this.options.formModalFactory) {
                this._dataController.ensureUpToDate(() => {
                    openModel();
                });
            }
            else if (this._masterFormController != null) {
                this._masterFormController.ensureUpToDate(() => {
                    openModel();
                });
            }
            else {
                openModel();
            }
        }

        appendData(): Promise<T> {
            return new Promise(async (resolve) => {

                if (this.options.openFormModalWithRowData && this.options.formModalFactory != null) {
                    let modal = this.createModal();
                    modal.open({
                        appendNewData: true,
                        onDataLoaded: (data) => {
                            resolve(data);
                        }
                    });
                }
                else if (this.datasetController == null) {
                    let data = {};
                    this.addDataItem(data, NextAdmin.Business.DataState.append, true);
                    return;
                }
                else if (this._masterFormController != null && this.options.formModalFactory != null) {
                    this._masterFormController.ensureUpToDate(async () => {
                        let result = await this.datasetController.append();
                        if (result.success) {
                            let detailProperties = this.datasetController.getDataInfo().propertyInfos;
                            for (let propertyName in detailProperties) {
                                let property = detailProperties[propertyName] as NextAdmin.Business.DataPropertyInfo;
                                if (property.foreignDataName == this._masterFormController.options.dataName) {
                                    result.data[property.name] = this._masterFormController.getDataPrimaryKeyValue();
                                    break;
                                }
                            }
                            resolve(result.data);
                        }
                    });
                }
                else if (this._dataController != null && this.options.formModalFactory != null) {
                    this._dataController.ensureUpToDate(async () => {
                        let result = await this.datasetController.append();
                        if (result.success) {
                            let detailProperties = this.datasetController.getDataInfo().propertyInfos;
                            for (let propertyName in detailProperties) {
                                let property = detailProperties[propertyName] as NextAdmin.Business.DataPropertyInfo;
                                if (property.foreignDataName == this._dataController.options.dataName) {
                                    result.data[property.name] = this._dataController.getDataPrimaryKeyValue();
                                    break;
                                }
                            }
                            resolve(result.data);
                        }
                    });
                }
                else if (this.options.canSave && this.options.formModalFactory != null) {
                    this.datasetController.askUserToSaveDataIfNeededAndExecuteAction(async () => {
                        let result = await this.datasetController.append();
                        if (result.success) {
                            resolve(result.data);
                        }
                    });
                }
                else {
                    let result = await this.datasetController.append();
                    if (result.success) {
                        resolve(result.data);
                    }
                }
            });
        }



        public async load(options?: DataGridLoadOptions): Promise<Array<T>> {
            options = {
                updateQuery: true,
                ...options
            };
            if (this.datasetController == null) {
                throw Error('Gird:Unable to load data without datasetController');
            }
            if (options?.updateQuery) {
                this.updateWhereQuery(this.getCurrentView());
            }
            let previousDataset = this.datasetController.dataset;
            this._suspendUpdateDataFromDataController = true;
            if (!options?.updateOnlyIfDataChanged || !previousDataset?.length) {
                this.startSpin();
            }
            let result = await this.datasetController.load();
            this._suspendUpdateDataFromDataController = false;
            this.stopSpin();
            if (!result?.success) {
                return null;
            }
            if (options?.updateOnlyIfDataChanged && previousDataset?.length && result?.dataset?.length) {
                for (let data of previousDataset) {
                    delete data['_state'];
                }
                if (JSON.stringify(previousDataset) == JSON.stringify(result.dataset)) {
                    return null;
                }
            }
            if (options.onPreparDataset) {
                result.dataset = options.onPreparDataset(result.dataset);
            }
            this.setDataset(result.dataset, NextAdmin.Business.DataState.serialized, options?.tryPreserveSelectionAndScroll, options?.fireChange);
            return result.dataset;
        }

        public isMultiDeleteEnabled(): boolean {
            return this.isMultiSelectEnabled() && this.options.deleteMode != NextAdmin.UI.DataDeleteMode.disabled;
        }

        public isMultiSelectEnabled(): boolean {
            return this.options.rowSelectionMode == NextAdmin.UI.RowSelectionMode.multiSelect || this.options.rowSelectionMode == NextAdmin.UI.RowSelectionMode.multiSelect_CtrlShift;
        }

        public hasDragAndDropEnabled() {
            return this.options.orderPropertyName && this.options.reorderingRowMode != DataGridReorderingRowMode.buttons;
        }


        protected initilizeDragAndDrop() {

            if (NextAdmin.UserAgent.isDesktop()) {
                this.tableContainer.addEventListener('pointermove', (event) => {
                    if (this.currentDraggingRow == null) {
                        return;
                    }
                    event.preventDefault();
                    this.dragRow(event.clientX, event.clientY);
                });
                this.tableContainer.addEventListener('pointerup', (event) => {
                    if (this.currentDraggingRow == null) {
                        return;
                    }
                    event.preventDefault();
                    this.dropRow();
                });
            }
            else {
                this.tableContainer.addEventListener('touchmove', (event) => {
                    if (!event.touches?.length || this.currentDraggingRow == null) {
                        return;
                    }
                    event.preventDefault();
                    event.stopPropagation();

                    let touchX = event.touches[0].clientX;
                    let touchY = event.touches[0].clientY;
                    this.currentHovredRow = null;
                    for (let row of this.rows) {
                        let rowBounding = row.element.getBoundingClientRect();
                        if (rowBounding.left < touchX && rowBounding.right > touchX && rowBounding.top < touchY && rowBounding.bottom > touchY) {
                            this.currentHovredRow = row;
                            break;
                        }
                    }
                    this.dragRow(touchX, touchY);
                });
                this.tableContainer.addEventListener('touchend', (event) => {
                    if (this.currentDraggingRow == null) {
                        return;
                    }
                    this.dropRow();

                });
            }
        }

        protected startDragRow(row: DataGridRow_) {
            if (this.currentDraggingRow) {
                this.dropRow();
            }
            this.unselectRows(true)
            this.selectRow(row, true);
            this.currentDraggingRow = row;
            this.currentDraggingRow.element.classList.add('next-admin-table-dragging-row');
        }

        protected dragRow(pointerX: number, pointerY: number) {
            if (this.currentDraggingRow != null && this.currentHovredRow != null && this.currentHovredRow != this.currentDraggingRow && this.currentHovredRow.element.previousElementSibling != this.currentDraggingRow.element) {
                this.currentHovredRow.element.insertControlBefore(this.currentDraggingRow);
            }
            else if (this.currentDraggingRow != null && this.currentHovredRow == null && this.tBody.getChildrenElements().lastOrDefault() != this.currentDraggingRow.element) {
                this.tBody.appendControl(this.currentDraggingRow);
            }
        }

        protected dropRow() {
            if (this.currentDraggingRow != null) {
                this.currentDraggingRow.element.classList.remove('next-admin-table-dragging-row');
                this.currentDraggingRow = null;
                this.rows = this.getRows();
                let i = 0;
                for (let row of this.rows) {
                    row.data[this.options.orderPropertyName] = i;
                    i++;
                }
                this.fireChange();
            }
        }

        /**
         * Return all rows in tbody
         * @returns
         */
        public getRows(): Array<DataGridRow<T>> {
            let rows = new Array<DataGridRow<T>>();
            for (let row of this.tBody.getChildrenElements()) {
                rows.add(row['_control'] as DataGridRow<T>);
            }
            return rows;
        }

        /**
         * Return only rows binded to data
         * @returns
         */
        public getDataRows(): Array<DataGridRow<T>> {
            return this.rows;
        }


        public setStyle(style?: TableStyle) {
            switch (style) {
                default:
                case TableStyle.default:
                    this.element.classList.add('next-admin-table-default');
                    break;
                case TableStyle.modern:
                    this.element.classList.add('next-admin-table-modern');
                    break;
                case TableStyle.modernNoCellPadding:
                    this.element.classList.add('next-admin-table-modern-no-cell-padding');
                    break;
                case TableStyle.card:
                    this.element.classList.add('next-admin-table-card');
                    break;
            }
        }

        refreshSelectView() {
            this.viewSelect.clearItems();
            for (let view of this.options.views.orderBy(a => a.displayOrder ?? 0)) {
                this.viewSelect.addItem(view.id, view.name, view.id == this.options.defaultViewId);
            }
            this.onViewsUpdated.dispatch(this, this.options.views);
        }


        public deleteRows(rows: Array<DataGridRow<T>>) {
            if (this.options.deleteMode == NextAdmin.UI.DataDeleteMode.local) {
                for (let row of rows) {
                    let removingDataArgs = { data: row.data, cancel: false };
                    this.onRemovingData.dispatch(this, removingDataArgs);
                    if (removingDataArgs.cancel) {
                        continue;
                    }
                    this.removeRow(row);
                }
                this.buttonMultiDelete.disable();
            }
            else {
                if (this.datasetController == null) {
                    throw new Error('please set dataset form to enable hard delete');
                }
                MessageBox.createYesCancel(Resources.formDeleteMessageTitle, Resources.formDeleteMessage, async () => {
                    let waitBox = NextAdmin.UI.MessageBox.createLoading();
                    let result = await this.datasetController.deleteItems(rows.select(e => e.data));
                    waitBox.close();
                    if (result.success) {
                        for (let row of rows) {
                            let removingDataArgs = { data: row.data, cancel: false };
                            this.onRemovingData.dispatch(this, removingDataArgs);
                            if (removingDataArgs.cancel) {
                                continue;
                            }
                            this.removeRow(row);
                        }
                        this.buttonMultiDelete.disable();
                    }
                });
            }
        }



        public initializeViews() {
            if (this.options.views != null) {
                let hasSystemView = this.options.views.where(e => !e.isUserView).count() > 0;
                if (!hasSystemView) {//Aucune vue système, elle sera donc créé depuis les colonnes
                    let viewColumns = new Array<DataGridViewColumnOptions>();
                    for (let columnOption of this.options.columns) {
                        let viewColumnOption = {
                            label: columnOption.label,
                            propertyName: columnOption.propertyName,
                            selectQuery: columnOption.selectQuery,
                            width: columnOption.width,
                            maxWidth: columnOption.maxWidth,
                            minWidth: columnOption.minWidth,
                            cellCss: { ...columnOption.cellCss },
                            defaultOrdering: columnOption.defaultOrdering
                        } as DataGridViewColumnOptions;
                        viewColumns.add(viewColumnOption);
                    }
                    let systemView = {
                        name: Resources.systemViewName,
                        id: Guid.newGuid().toString(),
                        isUserView: false,
                        columns: viewColumns
                    } as GridViewOptions;
                    this.options.views.add(systemView);
                }

                this.refreshSelectView();
                if (this.options.canSelectView) {
                    this.toolBar.appendControl(this.viewSelect);
                }
                let activViewId = this.viewSelect.getValue();
                if (activViewId) {
                    this.setViewById(activViewId, false);
                }
                this.viewSelect.onValueChanged.subscribe((sender, args) => {
                    if (args.value != null) {
                        let view = this.options.views.firstOrDefault(e => e.id == args.value);
                        if (view != null) {
                            this.setView(view, true);
                        }
                    }
                });
            }
            else {
                this.setView(null, false);
            }
        }

        protected _disabled = false;
        disable() {
            this.buttonSave.disable();
            this.buttonMultiDelete.disable();
            this.buttonAdd.disable();
            this._disabled = true;
            this.setValue(this.getValue());//force rerender
        }

        enable() {
            this.buttonSave.enable();
            this.buttonMultiDelete.enable();
            this.buttonAdd.enable();
            this._disabled = false;
            this.setValue(this.getValue());//force rerender
        }

        isEnable() {
            return !this._disabled;
        }

        setView(view?: GridViewOptions, load = false) {
            this.columns = [];
            this.rows = [];
            this.rowDictionary = {};
            this.headerRow.innerHTML = '';
            this.tBody.innerHTML = '';


            if (this.options.hasActionColumn) {
                this.addActionColumn();
            }

            if (this.viewFiltersLayout) {
                this.viewFiltersLayout.element.remove();
                this.viewFiltersLayout = null;
            }
            if (view == null) {
                for (let column of this.options.columns) {
                    if (!column.hidden) {
                        this.addColumn(column);
                    }
                }
                if (this.options.datasetController != null) {
                    this.options.datasetController.where(null);
                }
                if (this.options.orderPropertyName) {
                    this._orderingColumnInfo = {
                        column: new DataGridColumn(this, null, { label: 'OrderColumn', propertyName: this.options.orderPropertyName }),
                        ordering: ColumnOrdering.ascending
                    };
                }
            }
            else {
                if (view.orderPropertyName) {
                    this._orderingColumnInfo = {
                        column: new DataGridColumn(this, null, { label: 'OrderColumn', propertyName: view.orderPropertyName }),
                        ordering: ColumnOrdering.ascending
                    };
                }
                this.viewSelect.setValue(view.id);
                for (let viewColumnOpion of view.columns) {
                    let columnOpion = this.options.columns.firstOrDefault(e => e.propertyName == viewColumnOpion.propertyName);
                    let newColumnOption = { ...columnOpion, ...viewColumnOpion }
                    if (!newColumnOption.hidden) {
                        this.addColumn(newColumnOption);
                    }
                }
            }
            if (this.options.datasetController != null) {
                if (view != null && view.filters?.length) {
                    this.viewFiltersLayout = this.filtersContainer.appendControl(new CollapsibleFilter({
                        title: NextAdmin.Resources.searchIcon + ' ' + NextAdmin.Resources.userFilters,
                        items: view.filters
                    }));
                    this.viewFiltersLayout.element.style.marginTop = '4px';
                    if (this.viewFiltersLayout.options.items && this.viewFiltersLayout.options.items.length > 0) {
                        for (let item of this.viewFiltersLayout.options.items) {
                            let control = this.viewFiltersLayout.formLayout.getControlByPosition(item.col, item.row) as NextAdmin.UI.FormControl;
                            if (control != null) {
                                control.onValueChanged.subscribe((sender, args) => {
                                    this.onFilterValueChanged.dispatch(this, {
                                        filterName: item.propertyName,
                                        filter: control,
                                        changeArgs: args
                                    });
                                    this.updateWhereQuery(view);
                                    this.options.datasetController.load();
                                });
                            }
                        }
                    }
                }
                this.updateWhereQuery(view);
            }

            let defaultOrderingColumn = this.columns.firstOrDefault(e => e.options.defaultOrdering != null);
            if (defaultOrderingColumn != null) {
                this.orderBy(defaultOrderingColumn, defaultOrderingColumn.options.defaultOrdering);
            }
            this._currentView = view;
            if (load && this.options.datasetController != null) {
                this.options.datasetController.load();
            }
            this.onViewChanged.dispatch(this, view);
        }

        public getFilter(filterName?: string): FormControl {
            let filterGridItem = this.viewFiltersLayout.options.items.firstOrDefault(a => a.propertyName == filterName);
            if (filterGridItem != null) {
                return this.viewFiltersLayout.formLayout.getControlByPosition(filterGridItem.col, filterGridItem.row) as FormControl;
            }
            return null;
        }

        public getFilters(): Array<{ filterName?: string, filter: FormControl }> {
            if (this.viewFiltersLayout == null) {
                return [];
            }
            return this.viewFiltersLayout.options.items.select(a => {
                if (a != null) {
                    return {
                        filterName: a.propertyName,
                        filter: this.viewFiltersLayout.formLayout.getControlByPosition(a.col, a.row) as FormControl
                    };
                }
                return null;
            }).where(a => a != null);
        }

        public getColumn(columnName?: string): DataGridColumn {
            return this.columns.firstOrDefault(a => a.options.propertyName == columnName);
        }


        public updateWhereQuery(view?: GridViewOptions) {

            let wjereQuery = '';
            let whereArgs = [];
            this._previousScrollTop = 0;

            if (view != null && !String.isNullOrWhiteSpace(view.filterQuery)) {
                wjereQuery = view.filterQuery == null ? '' : view.filterQuery.toString();
                whereArgs = view.filterQueryValues == null ? [] : view.filterQueryValues.clone();
                if (view.filters != null && this.viewFiltersLayout != null) {
                    let indexOfChar = 0;
                    let indexOfParam = 0;
                    for (; indexOfChar < wjereQuery.length; indexOfChar++) {
                        let char = wjereQuery[indexOfChar];
                        if (char == '?') {
                            let filterName = '';
                            let i = indexOfChar + 1
                            for (; i < wjereQuery.length; i++) {
                                if ([' ', ',', '(', ')', '<', '>', '=', '-', '!', '?', '@', '\n', '\r'].contains(wjereQuery[i])) {
                                    break;
                                }
                                filterName += wjereQuery[i];
                            }
                            if (!NextAdmin.String.isNullOrWhiteSpace(filterName)) {
                                wjereQuery = wjereQuery.substring(0, indexOfChar + 1) + wjereQuery.substring(i);
                                let filterValue = null;
                                let filterOption = view.filters.firstOrDefault(e => e.propertyName == filterName);
                                if (filterOption != null) {
                                    let filter = this.viewFiltersLayout.formLayout.getControlByPosition(filterOption.col, filterOption.row) as NextAdmin.UI.FormControl;
                                    if (filter != null) {
                                        filterValue = filter.getValue();
                                    }
                                }
                                if (filterValue === '') {
                                    filterValue = null;
                                }
                                whereArgs.insert(indexOfParam, filterValue);
                                indexOfParam++;
                            }
                            else {
                                indexOfParam++;
                            }
                        }
                    }
                }
            }

            let filterColumns = this.columns.where(c => !NextAdmin.String.isNullOrEmpty(c.filterQuery) && c.filterArgs != null);

            if (filterColumns.count() > 0) {
                if (!String.isNullOrEmpty(wjereQuery)) {
                    wjereQuery = '(' + wjereQuery + ') AND ';
                }
                wjereQuery += filterColumns.select(a => '(' + a.filterQuery + ')').join(' AND ');
                for (let filterColumn of filterColumns) {
                    whereArgs.addRange(filterColumn.filterArgs);
                }
            }

            let queryBuilder = new NextAdmin.Business.QueryBuilder().where(wjereQuery, ...whereArgs);
            this.onUpdateWhereQuery.dispatch(this, queryBuilder);
            if (this.options.onUpdateWhereQuery) {
                this.options.onUpdateWhereQuery(this, queryBuilder);
            }
            this.options.datasetController.where(queryBuilder.query.whereQuery, ...queryBuilder.query.whereQueryArgs);
        }


        getCurrentView(): GridViewOptions {
            return this._currentView;
        }


        setViewById(viewId: string, load = false) {
            this.setView(this.options.views.firstOrDefault(e => e.id == viewId), load);
        }


        setError(errors: string | Array<NextAdmin.Business.DataError>) {
            if (Array.isArray(errors)) {
                for (let error of errors) {
                    let row = this.getRowByDataId(error.dataId);
                    if (row != null) {
                        let cell = row.cells.firstOrDefault(e => e.column.options.propertyName == error.propertyName);
                        if (cell != null && cell.control != null) {
                            cell.control.setError(error.message);
                        }
                    }
                }
            }
            else if (errors == null) {
                for (let row of this.rows) {
                    for (let cell of row.cells) {
                        if (cell.control != null) {
                            cell.control.setError(null);
                        }
                    }
                }
            }
        }



        private enableSearch() {
            let timer = new Timer();
            this.searchBox.onValueChanged.subscribe((searchBox, args) => {
                timer.throttle(() => {
                    this.setSearchValue(args.value, true);
                }, 500);
            });
        }

        public setSearchValue(searchValue?: string, load?: boolean) {
            this.searchBox.setValue(searchValue, false);
            if ((this.options.searchMode === undefined && this.datasetController != null) || this.options.searchMode == DataSearchMode.server) {
                let searchProperties = this.columns.where(e => e.isSearchable()).select(e => !String.isNullOrEmpty(e.options.selectQuery) ? e.options.selectQuery : e.options.propertyName);
                if (this.options.additionalSearchProperties != null) {
                    searchProperties.addRange(this.options.additionalSearchProperties);
                }
                let hiddenSearchableColumnNames = this.options.columns.where(a => a.hidden && a.searchable).select(a => !String.isNullOrEmpty(a.selectQuery) ? a.selectQuery : a.propertyName);
                if (hiddenSearchableColumnNames?.length) {
                    searchProperties.addRange(hiddenSearchableColumnNames)
                }
                this.datasetController.search(searchProperties, searchValue);
                if (load) {
                    this.datasetController.load();
                }
            }
            else {//local search
                if (String.isNullOrEmpty(searchValue)) {
                    for (let row of this.rows) {
                        row.element.style.display = '';
                    }
                }
                else {
                    let search = searchValue.toLowerCase().removeDiacritics();
                    for (let row of this.rows) {
                        let displayRow = false;
                        let searchProperties = this.columns.where(e => e.options.searchable).select(e => e.options.propertyName);
                        if (this.options.additionalSearchProperties != null) {
                            searchProperties.addRange(this.options.additionalSearchProperties);
                        }
                        for (let searchProperty of searchProperties) {
                            let rowCellValue = row.data[searchProperty];
                            if (typeof rowCellValue == 'string') {
                                if (rowCellValue.toLowerCase().removeDiacritics().indexOf(search) != -1) {
                                    displayRow = true;
                                    break;
                                }
                            }
                        }
                        row.element.style.display = displayRow ? '' : 'none';
                    }
                }
            }
        }


        setDataController(dataController: NextAdmin.Business.DataController_, propertyName: string) {
            super.setDataController(dataController, propertyName);
            this.buttonSave.element.style.display = 'none';
            this.buttonRefresh.element.style.display = 'none';
        }


        /**
         * This function is used to synchronize grid with master form, and perform separated data loading
         * @param masterController
         * @param detailForeignKey
         * @param masterPrimaryKey
         */
        public bindToMasterController(masterController: NextAdmin.Business.DataController_, detailForeignKey: string, masterPrimaryKey?: string) {
            this._masterFormController = masterController;
            this.buttonSave.element.style.display = 'none';
            if (this.options.canRefresh !== true) {
                this.buttonRefresh.element.style.display = 'none';
            }
            if (masterPrimaryKey == null) {
                masterPrimaryKey = masterController.options.dataPrimaryKeyName;
            }
            this._foreignKeyName = detailForeignKey;

            this.onFormModalCreated.subscribe((detailModal) => {
                detailModal.dataController.onStartChangeData.subscribe(async (sender, args) => {
                    if (NextAdmin.Business.DataStateHelper.getDataState(args.newData) == NextAdmin.Business.DataState.append) {
                        args.newData[detailForeignKey] = masterController.getData()[masterPrimaryKey];
                    }
                });
            });

            let foreignKeyValue: any;
            this.onUpdateWhereQuery.subscribe((sender, queryBuilder) => {
                queryBuilder.query = queryBuilder.where(detailForeignKey + '=?', foreignKeyValue).query;
            });

            masterController.onDataChanged.subscribe(async (sender, args: NextAdmin.Business.DataChangedEventArgs) => {
                if (args.newData == null) {
                    foreignKeyValue = null;
                    this._suspendChanging = true;
                    this.clear();
                    this._suspendChanging = false;
                }
                else {
                    let propertyInfo = this.getPropertyInfo();
                    if (propertyInfo == null || args.newData[propertyInfo.name] == null || (args.newData[propertyInfo.name] as Array<any>).length == 0) {//if we are not binded or if there is no data, we load it manualy
                        foreignKeyValue = args.newData[masterPrimaryKey];
                        this._suspendChanging = true;
                        await this.load();
                        this._suspendChanging = false;
                    }
                }
            });
        }


        public bindToTab(tab: Tab, masterController: NextAdmin.Business.DataController_, detailForeignKey: string, masterPrimaryKey?: string) {
            this._masterFormController = masterController;
            this.buttonSave.element.style.display = 'none';
            if (this.options.canRefresh !== true) {
                this.buttonRefresh.element.style.display = 'none';
            }
            if (masterPrimaryKey == null) {
                masterPrimaryKey = masterController.options.dataPrimaryKeyName;
            }
            this._foreignKeyName = detailForeignKey;

            this.onFormModalCreated.subscribe((detailModal) => {
                detailModal.dataController.onStartChangeData.subscribe(async (sender, args) => {
                    if (NextAdmin.Business.DataStateHelper.getDataState(args.newData) == NextAdmin.Business.DataState.append) {
                        args.newData[detailForeignKey] = masterController.getData()[masterPrimaryKey];
                    }
                });
            });
            let foreignKeyValue: any;
            this.onUpdateWhereQuery.subscribe((sender, queryBuilder) => {
                queryBuilder.query = queryBuilder.where(detailForeignKey + '=?', foreignKeyValue).query;
            });

            let load = async () => {
                if (foreignKeyValue) {
                    this._suspendChanging = true;
                    tab.body.startSpin();
                    await this.load();
                    this._suspendChanging = false;
                    tab.body.stopSpin();
                }
            };

            tab.tabPanel.onActivTabChanged.subscribe((sender, args) => {
                if (args.newTab == tab) {
                    load();
                }
            });
            masterController.onDataChanged.subscribe((sender, args: NextAdmin.Business.DataChangedEventArgs) => {
                if (args.newData == null) {
                    foreignKeyValue = null;
                    this._suspendChanging = true;
                    this.clear();
                    this._suspendChanging = false;
                }
                else {
                    let propertyInfo = this.getPropertyInfo();
                    if (propertyInfo == null || args.newData[propertyInfo.name] == null || (args.newData[propertyInfo.name] as Array<any>).length == 0) {//if we are not binded or if there is no data, we load it manualy
                        foreignKeyValue = args.newData[masterPrimaryKey];
                        if (tab.isActiv) {
                            load();
                        }
                    }
                }
            });
        }


        private _createdModals = new Array<NextAdmin.UI.DataFormModal_>();

        public createModal(data?: any): DataFormModal_ {
            if (this.options.formModalFactory == null) {
                throw Error('No Modal factory');
            }
            let formModal = this.options.formModalFactory(this.datasetController.options.dataName,
                {
                    dataName: this.datasetController.options.dataName,
                    dataPrimaryKey: data == null ? null : data[this.datasetController.options.dataPrimaryKeyName],
                    isDetailFormModal: this.options.openFormModalWithRowData
                }, data);
            if (formModal == null) {
                return null;
            }

            if (!this._createdModals.contains(formModal)) {

                this._createdModals.add(formModal);
                formModal.onClose.subscribe(() => {
                    this._createdModals.remove(formModal);
                    if (data && NextAdmin.Business.DataStateHelper.getDataState(data) == NextAdmin.Business.DataState.append) {
                        this.datasetController.dataset.remove(data);
                    }
                });

                formModal.dataController.onDataDeleted.subscribe(() => {
                    let pk = formModal.dataController.getDataPrimaryKeyValue();
                    if (pk != null) {
                        let row = this.getRowByDataId(pk);
                        if (row != null) {
                            this.removeRow(row);
                            return;
                        }
                    }
                    if (this.datasetController != null && this.options.loadingMode != DataLoadingMode.disabled) {
                        this.datasetController.load();
                    }
                });

                if (this.options.openFormModalWithRowData) {
                    formModal.onValidate.subscribe((modal, data) => {
                        if (formModal.originalData) {//edit
                            let row = this.getRowByData(formModal.originalData);
                            row.setData(data, true);
                        }
                        else {//append
                            this.addDataItem(data, Business.DataState.append, true);
                        }
                    });
                }

                if (this.options.synchronizeDataWithFormModal) {
                    formModal.dataController.onDataSaved.subscribe((sender, args) => {
                        if (args.success) {
                            if (this._dataController != null || this._masterFormController != null || this.options.loadingMode == DataLoadingMode.disabled) {
                                let pk = formModal.dataController.getDataPrimaryKeyValue();
                                if (pk != null) {
                                    let row = this.getRowByDataId(pk);
                                    if (row != null) {
                                        row.setData(args.newData);
                                        return;
                                    }
                                }
                            }
                            if (this.datasetController != null && this.options.loadingMode != DataLoadingMode.disabled) {
                                this.datasetController.load();
                            }
                        }
                    });
                }
                this.onFormModalCreated.dispatch(formModal, data);
                if (this.options.onFormModalCreated) {
                    this.options.onFormModalCreated(this, { modal: formModal, data: data });
                }
            }
            return formModal;
        }

        public addColumn(options: DataGridColumnOptions_): DataGridColumn {

            let th = document.createElement('th');
            th.classList.add('next-admin-table-header-cell');
            this.headerRow.appendChild(th);
            let gridColumn = new DataGridColumn(this, th, options);
            this.columns.add(gridColumn);
            return gridColumn;
        }

        private addActionColumn(): DataGridColumn {

            let th = document.createElement('th');
            th.classList.add('next-admin-table-header-cell');
            th.classList.add('next-admin-table-action-column-cell-header');
            th.style.padding = '0px';
            this.headerRow.appendChild(th);

            let gridColumn = new DataGridColumn(this, th, {
                label: " Action",
                width: this.options.actionColumnWidth,
                orderable: false,
                onRenderCell: (cell, value) => {
                    cell.element.classList.add('next-admin-table-action-column-cell');
                    if (this.options.renderActionColumnCell) {
                        this.options.renderActionColumnCell(cell);
                    }
                }
            });

            gridColumn.isActionColumn = true;
            this.actionColumn = gridColumn;
            this.columns.add(gridColumn);
            return gridColumn;
        }

        public getRowOrderPropertyName() {
            return this._currentView?.orderPropertyName ?? this.options?.orderPropertyName;
        }


        public addDataItem(data: any, state?: NextAdmin.Business.DataState, fireChange = false): DataGridRow_ {
            if (state == null && NextAdmin.Business.DataStateHelper.getDataState(data) == null) {
                state = NextAdmin.Business.DataState.append;
            }
            if (state != null) {//if state asked == null and row has already a state, we keep row state
                NextAdmin.Business.DataStateHelper.setDataState(data, state);
            }
            this.onAddingData.dispatch(this, { data: data, state: state });
            let orderPropertyName = this.getRowOrderPropertyName();
            if (orderPropertyName && !data[orderPropertyName]) {
                let maxRowOrder = this.getMaxRowOrder();
                maxRowOrder++;
                data[orderPropertyName] = maxRowOrder;
            }
            let row = new DataGridRow_(this);
            this.rowDictionary[row.rowId] = row;
            this.tBody.appendControl(row);
            row.setData(data);

            this.rows.add(row);
            if (state != NextAdmin.Business.DataState.serialized) {
                this.buttonSave.enable();
            }
            this.onRowAdded.dispatch(this, row);
            this.onRenderRow.dispatch(this, row);
            if (fireChange) {
                this.fireChange();
            }
            return row;
        }



        public insertDataItem(data: any, previousRow: DataGridRow_, state = NextAdmin.Business.DataState.append, fireChange = true): DataGridRow_ {
            NextAdmin.Business.DataStateHelper.setDataState(data, state);
            let row = new DataGridRow_(this);
            this.rowDictionary[row.rowId] = row;
            row.setData(data);
            previousRow.element.after(row.element);
            let indexOfPreviousRow = this.rows.indexOf(previousRow);
            this.rows.insert(indexOfPreviousRow + 1, row);

            let i = 0;
            for (let row of this.rows) {
                row.data[this.options.orderPropertyName] = i;
                i++;
            }

            this.onRowAdded.dispatch(this, row);
            this.onRenderRow.dispatch(this, row);
            if (fireChange) {
                this.fireChange();
            }
            return row;
        }




        public addDataset(dataSet: Array<any>, state = NextAdmin.Business.DataState.serialized, fireChange = false): Array<DataGridRow_> {
            if (dataSet == null)
                return;
            this.onAddingDataset.dispatch(this, dataSet);
            let rows = new Array<DataGridRow_>();
            for (let data of dataSet) {
                rows.add(this.addDataItem(data, state, false));
            }
            this.onDatasetChanged.dispatch(this, dataSet);
            if (fireChange) {
                this.fireChange();
            }
            return rows;
        }


        public setDataset(dataSet: Array<any>, state = NextAdmin.Business.DataState.serialized, tryPreserveSelectionAndScroll = true, fireChange = false) {
            let selectedRows = this.getSelectedDataRows();
            this.clear();
            //check if there is order column and if we are in local ordering
            if (dataSet != null && this._orderingColumnInfo?.column?.options?.propertyName != null
                && ((this.options.orderingMode === undefined && this.options.datasetController == null) || this.options.orderingMode == DataOrderingMode.local || !String.isNullOrEmpty(this.getRowOrderPropertyName()))) {
                let orderDataName = this._orderingColumnInfo.column.options.propertyName;
                if (this._orderingColumnInfo.ordering == ColumnOrdering.ascending) {
                    if (this._orderingColumnInfo.column.options.orderingFunc != null) {
                        let orderFunc = this._orderingColumnInfo.column.options.orderingFunc;
                        dataSet = dataSet.orderBy(e => orderFunc(e, dataSet));
                    }
                    else {
                        dataSet = dataSet.orderBy(e => e[orderDataName]);
                    }
                }
                else {
                    if (this._orderingColumnInfo.column.options.orderingFunc != null) {
                        let orderFunc = this._orderingColumnInfo.column.options.orderingFunc;
                        dataSet = dataSet.orderByDescending(e => orderFunc(e, dataSet));
                    }
                    else {
                        dataSet = dataSet.orderByDescending(e => e[orderDataName]);
                    }
                }
            }
            this.addDataset(dataSet, state, false);
            //try select previous rows selecteds (work only id Data has id primarykey)
            if (this.datasetController?.options?.dataPrimaryKeyName) {
                for (let previousSelectedRow of selectedRows) {
                    let rowDataId = previousSelectedRow.data[this.datasetController?.options?.dataPrimaryKeyName];
                    if (rowDataId != null) {
                        let newRowToSelect = this.rows.firstOrDefault(e => e.data[this.datasetController?.options?.dataPrimaryKeyName] == rowDataId);
                        if (newRowToSelect != null) {
                            this.selectRow(newRowToSelect);
                        }
                    }
                }
            }

            if (!tryPreserveSelectionAndScroll) {
                if (this.tableContainer != null) {
                    this.tableContainer.scrollTo(0, 0);
                }
            }


            if (state == NextAdmin.Business.DataState.serialized) {
                this.buttonSave.disable();
            }
            this.onDatasetChanged.dispatch(this, dataSet);
            if (fireChange) {
                this.fireChange();
            }
        }


        private _previousScrollTop = 0;
        protected enableScrollLoading() {
            let isLoading = false;

            this.tableContainer.addEventListener('scroll', async (ev) => {
                if (isLoading || this.datasetController.dataset == null || this.datasetController.dataset.count() == 0)
                    return;

                if (this.tableContainer.scrollTop > this._previousScrollTop && this.tableContainer.scrollTop + this.tableContainer.offsetHeight > this.tableContainer.scrollHeight - 200) {
                    this._previousScrollTop = this.tableContainer.scrollTop;
                    isLoading = true;
                    this.datasetController.skip(this.datasetController.dataset.count());
                    await this.datasetController.loadAdd();
                    this.datasetController.skip(0);
                    isLoading = false;
                }
            });
        }

        public removeRows(rows: Array<DataGridRow_>, fireChange = true) {
            for (let row of rows) {
                this.removeRow(row, false);
            }
            if (fireChange) {
                this.fireChange();
            }
        }


        public removeRow(row: DataGridRow_, fireChange = true) {
            row.element.remove();
            let rowData = row.data;
            if (rowData != null) {
                if (rowData['_state'] == NextAdmin.Business.DataState.append && this.datasetController != null) {
                    this.datasetController.dataset.remove(rowData);
                }
                rowData['_state'] = NextAdmin.Business.DataState.deleted;
            }
            delete this.rowDictionary[row.rowId];
            this.rows.remove(row);
            for (let cell of row.cells) {
                cell.column.cells.remove(cell);
            }
            if (this.getRowOrderPropertyName()) {
                this.updateRowsOrder();
            }
            this.onRowRemoved.dispatch(this, row);
            if (row.isSelected()) {
                let selectedRows = this.getSelectedRows();
                this.onSelectedRowsChanged.dispatch(this, selectedRows);
                if (this.options.onSelectedRowsChanged) {
                    this.options.onSelectedRowsChanged(this, selectedRows)
                }
            }
            if (fireChange) {
                this.fireChange();
            }
            this.buttonSave.enable();
        }


        public removeRowById(rowId: string, fireChange = true) {
            let row = this.rowDictionary[rowId];
            if (row != undefined) {
                this.removeRow(row, fireChange);
            }
        }

        public getRowById(rowId: string): DataGridRow_ {
            return this.rowDictionary[rowId];
        }

        public getRowByData(data: any): DataGridRow_ {
            return this.rows.firstOrDefault(e => e.data === data);
        }

        /**
         * Require to be binded to datasetform
         * @param dataId
         */
        public getRowByDataId(dataId: any): DataGridRow_ {
            if (this.datasetController == null) {
                throw new Error('Unable to get row by id without datasetform');
            }
            return this.rows.firstOrDefault(e => {
                return e.data[this.datasetController.options.dataPrimaryKeyName] == dataId;
            });
        }


        public getDataset(): Array<T> {
            return this.rows.select(e => e.data);
        }

        public createActionColumnCellToolbar(cellControl: DataGridCell_, options?: ActionToolbarOptions) {
            let toolBar = new Toolbar();
            if (!this.isEnable()) {
                return toolBar;
            }
            options = {
                hasDeleteButton: this.options.deleteMode != null && this.options.deleteMode != DataDeleteMode.disabled,
                hasOpenModalButton: this.options.openAction != null,
                hasOrderingButtons: !String.isNullOrEmpty(this.getRowOrderPropertyName()) && (this.options.reorderingRowMode == DataGridReorderingRowMode.all || this.options.reorderingRowMode == DataGridReorderingRowMode.buttons),
                hasDragAndDropHandle: !String.isNullOrEmpty(this.getRowOrderPropertyName()) && (this.options.reorderingRowMode == DataGridReorderingRowMode.all || this.options.reorderingRowMode == DataGridReorderingRowMode.dragAndDropHandle),
                ...options
            };


            if (options.hasDeleteButton) {
                toolBar.appendControl(new Button({
                    text: this.options.deleteMode == DataDeleteMode.server ? Resources.deleteIcon : Resources.removeIcon,
                    style: ButtonStyle.red,
                    stopClickEventPropagation: false,
                    action: (deleteButton) => {
                        if (this.options.deleteAction) {
                            this.options.deleteAction(this, [cellControl.row]);
                        }
                    }
                }));
            }
            if (options.hasOpenModalButton && this.options.openAction != null) {
                toolBar.appendControl(new Button({
                    text: Resources.openIcon,
                    style: ButtonStyle.default,
                    stopClickEventPropagation: false,
                    action: (deleteButton) => {
                        this.options.openAction(cellControl.row);
                    }
                }));
            }

            if (options.hasOrderingButtons) {
                let t = document.createElement('table');
                t.style.borderSpacing = '0px';
                t.appendHTML('tr', (tr) => {
                    tr.appendHTML('td', (td) => {
                        td.style.padding = '0px';
                        td.style.display = 'flex';
                        td.appendControl(new Button({
                            text: '▲', style: ButtonStyle.bgWhite,
                            size: ButtonSize.extraSmall,
                            stopClickEventPropagation: false,
                            action: () => this.upRow(cellControl.row)
                        }));
                    });
                });
                t.appendHTML('tr', (tr) => {
                    tr.appendHTML('td', (td) => {
                        td.style.padding = '0px';
                        td.style.display = 'flex';
                        td.appendControl(new Button({
                            text: '▼', style: ButtonStyle.bgWhite,
                            size: ButtonSize.extraSmall,
                            stopClickEventPropagation: false,
                            action: () => this.downRow(cellControl.row)
                        }));
                    });
                });
                toolBar.appendControl(t);
            }
            if (options.hasDragAndDropHandle) {
                toolBar.appendHTML('span', (grip) => {

                    grip.innerHTML = Resources.dragIcon;
                    grip.classList.add('next-admin-drag-row-handler');
                    toolBar.element.style.cursor = 'grab';

                    if (NextAdmin.UserAgent.isDesktop()) {
                        toolBar.element.addEventListener('pointerdown', () => {
                            this.startDragRow(cellControl.row);
                        });
                    }
                    else {
                        toolBar.element.addEventListener('touchstart', () => {
                            this.startDragRow(cellControl.row);
                        });
                    }
                });
            }
            return toolBar;
        }


        public downRow(row: DataGridRow_) {
            let orderPropertyName = this.getRowOrderPropertyName();
            if (orderPropertyName == null)
                throw new Error('OrderMemberName needed to change row order');

            let maxRowOrder = this.getMaxRowOrder();
            let rowOrder = row.data[orderPropertyName];
            rowOrder = rowOrder == null ? 0 : Number(rowOrder);
            if (rowOrder == maxRowOrder) {
                return;
            }
            rowOrder++;
            let otherRow = this.getDataset().firstOrDefault(e => e[orderPropertyName] == rowOrder);
            if (otherRow != null) {
                otherRow[orderPropertyName] = rowOrder - 1;
            }
            else {
                this.updateRowsOrder();
                this.downRow(row);
                return;
            }
            row.data[orderPropertyName] = rowOrder;
            if (NextAdmin.Business.DataStateHelper.getDataState(row.data) == NextAdmin.Business.DataState.serialized) {
                NextAdmin.Business.DataStateHelper.setDataState(row.data, NextAdmin.Business.DataState.edited);
            }
            this.updateLocalRowsOrder();

        }


        public upRow(row: DataGridRow_) {
            let orderPropertyName = this.getRowOrderPropertyName();
            if (orderPropertyName == null)
                throw new Error('OrderMemberName needed to change row order');

            let minRowOrder = this.getMinRowOrder();
            let rowOrder = row.data[orderPropertyName];
            rowOrder = rowOrder == null ? 0 : Number(rowOrder);
            if (rowOrder == minRowOrder) {
                return;
            }
            rowOrder--;
            let otherRow = this.getDataset().firstOrDefault(e => e[orderPropertyName] == rowOrder);
            if (otherRow != null) {
                otherRow[orderPropertyName] = rowOrder + 1;
            }
            else {
                this.updateRowsOrder();
                this.upRow(row);
                return;
            }
            row.data[orderPropertyName] = rowOrder;
            if (NextAdmin.Business.DataStateHelper.getDataState(row.data) == NextAdmin.Business.DataState.serialized) {
                NextAdmin.Business.DataStateHelper.setDataState(row.data, NextAdmin.Business.DataState.edited);
            }
            this.updateLocalRowsOrder();
        }

        public getMaxRowOrder() {
            let maxRowOrder = 0;
            let dataset = this.getDataset();
            if (dataset != null && dataset.length > 0) {
                maxRowOrder = dataset.max(e => {
                    let ro = e[this.getRowOrderPropertyName()];
                    return ro == null ? 0 : ro;
                });
            }
            return maxRowOrder;
        }


        public getMinRowOrder() {
            let maxRowOrder = 0;
            let dataset = this.getDataset();
            if (dataset != null && dataset.length > 0) {
                maxRowOrder = dataset.min(e => {
                    let ro = e[this.getRowOrderPropertyName()];
                    return ro == null ? 0 : ro;
                });
            }
            return maxRowOrder;
        }

        public updateRowsOrder() {
            let orderedDataSet = this.getDataset().orderBy(e => {
                let ro = e[this.getRowOrderPropertyName()];
                return ro == null ? 0 : ro;
            });
            let i = 0;
            for (let data of orderedDataSet) {
                data[this.getRowOrderPropertyName()] = i;
                i++;
            }
        }

        public clear(fireChange = false) {
            if (this.rows.length > 0) {
                this.rows = new Array<DataGridRow_>();
                for (let columnInfo of this.columns) {
                    columnInfo.cells = new Array<DataGridCell_>();
                }
                this.tBody.innerHTML = '';
                if (fireChange) {
                    this.fireChange();
                }
            }
        }

        public selectRow(row: DataGridRow_, dispatch = true) {
            row.select();
            if (dispatch) {
                this.onRowSelected.dispatch(this, row);
                let selectedRows = this.getSelectedRows();
                this.onSelectedRowsChanged.dispatch(this, selectedRows);
                if (this.options.onSelectedRowsChanged) {
                    this.options.onSelectedRowsChanged(this, selectedRows)
                }
            }
            this.onRenderRow.dispatch(this, row);
        }

        public rowDoubleClicked(row: DataGridRow_, e: MouseEvent) {
            if (this.options.enableDoubleClickOpenModal && this.options.openAction != null) {
                this.options.openAction(row);
            }
            this.onDoubleClickRow.dispatch(row, e);
        }

        public openContextMenu(e: MouseEvent): OpenContextMenuArgs {

            let selectedDataRows = this.getSelectedDataRows();
            let selectedRows = this.getSelectedRows();

            let isOnlyDataRowSelected = selectedDataRows.length == selectedRows.length && selectedDataRows.length > 0;

            let dropDownMenuItems = new Array<MenuItem | Button>();
            let dropDownMenu: DropDownMenu;


            if (selectedRows?.length && this.options.deleteMode != DataDeleteMode.disabled) {
                dropDownMenuItems.add({
                    text: this.options.deleteMode == DataDeleteMode.server ? Resources.deleteIcon + ' ' + Resources.delete : Resources.removeIcon + ' ' + Resources.remove,
                    action: () => {
                        if (this.options.deleteAction) {
                            this.options.deleteAction(this, selectedRows);
                        }
                    }
                });
            }

            if (selectedDataRows?.length) {
                if (this.options.openAction != null && isOnlyDataRowSelected) {
                    dropDownMenuItems.add({
                        text: Resources.openIcon + ' ' + Resources.open,
                        action: () => {
                            for (let row of this.getSelectedDataRows()) {
                                this.options.openAction(row);
                            }
                        }
                    });
                }
                if (this.options.canPrint && isOnlyDataRowSelected) {
                    let printDropDownButton = new NextAdmin.UI.DropDownButton({ text: Resources.printIcon + ' ' + Resources.generateDocument });
                    printDropDownButton.addElement({
                        text: Resources.standardListExport,
                        action: () => {
                            dropDownMenu.close();
                            this.exportData({
                                exportFormat: 'print',
                                exportSelectedDataOnly: true,
                                exportVisibleColumnOnly: true,
                                exportColumnsDisplayNames: true,
                                exportFormatedValues: true
                            });
                        }
                    });

                    if (this.options.reports != null && isOnlyDataRowSelected) {
                        for (let report of this.options.reports) {
                            printDropDownButton.addElement({
                                text: report.label, action: (dd) => {
                                    dropDownMenu.close();
                                    let tempDataController = this.datasetController.clone();
                                    tempDataController.take(null);
                                    tempDataController.skip(null);
                                    tempDataController.select(this.datasetController.options.dataPrimaryKeyName);
                                    let ids = this.getSelectedDataRows().select(e => e.data[this.datasetController.options.dataPrimaryKeyName]);
                                    tempDataController.where(this.datasetController.options.dataPrimaryKeyName + ' IN(' + ids.select(e => '?') + ')', ...ids);
                                    tempDataController.load({
                                        onGetResponse: (result) => {
                                            if (result.success) {
                                                let dataIds = result.dataset.select(e => e[this.datasetController.options.dataPrimaryKeyName]);
                                                report.action(this, dataIds);
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    }
                    dropDownMenuItems.add(printDropDownButton);
                }
            }
            else {
                if (this.options.canAdd && selectedRows.length == 0 && this.buttonAdd.isEnable() && this.buttonAdd.element.style.display != 'none') {
                    dropDownMenuItems.add({
                        text: this.buttonAdd.element.innerHTML,
                        action: () => {
                            this.buttonAdd.executeAction();
                        }
                    });
                }
            }
            dropDownMenu = new DropDownMenu({ items: dropDownMenuItems, dropDownWidth: '350px' });

            let openContextMenuArgs = {
                selectedRows: selectedRows,
                selectedDataRows: selectedDataRows,
                event: e,
                dropDownMenu: dropDownMenu,
                isOnlyDataRowSelected: isOnlyDataRowSelected
            } as OpenContextMenuArgs;
            openContextMenuArgs.dropDownMenu = dropDownMenu;

            this.onOpenContextMenu.dispatch(this, openContextMenuArgs);
            if (this.options.onOpenContextMenu) {
                this.options.onOpenContextMenu(this, openContextMenuArgs);
            }
            if (dropDownMenu.getItems().length > 0) {
                dropDownMenu.open(e.x + 'px', e.y + 'px');
            }

            return openContextMenuArgs;
        }

        public getSelectedDataRows(): Array<DataGridRow<T>> {
            return this.getDataRows().where(e => e.isSelected());
        }

        public getSelectedRows(): Array<DataGridRow<T>> {//allow overide to return other rows (ex: node rows)
            return this.getSelectedDataRows();
        }

        public unselectRow(row: DataGridRow_, dispatch = true) {
            row.unselect();
            if (dispatch) {
                this.onRowUnselected.dispatch(this, row);
                let selectedRows = this.getSelectedRows()
                this.onSelectedRowsChanged.dispatch(this, selectedRows);
                if (this.options.onSelectedRowsChanged) {
                    this.options.onSelectedRowsChanged(this, selectedRows)
                }
            }
            this.onRenderRow.dispatch(this, row);
        }

        public unselectRows(dispatch = true, rows?: Array<DataGridRow_>) {
            if (rows == null) {
                rows = this.getSelectedRows();
            }
            for (let row of rows) {
                this.unselectRow(row, dispatch);
            }
        }

        private _orderingColumnInfo: OrderingColumnInfo;
        public orderBy(column?: DataGridColumn, ordering?: ColumnOrdering, load = true) {

            let isDistantOrdering = (this.datasetController != null && (this.options.orderingMode === undefined || this.options.orderingMode === DataOrderingMode.server));
            if (column == null) {
                this._orderingColumnInfo = null;
                for (let column of this.columns) {
                    if (column.headerColumnOrderInfoElement != null) {
                        column.headerColumnOrderInfoElement.style.visibility = 'hidden';
                    }
                }
                if (isDistantOrdering) {
                    this.datasetController.orderBy();
                    if (load && this.rows.length > 0) {
                        this.datasetController.load();
                    }
                }
                else {
                    if (this.rows.length > 0) {
                        this.updateLocalRowsOrder();
                    }
                }
                return;
            }
            if (column.options.propertyName == null) {
                throw Error('Unable to order column without dataName');
            }
            for (let column of this.columns) {
                if (column.headerColumnOrderInfoElement != null) {
                    column.headerColumnOrderInfoElement.style.visibility = 'hidden';
                }
            }
            if (column.headerColumnOrderInfoElement != null) {
                column.headerColumnOrderInfoElement.style.visibility = '';
                column.headerColumnOrderInfoElement.innerHTML = ordering == ColumnOrdering.descending ? '▼' : '▲';
            }
            this._orderingColumnInfo = { column: column, ordering: ordering };
            if (isDistantOrdering) {//distant ordering
                this.datasetController.orderBy({ name: !String.isNullOrEmpty(column.options.selectQuery) ? column.options.selectQuery : column.options.propertyName, desc: ordering == ColumnOrdering.descending });
                if (load && this.rows.length > 0) {
                    this.datasetController.load();
                }
            }
            else {//localOrdering
                if (load && this.rows.length > 0) {
                    this.updateLocalRowsOrder();
                }
            }
            this.onColumnOrderChanged.dispatch(column, ordering);
        }


        public updateLocalRowsOrder() {
            if (this._orderingColumnInfo?.column?.options?.propertyName == null) {
                throw Error('No ordering column selected');
            }
            this.setDataset(this.getDataset(), null, true);
        }



        public getOrderingColumnInfo() {
            return this._orderingColumnInfo;
        }


        public reRender() {
            this.setDataset(this.getDataset(), null);
        }


        setValue(value: any, fireChange?: boolean) {
            let previousSUspendChanging = this._suspendChanging;
            this._suspendChanging = true;
            this.setDataset(value);
            this._suspendChanging = previousSUspendChanging;
            if (fireChange) {
                this.onValueChanged.dispatch(this, { value: this.getValue(), origin: ChangeOrigin.code });
            }
        }

        getValue() {
            return this.getDataset();
        }

        private _suspendChanging = false;
        public fireChange() {
            if (this._suspendChanging)
                return;
            this.onValueChanged.dispatch(this, null);
        }

        public exportData(options?: DataGridExportOptions) {
            options = {
                exportFormat: 'csv',
                exportSelectedDataOnly: true,
                exportVisibleColumnOnly: true,
                exportColumnsDisplayNames: true,
                exportFormatedValues: true,
                ...options
            }

            let exportAction = (dataset?: Array<any>) => {
                let dataInfo = this.datasetController.getDataInfo();
                var allPropertiesInfo = this.datasetController.getDataPropertyInfos().where(e => e.displayName != null || e.isPrimaryKey);
                let columns = this.columns.where(e => e != this.actionColumn);

                let exportFileDefaultName = (dataInfo.displayName == null ? dataInfo.name : dataInfo.displayName) + '_' + new Date().toISOString() + '.' + options.exportFormat;
                if (options.exportFormat == 'csv') {
                    let csvString = '';
                    if (options.exportVisibleColumnOnly) {
                        csvString += columns.select(e => options.exportColumnsDisplayNames ? e.headerColumnCaptionElement.textContent :
                            (e.options.selectQuery != null ? e.options.selectQuery : e.options.propertyName)).join(',') + "\r\n";
                        for (let dataItem of dataset) {
                            csvString += columns.select(e => JSON.stringify(dataItem[e.options.propertyName] == null ? null : (options.exportFormatedValues ? Helper.getDefaultPropertyDisplayValue(e.tryGetPropertyInfo(), dataItem[e.options.propertyName]) : dataItem[e.options.propertyName]))).join(',') + "\r\n";
                        }
                    }
                    else {
                        csvString += allPropertiesInfo.select(e => options.exportColumnsDisplayNames && e.displayName ? e.displayName : e.name) + "\r\n";
                        for (let dataItem of dataset) {
                            csvString += allPropertiesInfo.select(e => JSON.stringify(dataItem[e.name] == null ? null : (options.exportFormatedValues ? Helper.getDefaultPropertyDisplayValue(e, dataItem[e.name]) : dataItem[e.name]))).join(',') + "\r\n";
                        }
                    }
                    let url = URL.createObjectURL(new Blob([csvString], { type: "text/csv" }));
                    let linkElement = document.createElement('a');
                    linkElement.setAttribute('href', url);
                    linkElement.setAttribute('download', exportFileDefaultName);
                    linkElement.click();
                }
                if (options.exportFormat == 'json') {
                    let formatedDataset = [];
                    for (let dataItem of dataset) {
                        let formatedItem = {};
                        if (options.exportVisibleColumnOnly) {
                            for (let column of columns) {
                                formatedItem[options.exportColumnsDisplayNames ? column.headerColumnCaptionElement.textContent : column.options.propertyName] = (options.exportFormatedValues ? Helper.getDefaultPropertyDisplayValue(column.tryGetPropertyInfo(), dataItem[column.options.propertyName]) : dataItem[column.options.propertyName]);
                            }
                        }
                        else {
                            for (let propertyInfo of allPropertiesInfo) {
                                formatedItem[options.exportColumnsDisplayNames && propertyInfo.displayName != null ? propertyInfo.displayName : propertyInfo.name] = (options.exportFormatedValues ? Helper.getDefaultPropertyDisplayValue(propertyInfo, dataItem[propertyInfo.name]) : dataItem[propertyInfo.name]);
                            }
                        }
                        formatedDataset.push(formatedItem);
                    }
                    let url = URL.createObjectURL(new Blob([JSON.stringify(formatedDataset)], { type: "application/json" }));
                    let linkElement = document.createElement('a');
                    linkElement.setAttribute('href', url);
                    linkElement.setAttribute('download', exportFileDefaultName);
                    linkElement.click();
                }
                if (options.exportFormat == 'print') {
                    this.print({ dataset: dataset });
                }

            };

            if ((options.exportSelectedDataOnly && options.exportVisibleColumnOnly)) {
                exportAction(this.getSelectedDataRows().select(e => e.data));
            }
            else {
                if (options.exportVisibleColumnOnly) {
                    let dataset = this.getDataset();
                    if (this.options.paginItemCount == null || dataset.length < this.options.paginItemCount) {
                        exportAction(dataset);
                        return;
                    }
                }
                if (this._bindedPropertyName != null) {
                    exportAction(this.getDataset());
                }
                else {
                    this.getFullDataset((dataset) => {
                        exportAction(dataset);
                    }, !options.exportVisibleColumnOnly, options.exportSelectedDataOnly)
                }
            }
        }

        public getFullDataset(response: (dataset: Array<any>) => void, loadAllColumns = false, loadSelectedRow = false) {

            let tempDataController = this.datasetController.clone();
            tempDataController.take(null);
            tempDataController.skip(null);
            if (loadAllColumns) {
                tempDataController.select();
            }
            if (loadSelectedRow) {
                let ids = this.getSelectedDataRows().select(e => e.data[this.datasetController.options.dataPrimaryKeyName]);
                tempDataController.where(this.datasetController.options.dataPrimaryKeyName + ' IN(' + ids.select(e => '?') + ')', ...ids);
            }
            tempDataController.load({
                onGetResponse: () => (result) => {
                    if (result.success) {
                        response(result.dataset);
                    }
                }
            });

        }




        public print(options = {} as DataGridPrintOptions) {
            let iFrameModal = new NextAdmin.UI.Modal({ title: Resources.printIcon + ' ' + Resources.print });
            iFrameModal.body.style.background = '#fff';
            iFrameModal.body.style.overflow = 'hidden';
            iFrameModal.body.appendHTML('iframe', (iframe) => {
                iframe.addEventListener('load', () => {

                    let dataInfo = this.datasetController.getDataInfo()

                    iframe.contentWindow.document.head.title = dataInfo.displayName != null ? dataInfo.displayName : dataInfo.name + ' (' + Resources.list + ')';
                    iframe.contentWindow.document.head.innerHTML = '<meta charset="utf-8">';
                    let style = document.createElement('style');
                    style.textContent = 'body{font-family:callibri,sans-serif;}';
                    iframe.contentWindow.document.head.append(style);

                    iframe.contentWindow.document.body.append(this.getPrintableElement(options));
                    iframe.contentWindow.focus();
                    let images = iframe.contentWindow.document.querySelectorAll('img');
                    if (images.length > 0) {

                        let imgLoaedCount = 0;
                        let imgLoad = () => {
                            imgLoaedCount++;
                            if (imgLoaedCount == images.length) {
                                iframe.contentWindow.print();
                            }
                        };
                        iframe.contentWindow.document.querySelectorAll('img').forEach((img) => {
                            img.addEventListener('load', () => {
                                imgLoad();
                            });
                        });
                    }
                    else {
                        iframe.contentWindow.print();
                    }
                    iFrameModal.close();
                });
                iframe.src = 'about:blank';
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.frameBorder = '0';

            });
            iFrameModal.body.style.position = 'relative';
            iFrameModal.body.appendHTML('div', (eventBlocker) => {
                eventBlocker.style.position = 'absolute';
                eventBlocker.style.width = '100%';
                eventBlocker.style.height = '100%';
                eventBlocker.style.left = '0px';
                eventBlocker.style.top = '0px';
            });

            iFrameModal.open();
            iFrameModal.element.style.display = 'none';
        }


        getPrintableElement(options = {} as DataGridPrintOptions): HTMLElement {
            let table = new Table();
            table.element.style.fontSize = '11px';
            table.element.style.width = '100%';
            let columns = this.columns.where(e => e != this.actionColumn);
            table.addHeaderRow(...columns.select(e => e.headerColumnCaptionElement.textContent));

            let dataset = options.dataset != null ? options.dataset : this.getDataset();
            let rowNotFound = false;
            for (let dataItem of dataset) {
                let row = rowNotFound ? null : this.getRowByData(dataItem);//si une ligne n'a déjà pas été trouvé on ne fait pas de nouveau la recherche
                if (row != null) {
                    table.addBodyRow(...columns.select(column => {
                        let cell = row.getCellByPropertyName(column.options.propertyName);
                        if (cell.control != null) {
                            return cell.control.getDisplayValue();
                        }
                        else {
                            return cell.element.innerHTML;
                        }
                    }));
                }
                else {
                    rowNotFound = true;
                    table.addBodyRow(...columns.select(e => dataItem[e.options.propertyName] == null ? null : Helper.getDefaultPropertyDisplayValue(e.tryGetPropertyInfo(), dataItem[e.options.propertyName])));
                }
            }
            return table.element;
        }

        public getPropertyName(dataDefPropertyAction: (dataDef: T) => any): string {
            return this.datasetController.getPropertyName(dataDefPropertyAction);
        }

    }


    export class DataGrid_ extends DataGrid<any> {

    }


    class DataGridColumn {

        grid: DataGrid_;

        headerColumnCell: HTMLTableHeaderCellElement;

        headerColumnCaptionElement: HTMLSpanElement;

        headerColumnOrderInfoElement: HTMLSpanElement;

        headerColumnSearchFilter: NextAdmin.UI.DropDownButton;

        headerColumnToolbar: NextAdmin.UI.Toolbar;

        searchBox?: NextAdmin.UI.Input;

        searchGrid?: DataGrid_;

        options: DataGridColumnOptions_;

        cells = new Array<DataGridCell_>();

        isActionColumn: boolean;

        filterQuery?: string;

        filterArgs?: Array<any>;

        timer: NextAdmin.Timer;


        constructor(grid: DataGrid_, th: HTMLTableHeaderCellElement, options: DataGridColumnOptions_) {
            this.grid = grid;
            this.options = options;
            this.headerColumnCell = th;
            this.timer = new NextAdmin.Timer();
            if (this.headerColumnCell != null && grid.options.rowsBordered) {
                this.headerColumnCell.classList.add('next-admin-table-row-border');
            }
            //headerCss
            if (options.headerCss) {
                NextAdmin.Copy.copyTo(options.headerCss, this.headerColumnCell.style);
            }
            if (options.width) {
                this.headerColumnCell.style.width = options.width;
            }
            if (options.maxWidth) {
                this.headerColumnCell.style.width = options.maxWidth;
            }
            if (options.minWidth) {
                this.headerColumnCell.style.width = options.minWidth;
            }
            if (options.toolTip) {
                this.headerColumnCell.setPopover(options.toolTip);
            }

            if (th != null) {
                this.headerColumnToolbar = this.headerColumnCell.appendControl(new NextAdmin.UI.Toolbar());
                this.headerColumnSearchFilter = this.getDropDownSearchFilter();
                if (this.headerColumnSearchFilter) {
                    this.headerColumnToolbar.appendControl(this.headerColumnSearchFilter);
                }

                this.headerColumnCaptionElement = document.createElement('span');
                this.headerColumnCaptionElement.innerHTML = this.options.propertyName;
                if (options.label != null) {
                    this.headerColumnCaptionElement.innerHTML = options.label;
                }
                else if (this.options.propertyName != null && this.grid.datasetController != null) {
                    let propertyInfo = this.tryGetPropertyInfo();
                    if (propertyInfo != null) {
                        if (propertyInfo.displayName != null) {
                            this.headerColumnCaptionElement.innerHTML = propertyInfo.displayName;
                        }
                        if (this.options.controlFactory != null && propertyInfo.isRequired) {
                            this.headerColumnCaptionElement.classList.add('next-admin-table-column-header-required');
                        }
                    }
                }
                this.headerColumnToolbar.appendControl(this.headerColumnCaptionElement);
                if (this.isOrderable()) {
                    this.headerColumnOrderInfoElement = document.createElement('span');
                    this.headerColumnOrderInfoElement.style.marginLeft = '5px';
                    this.headerColumnOrderInfoElement.innerHTML = '';
                    this.headerColumnOrderInfoElement.style.visibility = 'hidden';

                    th.addEventListener('click', () => {
                        if (grid.options.orderPropertyName != null) {
                            console.log('unable to change column order because change row order is enabled');
                            return;
                        }

                        let doOrderAction = () => {
                            let orderingInfo = grid.getOrderingColumnInfo();
                            if (orderingInfo == null || orderingInfo.column != this || (orderingInfo.column == this && orderingInfo.ordering == ColumnOrdering.descending)) {
                                grid.orderBy(this, ColumnOrdering.ascending);
                            }
                            else {
                                grid.orderBy(this, ColumnOrdering.descending);
                            }
                        };

                        if (this.grid.options.datasetController != null) {
                            this.grid.options.datasetController.displayLostDataMessageIfNeededAndExecuteAction(() => {
                                doOrderAction();
                            });
                        }
                        else {
                            doOrderAction();
                        }
                    });
                    th.style.cursor = 'pointer';
                    this.headerColumnToolbar.appendControl(this.headerColumnOrderInfoElement);
                }
            }
        }

        getDropDownSearchFilter(): NextAdmin.UI.DropDownButton {
            if (!NextAdmin.String.isNullOrEmpty(this.options.propertyName) && this.grid.options.searchMode == DataSearchMode.server && this.options.searchable !== false && this.options.queryable !== false) {
                let propertyInfo = this.tryGetPropertyInfo();
                if (propertyInfo?.type == 'string') {
                    return this.getTextSearchFilter();
                }
                else if (propertyInfo?.type == 'number') {
                    return this.getNumberSearchFilter();
                }
                else if (propertyInfo?.type == 'date') {
                    return this.getDateSearchFilter();
                }
                else if (propertyInfo?.type == 'enum') {
                    return this.getEnumSearchFilter();
                }
            }
            return null;
        }


        getNumberSearchFilter(): NextAdmin.UI.DropDownButton {

            let headerColumnSearchFilter = new NextAdmin.UI.DropDownButton({
                text: Resources.searchIcon,
                style: NextAdmin.UI.ButtonStyle.noBg,
                dropDownParentContainer: this.grid.element,
            });
            headerColumnSearchFilter.dropDown.element.style.zIndex = '9999';


            headerColumnSearchFilter.appendHTML('div', (container) => {
                container.style.padding = '5px';

                let timer = new NextAdmin.Timer();
                let minInput = container.appendControl(new NextAdmin.UI.Input({
                    label: NextAdmin.Resources.min,
                    inputType: NextAdmin.UI.InputType.number,
                    onValueChanged: () => {
                        timer.throttle(() => {
                            updateSearch();
                        }, 50);
                    }
                }));
                minInput.element.style.marginBottom = '5px';
                let maxInput = container.appendControl(new NextAdmin.UI.Input({
                    label: NextAdmin.Resources.max,
                    inputType: NextAdmin.UI.InputType.number,
                    onValueChanged: () => {
                        timer.throttle(() => {
                            updateSearch();
                        }, 50);
                    }
                }));
                maxInput.element.style.marginBottom = '5px';
                container.appendControl(new NextAdmin.UI.Button({
                    text: NextAdmin.Resources.removeIcon + ' ' + NextAdmin.Resources.clearFilter,
                    style: NextAdmin.UI.ButtonStyle.blue,
                    css: { minWidth: '100%' },
                    action: () => {
                        minInput.setValue('');
                        maxInput.setValue('');
                        updateSearch();
                    }
                }));

                let updateSearch = () => {

                    let min = minInput.getValue();
                    let max = maxInput.getValue();

                    this.filterQuery = '';
                    this.filterArgs = [];
                    if (min) {
                        this.filterQuery += this.options.propertyName + ' >= ?';
                        this.filterArgs.add(min);
                    }
                    if (max) {
                        if (min) {
                            this.filterQuery += ' AND '
                        }
                        this.filterQuery += this.options.propertyName + ' <= ?'
                        this.filterArgs.add(max);
                    }
                    //this.grid.onColumnFilterSelectedValuesChanged.dispatch(this, selectValues);
                    this.grid.updateWhereQuery(this.grid.getCurrentView());
                    this.grid.datasetController.load();
                    this.updateHeaderColor();
                };

            });

            return headerColumnSearchFilter;
        }



        getEnumSearchFilter(): NextAdmin.UI.DropDownButton {

            let propertyInfo = this.tryGetPropertyInfo();

            let headerColumnSearchFilter = new NextAdmin.UI.DropDownButton({
                text: Resources.searchIcon,
                style: NextAdmin.UI.ButtonStyle.noBg,
                dropDownParentContainer: this.grid.element,
            });
            headerColumnSearchFilter.dropDown.element.style.zIndex = '9999';


            let table: Table;
            headerColumnSearchFilter.appendHTML('div', (tableContainer) => {
                tableContainer.style.maxHeight = '250px';
                tableContainer.style.overflow = 'auto';
                if (UserAgent.isDesktop()) {
                    tableContainer.appendPerfectScrollbar();
                }

                table = tableContainer.appendControl(new NextAdmin.UI.Table({
                    rowSelectionMode: RowSelectionMode.multiSelect,
                    stretchWidth: true,
                    rowHoverable: true,
                    style: TableStyle.modern,
                }), (table) => {
                    table.element.style.maxHeight = '250px';
                    for (let value of propertyInfo.values) {
                        let row = table.addBodyRow(value.label);
                        row['_value'] = value.value;
                    }
                    table.onSelectedRowsChanged.subscribe((table, rows) => {
                        updateSearch();
                    });
                });
            });

            headerColumnSearchFilter.appendHTML('div', (footer) => {
                footer.style.padding = '5px';
                footer.style.boxShadow = '0px -1px 2px rgba(0,0,0,0.2)';
                footer.appendControl(new NextAdmin.UI.Button({
                    text: NextAdmin.Resources.removeIcon + ' ' + NextAdmin.Resources.clearFilter,
                    style: NextAdmin.UI.ButtonStyle.blue,
                    css: { minWidth: '100%' },
                    action: () => {
                        table.unselectAll();
                        updateSearch();
                    }
                }));
            });


            let updateSearch = () => {
                let selectRows = table.getSelectedRows();
                if (selectRows.length) {
                    this.filterQuery = this.options.propertyName + ' IN(' + selectRows.select(a => '?').join(',') + ')'
                    this.filterArgs = selectRows.select(a => a['_value']);
                }
                else {
                    this.filterQuery = null;
                    this.filterArgs = [];
                }
                this.grid.updateWhereQuery(this.grid.getCurrentView());
                this.grid.datasetController.load();
                this.updateHeaderColor();
            };


            return headerColumnSearchFilter;
        }





        getDateSearchFilter(): NextAdmin.UI.DropDownButton {

            let headerColumnSearchFilter = new NextAdmin.UI.DropDownButton({
                text: Resources.searchIcon,
                style: NextAdmin.UI.ButtonStyle.noBg,
                dropDownParentContainer: this.grid.element,
            });
            headerColumnSearchFilter.dropDown.element.style.zIndex = '9999';


            headerColumnSearchFilter.appendHTML('div', (container) => {
                container.style.padding = '5px';

                let timer = new NextAdmin.Timer();
                let minInput = container.appendControl(new NextAdmin.UI.Input({
                    label: NextAdmin.Resources.start,
                    inputType: NextAdmin.UI.InputType.date,
                    onValueChanged: () => {
                        timer.throttle(() => {
                            updateSearch();
                        }, 50);
                    }
                }));
                minInput.element.style.marginBottom = '5px';
                let maxInput = container.appendControl(new NextAdmin.UI.Input({
                    label: NextAdmin.Resources.end,
                    inputType: NextAdmin.UI.InputType.date,
                    onValueChanged: () => {
                        timer.throttle(() => {
                            updateSearch();
                        }, 50);
                    }
                }));
                maxInput.element.style.marginBottom = '5px';
                container.appendControl(new NextAdmin.UI.Button({
                    text: NextAdmin.Resources.removeIcon + ' ' + NextAdmin.Resources.clearFilter,
                    style: NextAdmin.UI.ButtonStyle.blue,
                    css: { minWidth: '100%' },
                    action: () => {
                        minInput.setValue('');
                        maxInput.setValue('');
                        updateSearch();
                    }
                }));

                let updateSearch = () => {

                    let min = minInput.getValue();
                    let max = maxInput.getValue();

                    this.filterQuery = '';
                    this.filterArgs = [];
                    if (min) {
                        this.filterQuery += this.options.propertyName + ' >= ?';
                        this.filterArgs.add(new Date(min));
                    }
                    if (max) {
                        if (min) {
                            this.filterQuery += ' AND '
                        }
                        this.filterQuery += this.options.propertyName + ' <= ?'
                        this.filterArgs.add(new Date(max));
                    }
                    //this.grid.onColumnFilterSelectedValuesChanged.dispatch(this, selectValues);
                    this.grid.updateWhereQuery(this.grid.getCurrentView());
                    this.grid.datasetController.load();
                    this.updateHeaderColor();
                };

            });

            return headerColumnSearchFilter;
        }


        getTextSearchFilter(): NextAdmin.UI.DropDownButton {
            let rightSpace = window.innerWidth - this.headerColumnCell.offsetLeft;
            let headerColumnSearchFilter = new NextAdmin.UI.DropDownButton({
                text: Resources.searchIcon,
                style: NextAdmin.UI.ButtonStyle.noBg,
                dropDownParentContainer: this.grid.element,
                dropDownPosition: rightSpace > 300 ? NextAdmin.UI.DropDownPosition.down : NextAdmin.UI.DropDownPosition.downLeft
            });
            headerColumnSearchFilter.dropDown.element.style.zIndex = '9999';
            this.searchBox = headerColumnSearchFilter.addElement(new NextAdmin.UI.Input({
                placeholder: Resources.search,
                css: { boxShadow: '0px 1px 2px rgba(0,0,0,0.2)' },
            })) as NextAdmin.UI.Input;
            this.searchBox.controlContainer.style.padding = '5px';
            let gridContainer = headerColumnSearchFilter.addElement(document.createElement('div')) as HTMLElement;
            gridContainer.style.height = '200px';

            headerColumnSearchFilter.onActionExecuted.subscribe(() => {
                if (this.searchGrid != null) {
                    return;
                }
                this.searchGrid = gridContainer.appendControl(new NextAdmin.UI.DataGrid_({
                    paginItemCount: 200,
                    rowSelectionMode: NextAdmin.UI.RowSelectionMode.multiSelect,
                    rowHoverable: true,
                    dataName: this.grid.datasetController.options.dataName,
                    hasActionColumn: false,
                    searchMode: NextAdmin.UI.DataSearchMode.server,
                    canAdd: false,
                    deleteMode: NextAdmin.UI.DataDeleteMode.disabled,
                    hasContextMenu: false,
                    selectDataPrimaryKey: false,
                    columns: [{ propertyName: this.options.propertyName, selectQuery: this.options.selectQuery, searchable: true, defaultOrdering: ColumnOrdering.ascending }],
                }));
                this.searchGrid.tHead.style.display = 'none';
                this.searchGrid.topBar.style.display = 'none';
                this.searchGrid.datasetController.where(this.options.propertyName + ' IS NOT NULL');
                this.searchGrid.datasetController.distinct(true);
                let searchValue = this.searchBox.getValue();
                if (!String.isNullOrEmpty(searchValue)) {
                    this.searchGrid.searchBox.setValue(searchValue, false);
                }
                this.searchGrid.onSelectedRowsChanged.subscribe((sender, selectedRows) => {
                    let selectValues = selectedRows.select(a => a.data[this.options.propertyName]);
                    this.filterQuery = selectValues.select(a => this.options.propertyName + ' = ?').join(' OR ');
                    this.filterArgs = selectValues.clone();
                    this.grid.onColumnFilterSelectedValuesChanged.dispatch(this, selectValues);
                    this.grid.updateWhereQuery(this.grid.getCurrentView());
                    this.grid.datasetController.load();
                    this.updateHeaderColor();
                });
                this.searchGrid.datasetController.load({
                    onGetResponse: () => () => {
                        setTimeout(() => {
                            if (this.filterArgs && this.filterArgs.length > 0) {
                                for (let row of this.searchGrid.rows) {
                                    let rowColumnValue = row.data[this.options.propertyName];
                                    if (this.filterArgs.firstOrDefault(a => a == rowColumnValue) != null) {
                                        this.searchGrid.selectRow(row, false);
                                    }
                                }
                            }
                        }, 20);
                    }
                });

            });
            this.searchBox.onValueChanged.subscribe((sender, args) => {
                if (this.searchGrid == null) {
                    return;
                }
                this.timer.throttle(() => {
                    let filterValue = this.searchBox.getValue();

                    this.setSearchValue(args.value);
                    this.grid.onColumnFilterSearchValueChanged.dispatch(this, filterValue);
                    this.grid.updateWhereQuery(this.grid.getCurrentView());
                    this.grid.datasetController.load();
                    this.searchGrid.searchBox.setValue(filterValue, true);
                }, 500);
            });
            headerColumnSearchFilter.appendHTML('div', (footer) => {
                footer.style.padding = '5px';
                footer.style.boxShadow = '0px -1px 2px rgba(0,0,0,0.2)';
                footer.appendControl(new NextAdmin.UI.Button({
                    text: NextAdmin.Resources.removeIcon + ' ' + NextAdmin.Resources.clearFilter,
                    style: NextAdmin.UI.ButtonStyle.blue,
                    css: { minWidth: '100%' },
                    action: () => {
                        this.searchBox.setValue('', true);
                        this.searchGrid.unselectRows(true);
                    }
                }));
            });

            return headerColumnSearchFilter;
        }



        setSearchValue(value?: string, fireLoad?: boolean) {
            if (this.headerColumnSearchFilter == null || this.searchBox == null) {
                return;
            }
            this.searchBox.setValue(value, fireLoad);
            if (!NextAdmin.String.isNullOrEmpty(value)) {
                let searchparts = value.split(' ');
                this.filterQuery = searchparts.select(a => 'LOWER(' + this.options.propertyName + ') LIKE LOWER(?)').join(' AND ');
                this.filterArgs = searchparts.select(a => '%' + a + '%');
            }
            else {
                this.filterQuery = null;
                this.filterArgs = null;
            }
            this.updateHeaderColor();
        }

        setFilteredValues(selectValues: Array<any>) {
            if (this.headerColumnSearchFilter == null) {
                return;
            }
            if (selectValues != null && selectValues.length > 0) {
                this.filterQuery = selectValues.select(a => this.options.propertyName + ' = ?').join(' OR ');
                this.filterArgs = selectValues.clone();
            }
            else {
                this.filterQuery = null;
                this.filterArgs = null;
            }
            this.updateHeaderColor();
        }

        updateHeaderColor() {
            if (this.headerColumnSearchFilter == null) {
                return;
            }
            if ((this.filterArgs != null && this.filterArgs.length > 0) || !String.isNullOrEmpty(this.searchBox?.getValue())) {
                this.headerColumnCaptionElement.style.color = '#ff0000';
                this.headerColumnSearchFilter.element.style.color = '#ff0000';
            }
            else {
                this.headerColumnCaptionElement.style.color = '';
                this.headerColumnSearchFilter.element.style.color = '';
            }

        }


        private _propertyInfo: NextAdmin.Business.DataPropertyInfo;
        tryGetPropertyInfo(): NextAdmin.Business.DataPropertyInfo {
            if (this._propertyInfo == null && this.grid.datasetController != null) {
                if (!String.isNullOrEmpty(this.options.selectQuery) && this.options.selectQuery.contains('.')) {
                    this._propertyInfo = this.grid.datasetController.getDataPropertyInfoFromPath(this.grid.datasetController.options.dataName, this.options.selectQuery);
                }
                else {
                    this._propertyInfo = this.grid.datasetController.getDataPropertyInfo_(this.grid.datasetController.options.dataName, this.options.propertyName);
                }
            }
            return this._propertyInfo;
        }


        isSearchable(): boolean {
            if (this == this.grid.actionColumn)
                return false;
            if (this.options.searchable !== undefined) {
                return this.options.searchable;
            }
            let propertyInfo = this.tryGetPropertyInfo();
            if (propertyInfo != null && propertyInfo.isQueryable) {
                return true;
            }
            return false;
        }

        isOrderable(): boolean {
            if (this == this.grid.actionColumn)
                return false;
            if (this.options.orderable !== undefined) {
                return this.options.orderable;
            }
            let propertyInfo = this.tryGetPropertyInfo();
            if (propertyInfo != null && propertyInfo.isQueryable) {
                return true;
            }
            return false;
        }

        isQueryble() {
            return this.options.queryable !== false;
        }

    }


    export class DataGridRow<T> extends Control {

        data: T;

        element: HTMLTableRowElement;

        grid: DataGrid<T>;

        cells = new Array<DataGridCell_>();

        cellActionToolbar: DataGridCell<T>;

        rowId: string;

        private _selected = false;

        constructor(grid: DataGrid_) {
            super('tr');
            this.element.classList.add('next-admin-table-row');

            this.grid = grid;
            this.element.setAttribute('RowId', this.rowId = Guid.newGuid().toString());

            if (this.grid.options.rowSelectionMode != null && this.grid.options.rowSelectionMode != RowSelectionMode.disabled) {
                this.element.style.cursor = 'pointer';
            }
            let lastClickTimeStamp = -1;

            if (this.grid.options.hasContextMenu) {
                this.element.oncontextmenu = (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    this.grid.openContextMenu(e);
                    return false;
                };
            }
            this.element.addEventListener('click', (e) => {
                //check double click
                let actualTimeStamp = Date.now();
                if (actualTimeStamp - lastClickTimeStamp < 500) {
                    this.grid.rowDoubleClicked(this, e);
                    lastClickTimeStamp = -1;
                }
                else {
                    lastClickTimeStamp = actualTimeStamp;
                }

                if (this.grid.options.rowSelectionMode != undefined && this.grid.options.rowSelectionMode != RowSelectionMode.disabled) {
                    if (this.grid.options.rowSelectionMode == RowSelectionMode.multiSelect) {
                        if (this.isSelected()) {
                            this.unselect();
                        }
                        else {
                            this.select();
                        }
                    }
                    else if (this.grid.options.rowSelectionMode == RowSelectionMode.multiSelect_CtrlShift) {
                        let gridRows = this.grid.getRows()
                        if (e.shiftKey) {
                            let previousSelectedRow = null;
                            let selectRows = gridRows.where(a => a.isSelected());
                            let upToDown = true;
                            if (selectRows.length > 0) {
                                let lastSelectRow = selectRows.lastOrDefault();
                                if (gridRows.indexOf(lastSelectRow) < gridRows.indexOf(this)) {
                                    previousSelectedRow = lastSelectRow;
                                }
                                else {
                                    previousSelectedRow = selectRows.firstOrDefault();
                                    upToDown = false;
                                }
                            }
                            else {
                                previousSelectedRow = gridRows[0];
                            }
                            if (previousSelectedRow != null) {
                                let previousRowFound = false;
                                let rows = upToDown ? gridRows : gridRows.clone().reverse();
                                for (let row of rows) {
                                    if (row == previousSelectedRow) {
                                        previousRowFound = true;
                                    }
                                    if (previousRowFound) {
                                        row.select();
                                    }
                                    if (row == this) {
                                        break;
                                    }
                                }
                            }
                        }
                        else {
                            if (!e.ctrlKey) {
                                for (let row of gridRows) {
                                    this.grid.unselectRow(row, false);
                                }
                            }
                            if (this.isSelected()) {
                                this.unselect();
                            }
                            else {
                                this.grid.selectRow(this, false);
                            }
                        }
                    }
                    else {
                        for (let row of this.grid.getRows()) {
                            this.grid.unselectRow(row, false);
                        }
                        this.grid.selectRow(this, false);
                    }
                    let selectedRows = this.grid.getSelectedRows();
                    this.grid.onSelectedRowsChanged.dispatch(this.grid, selectedRows);
                    if (this.grid.options.onSelectedRowsChanged) {
                        this.grid.options.onSelectedRowsChanged(this.grid, selectedRows)
                    }
                }
            });

            if (this.grid.options.rowHoverable || this.grid.hasDragAndDropEnabled()) {
                this.element.addEventListener('pointerenter', (e) => {
                    if (this.grid.options.rowHoverable) {
                        this.element.classList.add('next-admin-table-row-hover');
                    }
                    this.grid.currentHovredRow = this;
                });
                this.element.addEventListener('pointerleave', (e) => {
                    if (this.grid.options.rowHoverable) {
                        this.element.classList.remove('next-admin-table-row-hover');
                    }
                    if (this.grid.currentHovredRow == this) {
                        this.grid.currentHovredRow = null;
                    }
                });
            }

        }

        public select(addSelectStyle = true) {
            if (this._selected)
                return;
            if (addSelectStyle) {
                this.element.classList.add('next-admin-table-row-selected');
            }
            this._selected = true;
        }


        public unselect(removeSelectStyle = true) {
            if (!this._selected)
                return;
            if (removeSelectStyle && this.element.classList.contains('next-admin-table-row-selected')) {
                this.element.classList.remove('next-admin-table-row-selected');
            }
            this._selected = false;
        }


        public isSelected() {
            return this._selected;
        }


        public setData(data: any, fireChange?: boolean) {

            let cells = this.cells.where(e => e.column != this.grid.actionColumn);
            this.data = data;
            if (cells.length > 0) {
                for (let cell of cells) {
                    let cellData = data[cell.column.options.propertyName];
                    cell.setValue(cellData);
                }
            }
            else {
                for (let column of this.grid.columns) {
                    let cell = new DataGridCell_(this.grid, column, this);
                    cell.setValue(data[column.options.propertyName]);
                    this.cells.add(cell);
                    column.cells.add(cell);
                    this.element.appendChild(cell.element);
                }
            }

            if (fireChange) {
                this.grid.fireChange();
            }
        }

        public setDataPropertyValue(dataDefPropertyAction: (dataDef: T) => any, value?: any, fireChange?: boolean) {
            let propertyName = this.grid.getPropertyName(dataDefPropertyAction);
            this.data[propertyName] = value;
            let control = this.getControl(propertyName);
            if (control) {
                control.setValue(value, fireChange);
            }
        }


        public getControl(propertyName: string): UI.FormControl {
            return this.getCellByPropertyName(propertyName)?.control;
        }

        public getDataPKValue() {
            if (this.grid.datasetController == null) {
                throw new Error('unbale to get data PK value without datasetform');
            }
            return this.data[this.grid.datasetController.options.dataPrimaryKeyName];
        }


        getCellByIndex(index: number): DataGridCell_ {
            return this.cells[index];
        }

        getCellByPropertyName(name: string): DataGridCell_ {
            return this.cells.firstOrDefault(e => e.column.options.propertyName == name);
        }

    }


    export class DataGridRow_ extends DataGridRow<any> {


    }


    export class DataGridCell<T> extends Control {

        value: any;

        control?: FormControl;

        grid: DataGrid<T>;

        column: DataGridColumn;

        row: DataGridRow<T>;

        element: HTMLTableCellElement;

        propertyInfo: NextAdmin.Business.DataPropertyInfo;

        constructor(grid: DataGrid_, column: DataGridColumn, row: DataGridRow_) {
            super('td');
            this.element.classList.add('next-admin-table-cell');
            if (grid.options.rowsBordered) {
                this.element.classList.add('next-admin-table-row-border');
            }
            if (grid.options.columnsBordered) {
                this.element.classList.add('next-admin-table-col-border');
            }
            if (column?.options?.cellCss) {
                NextAdmin.Copy.copyTo(column.options.cellCss, this.element.style);
            }
            this.grid = grid;
            this.row = row;
            if (column) {
                this.column = column;
                this.propertyInfo = column.tryGetPropertyInfo();
                this.initControl();
            }
        }



        public initControl() {
            if (this.grid.options.canEdit === false) {
                return;
            }
            if (this.column.options.controlFactory != null) {
                this.setFormControl(this.column.options.controlFactory(this));
            }
            else if (this.column.options.useDefaultControl && this.propertyInfo != null) {
                let control = Helper.getDefaultPropertyFormControl(this.propertyInfo, this.grid.options.style == TableStyle.modernNoCellPadding);
                if (control != null) {
                    this.setFormControl(control);
                }
            }
        }


        public setFormControl(control: FormControl) {
            this.control = control;
            this.element.innerHTML = '';
            if (control == null)
                return;
            this.element.appendControl(control);

            if (this.propertyInfo != null) {
                this.control.setPropertyInfo(this.propertyInfo);
                if (control instanceof LabelFormControl) {
                    control.setLabel('');
                }
            }

            if (this.grid.isEnable()) {
                control.onValueChanged.subscribe((sender, args) => {
                    if (this.row.data['_state'] == NextAdmin.Business.DataState.serialized) {
                        this.row.data['_state'] = NextAdmin.Business.DataState.edited;
                    }
                    this.row.data[this.column.options.propertyName] = control.getValue();
                    this.grid.fireChange();
                    this.grid.buttonSave.enable();
                });
            }
            else {
                control.disable();
            }
        }



        public setValue(value: any, updateData?: boolean) {
            this.value = value;
            if (this.control != null) {
                if (value !== undefined) {
                    this.control.setValue(value);
                    if (this.propertyInfo?.isPrimaryKey && NextAdmin.Business.DataStateHelper.getDataState(this.row.data) != NextAdmin.Business.DataState.append) {
                        this.control.disable();
                    }
                }
            }
            else {
                this.element.innerHTML = '';
                this.element.appendChild(Helper.getDefaultPropertyHtmlElement(this.propertyInfo, value));
            }
            if (this.column.options.onRenderCell != null) {
                let elementToRender = this.column.options.onRenderCell(this, value);
                if (elementToRender) {
                    this.element.innerHTML = '';
                    if (typeof elementToRender === 'string' || elementToRender instanceof String) {
                        this.element.innerHTML = elementToRender as string;
                    }
                    else if (elementToRender instanceof HTMLElement) {
                        this.element.innerHTML = '';
                        this.element.appendChild(elementToRender);
                    }
                    else if (elementToRender instanceof Control) {
                        this.element.innerHTML = '';
                        this.element.appendControl(elementToRender);
                    }
                }
            }
            this.grid.onRenderCell.dispatch(this, value);
            if (updateData) {
                this.setData(value);
            }
        }

        public setData(value: any) {
            this.row.data[this.column.options.propertyName] = value;
        }

        public getValue(): any {
            if (this.control != null) {
                return this.control.getValue();
            }
            else {
                return this.element.innerHTML;
            }
        }

    }


    export class DataGridCell_ extends DataGridCell<any> {


    }


    export class ExportModal extends Modal {


        public constructor(grid: DataGrid_) {
            super({ size: ModalSize.smallFitContent, title: Resources.dataExportConfig });

            this.body.appendHTML('div', (container) => {
                container.style.padding = '10px';

                let formatSelect = container.appendControl(new Select({ label: Resources.format, items: [{ value: 'csv' }, { value: 'json' }] }), (select) => {
                    select.element.style.marginBottom = '10px';
                });
                let fieldNameFormatSelect = container.appendControl(new Select({ label: Resources.fieldName, items: [{ value: 'label', label: Resources.label }, { value: 'propertyName', label: Resources.realName }] }), (select) => {
                    select.element.style.marginBottom = '10px';
                });
                let valueFormatSelect = container.appendControl(new Select({ label: Resources.valueFormat, items: [{ value: 'display', label: Resources.displayValue }, { value: 'raw', label: Resources.rawValue }] }), (select) => {
                    select.element.style.marginBottom = '10px';
                });
                let columnsSelect = container.appendControl(new Select({ label: Resources.columns, items: [{ value: 'visible', label: Resources.visible }, { value: 'all', label: Resources.all }] }), (select) => {
                    select.element.style.marginBottom = '10px';
                });
                let dataSelect = container.appendControl(new Select({ label: Resources.data, items: [{ value: 'all', label: Resources.all }, { value: 'selected', label: Resources.selection }] }), (select) => {
                    select.element.style.marginBottom = '10px';
                });


                this.rightFooter.appendControl(new Button({
                    text: Resources.downloadIcon + ' ' + Resources.export, style: ButtonStyle.blue, action: () => {
                        this.close();
                        grid.exportData({
                            exportFormat: formatSelect.getValue(),
                            exportSelectedDataOnly: dataSelect.getValue() == 'selected',
                            exportVisibleColumnOnly: columnsSelect.getValue() == 'visible',
                            exportColumnsDisplayNames: fieldNameFormatSelect.getValue() == 'label',
                            exportFormatedValues: valueFormatSelect.getValue() == 'display'
                        });
                    }
                }), (btn) => {
                    btn.element.style.cssFloat = 'right';
                });

            });

        }

    }



    export class FilterGridLayout extends FormLayout_ {


        dataInfos: Array<NextAdmin.Business.DataInfo>;


        public startConfiguration(grid: DataGrid_, onChanged?: () => void) {

            this.firstRow.cells[0].appendControl(new NextAdmin.UI.Button({
                text: Resources.cogIcon + ' ' + Resources.configure, style: NextAdmin.UI.ButtonStyle.noBg, action: () => {

                    let changeGridColumnRowCountModal = new NextAdmin.UI.Modal({
                        canMinimize: false, canChangeScreenMode: false, size: NextAdmin.UI.ModalSize.smallFitContent
                    });
                    let columnCountInput = changeGridColumnRowCountModal.body.appendControl(new NextAdmin.UI.Input({ label: Resources.columnCount, value: this._columnCount, inputType: NextAdmin.UI.InputType.number }));
                    let rowCountInput = changeGridColumnRowCountModal.body.appendControl(new NextAdmin.UI.Input({ label: Resources.rowCount, value: this._rowCount, inputType: NextAdmin.UI.InputType.number }));

                    changeGridColumnRowCountModal.rightFooter.appendControl(new NextAdmin.UI.Button({
                        text: Resources.validate, style: NextAdmin.UI.ButtonStyle.green, action: () => {
                            let minColCount = this._itemsDictionary.getValues().max(e => e.col);
                            let minRowCount = this._itemsDictionary.getValues().max(e => e.row);
                            if (rowCountInput.getValue() > minRowCount) {
                                this.setRowCount(rowCountInput.getValue());
                            }
                            if (columnCountInput.getValue() > minColCount) {
                                this.setColumnCount(columnCountInput.getValue());
                            }
                            appendGridButtons();
                            changeGridColumnRowCountModal.close();
                        }
                    }), (btnOK) => {
                        btnOK.element.style.cssFloat = 'right';
                    });

                    changeGridColumnRowCountModal.open();

                }
            }), () => {
            });

            let appendAddControlButtonToCell = (cell: HTMLTableCellElement, cellKey: string) => {
                cell.appendControl(new NextAdmin.UI.Button({
                    text: '+',
                    style: NextAdmin.UI.ButtonStyle.noBg,
                    action: (button) => {

                        let appendControlModal = new Modal({
                            size: ModalSize.smallFitContent,
                            title: Resources.appendControl,
                        });
                        let container = appendControlModal.body.appendHTML('div');
                        container.style.padding = '10px';
                        let filterName = container.appendControl(new Input({ label: Resources.filterName, css: { marginBottom: '10px' } }));
                        let controlLabel = container.appendControl(new Input({ label: Resources.label, css: { marginBottom: '10px' } }));
                        let controlType = container.appendControl(new Select({ label: Resources.control, css: { marginBottom: '10px' } }));

                        controlType.addItem('NextAdmin.UI.Input/text', 'Texte');
                        controlType.addItem('NextAdmin.UI.Input/number', 'Nombre');
                        controlType.addItem('NextAdmin.UI.Input/checkbox', 'Checkbox');
                        controlType.addItem('NextAdmin.UI.Input/date', 'Date');

                        let dataInfos = grid.datasetController.getDataInfo();
                        let propertiesInfos = dataInfos.propertyInfos;
                        for (let propertyName in propertiesInfos) {
                            let propertyInfos = propertiesInfos[propertyName] as NextAdmin.Business.DataPropertyInfo;
                            if (propertyInfos.values?.length) {
                                controlType.addItem('NextAdmin.UI.Select/enum/' + dataInfos.name + '/' + propertyInfos.name, Resources.valueSelector + " : " + propertyInfos.displayName);
                                controlType.addItem('NextAdmin.UI.MultiInputSelect/enum/' + dataInfos.name + '/' + propertyInfos.name, Resources.multiValuesSelector + " : " + propertyInfos.displayName);
                            }
                        }

                        for (let dataInfo of this.dataInfos) {
                            controlType.addItem('NextAdmin.UI.DataSelect/' + dataInfo.name, Resources.dataSelector + " : " + dataInfo.displayName);
                        }

                        appendControlModal.rightFooter.appendControl(new Button({
                            text: Resources.validate, style: ButtonStyle.green, action: () => {

                                if (String.isNullOrWhiteSpace(filterName.getValue()) || String.isNullOrWhiteSpace(controlLabel.getValue()) || String.isNullOrWhiteSpace(controlType.getValue())) {
                                    NextAdmin.UI.MessageBox.createOk(Resources.error, Resources.fillAllFieldsMessage);
                                    return;
                                }

                                let col = cellKey.split(',')[0];
                                let row = cellKey.split(',')[1];
                                let controlInfo = (controlType.getValue() + '').split('/');
                                let cType = controlInfo[0];
                                if (cType == 'NextAdmin.UI.Input') {
                                    let inputType = null;
                                    switch (controlInfo[1]) {
                                        case 'text':
                                            inputType = InputType.text;
                                            break;
                                        case 'number':
                                            inputType = InputType.number;
                                            break;
                                        case 'checkbox':
                                            inputType = InputType.checkbox;
                                            break;
                                        case 'date':
                                            inputType = InputType.date;
                                            break;
                                        default:
                                    }
                                    this.addItem({
                                        col: Number(col),
                                        row: Number(row),
                                        controlType: cType,
                                        propertyName: filterName.getValue(),
                                        controlOption: {
                                            label: controlLabel.getValue(),
                                            inputType: inputType,
                                        } as InputOptions
                                    });
                                }
                                else if (cType == 'NextAdmin.UI.DataSelect') {

                                    let dataName = controlInfo[1];
                                    let dataInfo = this.dataInfos.firstOrDefault(a => a.name == dataName);

                                    this.addItem({
                                        col: Number(col),
                                        row: Number(row),
                                        controlType: cType,
                                        propertyName: filterName.getValue(),
                                        controlOption: {
                                            label: controlLabel.getValue(),
                                            dataName: controlInfo[1],
                                            displayPropertiesNames: dataInfo.displayPropertiesNames,
                                            allowNullValue: true
                                        } as DataSelectOptions
                                    });
                                }
                                else if (cType == 'NextAdmin.UI.Select') {
                                    let type = controlInfo[1];
                                    if (type == 'enum') {
                                        let dataName = controlInfo[2];
                                        let propertyName = controlInfo[3];
                                        let dataInfos = grid.datasetController.getDataInfo();
                                        let propertyInfos = dataInfos.propertyInfos[propertyName] as NextAdmin.Business.DataPropertyInfo;

                                        this.addItem({
                                            col: Number(col),
                                            row: Number(row),
                                            controlType: cType,
                                            propertyName: filterName.getValue(),
                                            controlOption: {
                                                label: controlLabel.getValue(),
                                                items: [{ label: '', value: '' } as SelectItem].addRange(propertyInfos.values)
                                            } as SelectOptions
                                        });

                                    }
                                }
                                else if (cType == 'NextAdmin.UI.MultiInputSelect') {
                                    let type = controlInfo[1];
                                    if (type == 'enum') {
                                        let dataName = controlInfo[2];
                                        let propertyName = controlInfo[3];
                                        let dataInfos = grid.datasetController.getDataInfo();
                                        let propertyInfos = dataInfos.propertyInfos[propertyName] as NextAdmin.Business.DataPropertyInfo;

                                        this.addItem({
                                            col: Number(col),
                                            row: Number(row),
                                            controlType: cType,
                                            propertyName: filterName.getValue(),
                                            controlOption: {
                                                label: controlLabel.getValue(),
                                                items: propertyInfos.values,
                                                outputArray: true,
                                                outputAllItemValuesIfNoSelect: true,
                                            } as MultiInputSelectOptions
                                        });

                                    }
                                }

                                appendControlModal.close();
                                if (onChanged != null) {
                                    onChanged();
                                }
                                cell.style.textAlign = '';
                                appendRemoveButtonToCell(cell, cellKey);
                            }
                        }), (button) => {
                            button.element.style.cssFloat = 'right';
                        });

                        appendControlModal.open();

                    }
                }), (ddButton) => {
                    cell['_addButton'] = ddButton;
                    ddButton.element.style.height = '100%';

                });
                cell.style.textAlign = 'center';
            };

            let appendRemoveButtonToCell = (cell: HTMLTableCellElement, cellKey: string) => {
                cell.style.position = 'relative';
                cell.disable();
                cell.appendControl(new NextAdmin.UI.Button({
                    text: '<b>' + Resources.removeIcon + '</b>', style: NextAdmin.UI.ButtonStyle.noBg, size: NextAdmin.UI.ButtonSize.medium,
                    action: (btn) => {
                        btn.element.remove();
                        let col = Number(cellKey.split(',')[0]);
                        let row = Number(cellKey.split(',')[1]);
                        this.removeItemByPosition(col, row);
                        cell.enable();
                        appendAddControlButtonToCell(cell, cellKey);

                    }
                }),
                    (removeCtrlButton) => {
                        cell['_removeButton'] = removeCtrlButton;
                        removeCtrlButton.element.style.color = '#ff0000';
                        removeCtrlButton.element.center();
                        removeCtrlButton.element.style.position = 'absolute';
                        removeCtrlButton.element.style.zIndex = '10';
                    });
            };

            let appendGridButtons = () => {
                for (let cell of this._cellsDictionary.getKeysValues()) {
                    if (cell.value.children.length == 0) {
                        appendAddControlButtonToCell(cell.value, cell.key);
                    }
                    else if (cell.value['_addButton'] == null) {
                        appendRemoveButtonToCell(cell.value, cell.key);
                    }
                }
            };

            appendGridButtons();

        }


    }


    export interface DeletingArgs {

        rowHandler: any;

    }

    export interface DataGridOptions<T> extends TableOptions, FormControlOptions {

        rowsBordered?: boolean;

        columnsBordered?: boolean;

        deleteMode?: DataDeleteMode;

        orderingMode?: DataOrderingMode;

        searchMode?: DataSearchMode;

        loadingMode?: DataLoadingMode;

        reorderingRowMode?: DataGridReorderingRowMode;

        additionalSearchProperties?: string[];

        orderPropertyName?: string;

        synchronizeDataWithFormModal?: boolean;

        formModalFactory?: (dataName: string, options?: DataFormModalOptions, data?: T) => DataFormModal_;

        /** if set to true, use row data instead of load data from server */
        openFormModalWithRowData?: boolean;

        datasetController?: NextAdmin.Business.DatasetController_;

        dataName?: string;

        selectDataPrimaryKey?: boolean;

        /** enable scroll loading, require datasetform and maxBody height*/
        paginItemCount?: number;

        columns?: DataGridColumnOption<T>[];

        hasActionColumn?: boolean;

        actionColumnWidth?: string;

        renderActionColumnCell?: (cell: DataGridCell<T>) => void;

        page?: Page;

        canSave?: boolean;

        canRefresh?: boolean;

        canAdd?: boolean;

        hasActionMenu?: boolean;

        hasTopBar?: boolean;

        hasHeader?: boolean;

        actionMenuItems?: MenuItem[];

        canExport?: boolean;

        canPrint?: boolean;

        canEdit?: boolean;

        enableDoubleClickOpenModal?: boolean;

        /** VIEWS */
        canSelectView?: boolean;

        canDiscoverSchema?: boolean;

        defaultViewId?: string;

        views?: GridViewOptions[];

        reports?: DataGridReportOptions[];

        openAction?: (row: DataGridRow<T>) => void;

        refreshAction?: (grid: DataGrid<T>) => void;

        addAction?: (grid: DataGrid<T>) => void;

        deleteAction?: (grid: DataGrid<T>, rows: Array<DataGridRow<T>>) => void;

        hasContextMenu?: boolean;

        onOpenContextMenu?: (grid: DataGrid<T>, args: OpenContextMenuArgs) => void;

        onFormModalCreated?: (grid: DataGrid<T>, args: { modal: DataFormModal_, data: any }) => void;

        onSelectedRowsChanged?: (grid: DataGrid<T>, args: DataGridRow<T>[]) => void;

        onUpdateWhereQuery?: (grid: DataGrid<T>, args: Business.QueryBuilder) => void;

        style?: TableStyle | any;

        displayNoDataMessage?: boolean;

        minHeight?: string;

        isAutoLoaded?: boolean;

        buttonAddText?: string;

    }


    export interface DataGridOptions_ extends DataGridOptions<any> {



    }


    export interface DataGridViewColumnOptions {

        label?: string;

        propertyName?: string;

        selectQuery?: string;

        useDefaultControl?: boolean;

        width?: string;

        maxWidth?: string;

        minWidth?: string;

        cellCss?: CssDeclaration;

        headerCss?: CssDeclaration;

        toolTip?: string;

        defaultOrdering?: ColumnOrdering;

        queryable?: boolean;

        hidden?: boolean;

        searchable?: boolean;

        customDrawCellScript?: string;

        /** Allow user to change row order */
        orderable?: boolean;

    }

    export interface DataGridColumnOption<T> extends DataGridViewColumnOptions {

        controlFactory?: (cell: DataGridCell<T>) => FormControl;

        onRenderCell?: (cell: DataGridCell<T>, value: any) => string | Control | HTMLElement | void;

        orderingFunc?: (rowData: T, dataset: Array<T>) => number | string;

    }

    export interface DataGridColumnOptions_ extends DataGridColumnOption<any> {

    }


    export interface ActionToolbarOptions {

        hasDeleteButton?: boolean;

        hasOrderingButtons?: boolean;

        hasOpenModalButton?: boolean;

        hasDragAndDropHandle?: boolean;
    }



    export interface GridViewOptions {

        name: string;

        id: string;

        displayOrder?: number;

        isUserView?: boolean;

        orderPropertyName?: string;

        columns: DataGridViewColumnOptions[];

        filters?: FormLayoutItem[];

        filterQuery?: string;

        filterQueryValues?: any[];

    }

    export enum ColumnOrdering {
        ascending,
        descending
    }


    export interface OrderingColumnInfo {

        column: DataGridColumn;

        ordering: ColumnOrdering;

    }

    export enum DataDeleteMode {
        disabled,
        local,//row is removed, but will be deleted at next save
        server//Prompt user and send to server delete query
    }

    export enum DataOrderingMode {
        disabled,
        local,
        server//Prompt user and send to server delete query
    }


    export enum DataSearchMode {
        disabled,
        local,
        server
    }

    export enum DataLoadingMode {
        disabled,
        query,
        rawData,
    }

    export enum DataGridReorderingRowMode {
        buttons,
        dragAndDropHandle,
        all
    }


    export interface DataGridExportOptions {

        exportFormat?: string;

        exportSelectedDataOnly?: boolean;

        exportVisibleColumnOnly?: boolean;

        exportColumnsDisplayNames?: boolean;

        exportFormatedValues?: boolean;


    }


    export interface DataGridPrintOptions {

        dataset?: Array<any>;

        useControlDisplayValue?: boolean;

    }

    export interface DataGridReportOptions {

        label: string;

        action?: (grid: DataGrid_, dataPrimaryKeys: any[]) => void


    }

    export interface OpenContextMenuArgs {
        selectedDataRows: DataGridRow_[];
        selectedRows: DataGridRow_[];
        event: MouseEvent;
        dropDownMenu: DropDownMenu;
        isOnlyDataRowSelected: boolean;
    }

    export interface DataGridLoadOptions {

        updateOnlyIfDataChanged?: boolean;

        tryPreserveSelectionAndScroll?: boolean;

        updateQuery?: boolean;

        fireChange?: boolean;

        onPreparDataset?: (dataset?: Array<any>) => Array<any>;
    }

}