
namespace NextAdmin.Business {


    export class QueryBuilder {

        public query: Models.Query;

        public writeQueryMode?: WriteQueryMode;

        public constructor(query?: Models.Query, writeQueryMode?: WriteQueryMode) {
            this.query = query ?? {};
            this.writeQueryMode = writeQueryMode;
        }

        clone(): QueryBuilder {
            return new QueryBuilder(NextAdmin.Copy.clone(this.query), this.writeQueryMode);
        }

        orderBy(...fields: Array<string>): QueryBuilder {
            let _this = this.writeQueryMode == WriteQueryMode.keepOriginalQuery ? this : this.clone();
            if (_this.query.orderColumnNames?.length) {
                _this.query.orderColumnNames.addRange(fields);
            }
            else {
                _this.query.orderColumnNames = fields;
            }
            return _this;
        }

        skip(n: number): QueryBuilder {
            let _this = this.writeQueryMode == WriteQueryMode.keepOriginalQuery ? this : this.clone();
            _this.query.skipRecordCount = n;
            return _this;
        }

        take(n: number): QueryBuilder {
            let _this = this.writeQueryMode == WriteQueryMode.keepOriginalQuery ? this : this.clone();
            _this.query.takeRecordCount = n;
            return _this;
        }

        select(...fields: Array<string>): QueryBuilder {
            let _this = this.writeQueryMode == WriteQueryMode.keepOriginalQuery ? this : this.clone();
            if (_this.query.columnToSelectNames?.length) {
                _this.query.columnToSelectNames.addRange(fields);
            }
            else {
                _this.query.columnToSelectNames = fields;
            }
            return _this;
        }

        distinct(value = true): QueryBuilder {
            let _this = this.writeQueryMode == WriteQueryMode.keepOriginalQuery ? this : this.clone();
            _this.query.isSelectDistinctQuery = value;
            return _this;
        }

        where(query: string, ...args: Array<any>): QueryBuilder {
            let _this = this.writeQueryMode == WriteQueryMode.keepOriginalQuery ? this : this.clone();
            
            if (NextAdmin.String.isNullOrWhiteSpace(_this.query.whereQuery)) {
                _this.query.whereQuery = query;
            }
            else {
                _this.query.whereQuery = '(' + _this.query.whereQuery + ')' + ' AND ' + query;
            }

            if (_this.query.whereQueryArgs == null) {
                _this.query.whereQueryArgs = [];
            }
            for (let arg of args) {
                _this.query.whereQueryArgs.add(arg);
            }
            return _this;
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

    }

    export enum SearchManyMode {
        and,
        or,
    }


    export enum WriteQueryMode {
        instanciateNewQueryPerCommand,
        keepOriginalQuery
    }

}