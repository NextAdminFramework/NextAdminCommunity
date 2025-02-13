class AdminUserPage extends NextAdmin.UI.Page {

    public static pageName = 'adminUsers';

    grid: NextAdmin.UI.DataGrid<Models.AdminUser>;

    constructor(pageOption?: NextAdmin.UI.PageOptions) {
        super({
            clearOnLeave: false,
            css: { height: '100%' },
            ...pageOption
        });
        this.element.appendControl(new NextAdmin.UI.Panel(), (panel) => {
            panel.leftHeader.innerHTML = Resources.adminUsers;
            let userInfo = AdminApp.getEntityInfo<Models.AdminUser>(EntityNames.AdminUser);
            this.grid = panel.body.appendControl(new NextAdmin.UI.DataGrid({
                dataName: userInfo.name,
                deleteMode: NextAdmin.UI.DataDeleteMode.server,
                searchMode: NextAdmin.UI.DataSearchMode.server,
                rowSelectionMode: NextAdmin.UI.RowSelectionMode.multiSelect_CtrlShift,
                rowHoverable: true,
                paginItemCount: 200,
                canSave: false,
                formModalFactory: (dataName, option) => NextAdmin.UI.DataFormModal.createUnique(AdminUserModal.name, option),
                columns: [
                    { propertyName: userInfo.getPropertyName(a => a.userName), defaultOrdering: NextAdmin.UI.ColumnOrdering.ascending },
                    { propertyName: userInfo.getPropertyName(a => a.creationDate), width: '160px' },
                    { propertyName: userInfo.getPropertyName(a => a.culture), width: '80px' },
                    { propertyName: userInfo.getPropertyName(a => a.disabled), width: '140px' },
                ]
            }));
        });
    }

    async navigateTo(args: NextAdmin.UI.NavigateToArgs) {
        await super.navigateTo(args);
        this.grid.load({
            updateOnlyIfDataChanged: true,
            tryPreserveSelectionAndScroll: true
        });
    }
}