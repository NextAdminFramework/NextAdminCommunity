
namespace NextAdmin.UI {


    export interface IControl {

        element: HTMLElement;

        enable();

        disable();

        startSpin();

        stopSpin();

    }


    export interface IDatasetControl<TData> extends IControl {

        getDataset(): Array<TData>;

    }


    export interface IDatasetItemControl<TData> extends IControl {

        data?: TData;

    }




    export interface IActionControl extends IControl {

        element: HTMLElement;

        action: (control: IActionControl) => void;

    }

}