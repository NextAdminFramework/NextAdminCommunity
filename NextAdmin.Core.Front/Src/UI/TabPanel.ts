/// <reference path="StretchLayout.ts" />


namespace NextAdmin.UI {


    export class TabPanel extends StretchLayout {

        public static defaultStyle?: TabPanelStyle;

        public options: TabPanelOptions;

        public tabs = new Dictionary<Tab>();

        public tabsButtonsBar: Toolbar;

        public onActivTabChange = new EventHandler<TabPanel, TabChangeEventArgs>();

        public onActivTabChanged = new EventHandler<TabPanel, TabEventArgs>();

        public static onCreated = new EventHandler<TabPanel, TabPanelOptions>();

        public static style = `

            .next-admin-tab-panel-body{
                background:rgba(255,255,255,1)
            }
            .next-admin-tab-panel-header{
                border-bottom:1px solid #ccc;
                padding-left:10px;
            }

            .next-admin-tab-panel-body .next-admin-panel-header{
                border-radius:0px;
                border-top:0px;
                border-left:0px;
                border-right:0px;
            } 
            .next-admin-tab-panel-body .next-admin-panel-footer{
                border-radius:0px;
                border-bottom:0px;
                border-left:0px;
                border-right:0px;
            } 
            .next-admin-tab-panel-body .next-admin-panel-body{
                border-left:0px;
                border-right:0px;border-bottom:0px
            }
            .next-admin-tab-panel-header {
                .next-admin-activ-tab-button{
                    text-shadow:0px 0px 2px rgba(0,0,0,0.2);
                    color:#105ABE;
                }
            }
            .next-admin-tab-panel-header {
                .toolbar-cell{
                    padding:6px;
                }
            }
         
            `;

        constructor(options?: TabPanelOptions) {
            super({
                style: TabPanel.defaultStyle,
                ...options
            } as TabPanelOptions);

            Style.append('TabPanel', TabPanel.style);
            if (this.options.activTabName == null && this.options.tabs != null && this.options.tabs.length > 0) {
                this.options.activTabName = this.options.tabs[0].name;
            }
            this.fixedContainer.classList.add('next-admin-tab-panel-header');
            this.stretchContainer.classList.add('next-admin-tab-panel-body');
            this.fixedContainer.appendControl(new ScrollableHorizontalBar({ displayArrowsAbsolute: true, scrollOffset: 100, autoUpdateButtonsArrowsState: true }), (shb) => {
                this.tabsButtonsBar = shb.appendControl(new Toolbar());
            });

            if (this.options.tabs != null) {
                for (let tab of this.options.tabs) {
                    this.addTab(tab);
                }
            }
            if (this.options.activTabName != null) {
                this.setActiveTab(this.options.activTabName);
            }
            this.setStyle(this.options.style);
            TabPanel.onCreated.dispatch(this, this.options);
        }

        public setStyle(style?: TabPanelStyle) {
            switch (style) {
                default:
                case TabPanelStyle.default:
                    this.element.classList.add('next-admin-tab-panel-default');
                    break;
                case TabPanelStyle.modern:
                    this.element.classList.add('next-admin-tab-panel-modern');
                    break;
            }
        }


        public addTab(tabOptionOrLabel: TabOptions | string, configAction?: (tab: Tab) => void): Tab {
            let tabOption = typeof (tabOptionOrLabel) === 'string' ? {
                name: tabOptionOrLabel,
            } as TabOptions : tabOptionOrLabel;
            if (tabOption.label == null) {
                tabOption.label = tabOption.name;
            }
            let tab = new Tab(this, tabOption);
            if (!this.tabs.tryAdd(tabOption.name, tab)) {
                return null;
            }
            
            if (tabOption.index == null) {
                this.tabsButtonsBar.appendControl(tab.button);
                tab.options.index = this.tabsButtonsBar.row.getChildrenElements().length;
            }
            else {
                let exustingTab = this.tabs.getValues().where(a => a.name != tabOption.name).orderBy(a => a.options.index).firstOrDefault(a => a.options.index >= tabOption.index);
                if (exustingTab != null) {
                    let existingTabButtonIndex = this.tabsButtonsBar.row.getChildrenElements().indexOf(exustingTab.button.element.parentElement);
                    this.tabsButtonsBar.insertControl(tab.button, existingTabButtonIndex);
                }
                else {
                    this.tabsButtonsBar.appendControl(tab.button);
                }
            }
            this.stretchContainer.appendChild(tab.element);
            if (this.getActiveTab() == null || tabOption.active) {
                this.setActiveTab(tabOption.name);
            }
            if (configAction) {
                configAction(tab);
            }
            return tab;
        }

