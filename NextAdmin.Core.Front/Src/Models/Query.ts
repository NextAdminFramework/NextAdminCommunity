
namespace NextAdmin.Models {


    export interface Query {

        whereQuery?: string;

        whereQueryArgs?: Array<any>;

        columnToSelectNames?: Array<string>;

        isSelectDistinctQuery?: boolean;

        orderColumnNames?: Array<any>;

        skipRecordCount?: number;

        takeRecordCount?: number;

    }
}