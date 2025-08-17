namespace NextAdmin.Models {

    export interface User {
        id: string;
        userName: string;
        culture?: string;
        password?: string;
    }
}