        hideTab(tabName: string) {
            let tab = this.getTab(tabName);
            if (tab) {
                tab.button.element.parentElement.style.display = 'none';
                if (this.getActiveTab() == tab) {
                    let otherTab = this.tabs.getValues().where(a => a != tab && a.button.element.parentElement.style.display != 'none').orderBy(a => a.options.index).firstOrDefault();
                    if (otherTab) {
                        this.setActiveTab(otherTab.name);
                    }
                }
            }
        }

        displayTab(tabName: string) {
            let tab = this.getTab(tabName);
            if (tab) {
                tab.button.element.parentElement.style.display = '';
            }
        }

        public removeTab(tabName: string) {
            let tab = this.tabs.get(tabName);
            if (tab == null)
                return;
            if (this.getActiveTab() == tab) {
                let nextTab = this.tabs.getValues().orderBy(e => e.options.index).firstOrDefault(e => e.name != tab.name);
                if (nextTab != null) {
                    this.setActiveTab(nextTab.name);
                }
            }
            this.tabsButtonsBar.removeControl(tab.button);
            tab.body.remove();
            this.tabs.remove(tabName);
        }


        public clearTabs() {
            for (let tab of this.tabs.getValues()) {
                this.removeTab(tab.name);
            }
        }

        public setActiveTab(tabName: string) {
            let previousTab = this.getActiveTab();
            let tab = this.tabs.get(tabName);
            if (tab == null) {
                throw new Error('Invalid tab name : ' + tabName);
            }
            if (tab.isActiv) {
                return;
            }
            let tabChangedArgs = {
                newTab: tab,
                previousTab: previousTab,
                cancel: false
            } as TabChangeEventArgs;

            this.onActivTabChange.dispatch(this, tabChangedArgs);

            if (tabChangedArgs.cancel) {
                return;
            }

            for (let otherTab of this.tabs.getValues().where(e => e !== tab)) {
                otherTab.body.style.display = 'none';
                otherTab.isActiv = false;
                otherTab.button.element.classList.remove('next-admin-activ-tab-button');
            }
            tab.body.style.display = '';
            tab.button.element.classList.add('next-admin-activ-tab-button');
            tab.isActiv = true;

            this.onActivTabChanged.dispatch(this, tabChangedArgs);
        }

        public getActiveTab() {
            return this.tabs.getValues().firstOrDefault(e => e.isActiv == true);
        }


        public getTab(tabName: string): Tab {
            return this.tabs.get(tabName);
        }

        public findElementParentTab(element: HTMLElement): Tab {
            while (element != this.element && element != null) {
                element = element.parentElement;
                for (let tab of this.tabs.getValues()) {
                    if (element == tab.body) {
                        return tab;
                    }
                }
            }
        }

    }


    export class Tab extends NextAdmin.UI.Control {

        button: Button;

        body: HTMLDivElement;

        isActiv: boolean;

        name: string;

        options: TabOptions;

        tabPanel: TabPanel;



        constructor(tabPanel: TabPanel, options?: TabOptions) {
            super('div', {
                style: TabPanel.defaultStyle,
                ...options
            } as TabOptions);
            this.name = this.options.name;
            this.tabPanel = tabPanel;
            this.body = this.element as HTMLDivElement;
            this.body.style.display = 'none';
            if (this.tabPanel.options.stretch) {
                this.body.style.height = '100%';
            }

            this.button = new Button({
                text: this.options.label,
                style: ButtonStyle.noBg,
                action: () => {
                    this.tabPanel.setActiveTab(this.options.name);
                }
            });


        }


    }





    export interface TabPanelOptions extends StretchLayoutOptions {

        tabs?: Array<TabOptions>;

        activTabName?: string;

        style?: TabPanelStyle | any;
    }


    export interface TabOptions extends ControlOptions {

        label?: string;

        name: string;

        active?: boolean;

        index?: number;


    }

    export interface TabChangeEventArgs extends TabEventArgs {

        cancel: boolean;
    }

    export interface TabEventArgs {

        previousTab?: Tab;

        newTab: Tab;
    }

    export enum TabPanelStyle {
        default,
        modern
    }
}