namespace NextAdmin.UI {
    export interface IForm extends IControl {

        saveButton?: UI.Button;

        deleteButton?: UI.Button;

        cancelButton?: UI.Button; 

        startSpin();

        stopSpin();

        enableReadOnly();

        disableReadOnly();

    }
}