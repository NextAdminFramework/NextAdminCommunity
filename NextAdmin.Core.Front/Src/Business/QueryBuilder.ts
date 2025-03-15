
namespace NextAdmin.Business {


    export class QueryBuilder {

        public query: Models.Query;

        public writeIntoOriginalQuery?: boolean;

        public constructor(query?: Models.Query, writeIntoOriginalQuery?: boolean) {
            this.writeIntoOriginalQuery = writeIntoOriginalQuery;
            if (query) {
                this.query = writeIntoOriginalQuery ? query : { ...query };
            }
            else {
                this.query = {};
            }
        }

        select(...fields: Array<string>): QueryBuilder {
            let clone = this.clone();
            if (clone.query.columnToSelectNames?.length) {
                clone.query.columnToSelectNames.addRange(fields);
            }
            else {
                clone.query.columnToSelectNames = fields;
            }
            return clone;
        }

        distinct(value = true): QueryBuilder {
            let clone = this.clone();
            clone.query.isSelectDistinctQuery = value;
            return clone;
        }

        where(query: string, ...args: Array<any>): QueryBuilder {
            let clone = this.clone();
            
            if (NextAdmin.String.isNullOrWhiteSpace(clone.query.whereQuery)) {
                clone.query.whereQuery = query;
            }
            else {
                clone.query.whereQuery = '(' + clone.query.whereQuery + ')' + ' AND ' + query;
            }

            if (clone.query.whereQueryArgs == null) {
                clone.query.whereQueryArgs = [];
            }
            for (let arg of args) {
                clone.query.whereQueryArgs.add(arg);
            }
            return clone;
        }

        whereIn(clumn: string, ...args: Array<any>): QueryBuilder {
            return this.where(clumn + ' IN(' + args.select(a => '?').join(',') + ')', ...args);
        }

        whereNotIn(clumn: string, ...args: Array<any>): QueryBuilder {
            return this.where(clumn + ' NOT IN(' + args.select(a => '?').join(',') + ')', ...args);
        }

        search(search: string, ...clumns: string[]): QueryBuilder {
            if (String.isNullOrEmpty(search) || !clumns?.length) {
                return this;
            }
            let values = [];
            let queryPart = [];
            for (let columns of clumns) {
                queryPart.add('LOWER(' + columns + ')' + ' LIKE LOWER(?)');
                values.add('%' + search + '%');
            }
            return this.where('(' + queryPart.join(' OR ') + ')', ...values);
        }

        searchMany(searches: string[], clumns: string[], mode = SearchManyMode.and): QueryBuilder {
            if (!searches?.length || !clumns?.length) {
                return this;
            }
            let query = '';
            let args = [];
            for (let search of searches) {
                if (search == '' || search == '')
                    continue;
                let queryPart = [];
                for (let columns of clumns) {
                    queryPart.add('LOWER(' + columns + ')' + ' LIKE LOWER(?)');
                    args.add('%' + search + '%');
                }
                query += (!NextAdmin.String.isNullOrEmpty(query) ? (mode == SearchManyMode.and ? ' AND ' : ' OR ') : '') + '(' + queryPart.join(' OR ') + ')';
            }
            return this.where('(' + query + ')', args);
        }


        whereContains(clumn: string, search: string, invariantCase?: boolean): QueryBuilder {
            if (invariantCase) {
                return this.where('LOWER(' + clumn + ')' + ' LIKE LOWER(?)', '%' + search + '%');
            }
            else {
                return this.where(clumn + ' LIKE ?', '%' + search + '%');
            }
        }

        whereNotContains(clumn: string, search: string, invariantCase?: boolean): QueryBuilder {
            if (invariantCase) {
                return this.where('LOWER(' + clumn + ')' + ' NOT LIKE LOWER(?)', '%' + search + '%');
            }
            else {
                return this.where(clumn + ' NOT LIKE ?', '%' + search + '%');
            }
        }

        whereStartsWith(clumn: string, search: string, invariantCase?: boolean): QueryBuilder {
            if (invariantCase) {
                return this.where('LOWER(' + clumn + ')' + ' LIKE LOWER(?)', search + '%');
            }
            else {
                return this.where(clumn + ' LIKE ?', search + '%');
            }
        }

        whereEndsWith(clumn: string, search: string, invariantCase?: boolean): QueryBuilder {
            if (invariantCase) {
                return this.where('LOWER(' + clumn + ')' + ' LIKE LOWER(?)', '%' + search);
            }
            else {
                return this.where(clumn + ' LIKE ?', '%' + search);
            }
        }

        whereIsNullOrEmpty(clumn: string): QueryBuilder {
            return this.where(clumn + ' IS NULL OR ' + clumn + ' = ?', '');
        }

        whereIsNotNullOrEmpty(clumn: string): QueryBuilder {
            return this.where(clumn + ' IS NOT NULL AND ' + clumn + ' != ?', '');
        }


        orderBy(...fields: Array<string>): QueryBuilder {
            let clone = this.clone();
            if (clone.query.orderColumnNames?.length) {
                clone.query.orderColumnNames.addRange(fields);
            }
            else {
                clone.query.orderColumnNames = fields;
            }
            return clone;
        }

        skip(n: number): QueryBuilder {
            let clone = this.clone();
            clone.query.skipRecordCount = n;
            return clone;
        }

        take(n: number): QueryBuilder {
            let clone = this.clone();
            clone.query.takeRecordCount = n;
            return clone;
        }

        clone(): QueryBuilder {
            return new QueryBuilder(this.query, this.writeIntoOriginalQuery);
        }
    }

    export enum SearchManyMode {
        and,
        or,
    }

}