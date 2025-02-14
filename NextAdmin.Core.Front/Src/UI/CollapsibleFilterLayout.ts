
namespace NextAdmin.UI {


    export class CollapsibleFilterLayout<T> extends NextAdmin.UI.Control {


        options: CollapsibleFilterLayoutOptions;

        collapsible: Collapsible;

        formLayout: FormLayout_;

        grid: DataGrid<T>;

        timer = new NextAdmin.Timer();

        public constructor(options?: CollapsibleFilterLayoutOptions) {
            super('div', {
                throttle: 50,
                title: NextAdmin.Resources.searchIcon + ' ' + NextAdmin.Resources.filters,
                ...options
            } as CollapsibleFilterLayoutOptions);
            this.element.style.paddingTop = '6px';
            this.element.style.paddingLeft = '6px';
            this.element.style.paddingRight = '6px';
            this.element.appendControl(new Collapsible({ title: this.options.title, isOpen: this.options.isOpen }), (collapsible) => {
                collapsible.header.style.color = '#105ABE';
                collapsible.header.style.borderBottom = '1px solid #eee';
                collapsible.body.style.paddingTop = '0px';
                this.formLayout = collapsible.body.appendControl(new FormLayout_());
                if (this.options.items) {
                    for (let item of this.options.items) {
                        this.addItem(item);
                    }
                }
            });
            if (this.options.grid) {
                this.grid = this.options.grid;
                this.grid.onUpdateWhereQuery.subscribe((sender, gridQueryBuilder) => {
                    let resultQueryBuilder = this.updateQuery(gridQueryBuilder);
                    if (resultQueryBuilder) {
                        NextAdmin.Copy.copyTo(resultQueryBuilder, gridQueryBuilder);
                    }
                });

            }
        }

        addView(viewName: string, items?: Array<FormLayoutViewItem>, active?: boolean): FormLayoutView {
            return this.formLayout.addView(viewName, items, active);
        }

        addItem<TElement extends Control | HTMLElement>(item: FormLayoutControlItem<TElement>): TElement {
            let control = this.formLayout.addItem(item);
            if (control instanceof FormControl) {
                control.onValueChanged.subscribe(() => {
                    this.timer.throttle(() => {
                        if (this.grid) {
                            this.grid.updateWhereQuery();
                            this.grid.datasetController.load();
                        }
                    }, this.options.throttle);
                });
            }
            return control;
        }

        updateQuery(queryBuilder: Business.QueryBuilder): Business.QueryBuilder {
            if (this.options.onUpdateQuery) {
                queryBuilder = this.options.onUpdateQuery(queryBuilder);
            }
            return queryBuilder;
        }

    }

    export interface CollapsibleFilterLayoutOptions extends ControlOptions {

        throttle?: number;

        grid?: DataGrid_;

        items?: Array<FormLayoutControlItem<any>>;

        title?: string;

        isOpen?: boolean;

        onUpdateQuery?: (queryBuilder: Business.QueryBuilder) => Business.QueryBuilder;

    }


}