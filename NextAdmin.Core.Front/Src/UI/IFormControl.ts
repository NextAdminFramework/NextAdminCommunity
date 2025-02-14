
namespace NextAdmin.UI {


    export interface IFormControl extends IControl {

        setValue(value: any, fireChange?: boolean);

        getValue(): any;

        setLabel(caption: string);

        getLabel(): string;

        setError(error: string | Array<NextAdmin.Business.DataError>);

        setTooltip(message?: string);

        getToolTip(): string;

        enable();

        disable();

        isEnable(): boolean;

        onValueChanged: EventHandler<IFormControl, ValueChangeEventArgs>;

        setDataController(form: NextAdmin.Business.DataController_, propertyName: string);

        setPropertyInfo(propertyInfo?: NextAdmin.Business.DataPropertyInfo);

        getPropertyInfo(): NextAdmin.Business.DataPropertyInfo;

        getBindedPropertyName(): string;
    }


    export interface ValueChangeEventArgs {

        previousValue?: any;

        value?: any;

        origin?: ChangeOrigin;

    }


    export interface ValueChangingEventArgs {

        previousValue?: any;

        newValue?: any;

        cancel?: boolean;

    }


    export enum ChangeOrigin {
        user,
        code
    }



}