
namespace NextAdmin.Models {


    export interface Query {

        whereQuery?: string;

        whereQueryArgs?: Array<any>;

        selectQueries?: Array<string>;

        isSelectDistinctQuery?: boolean;

        orderByQueries?: Array<any>;

        skipRecordCount?: number;

        takeRecordCount?: number;

    }
}