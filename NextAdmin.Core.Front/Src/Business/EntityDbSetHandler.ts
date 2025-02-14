/// <reference path="QueryBuilder.ts"/>


namespace NextAdmin.Business {

    export class DbSetHandler<TEntity extends {}> extends QueryBuilder {

        entityName: string;

        entityClient: Services.EntityClient;

        public constructor(entityName: string, entityClient: Services.EntityClient, queryData?: Models.Query) {
            super(queryData);
            this.entityName = entityName;
            this.entityClient = entityClient;
        }

        select(...fields: Array<string>): DbSetHandler<TEntity> {
            return super.select(...fields) as DbSetHandler<TEntity>;
        }

        distinct(value = true) {
            return super.distinct(value) as DbSetHandler<TEntity>;
        }

        where(query: string, ...args: Array<any>): DbSetHandler<TEntity> {
            return super.where(query, ...args) as DbSetHandler<TEntity>;
        }

        whereIn(clumn: string, ...args: Array<any>): DbSetHandler<TEntity> {
            return super.whereIn(clumn, ...args) as DbSetHandler<TEntity>;
        }

        whereNotIn(clumn: string, ...args: Array<any>): DbSetHandler<TEntity> {
            return super.whereNotIn(clumn, ...args) as DbSetHandler<TEntity>;
        }

        search(search: string, ...clumns: string[]): DbSetHandler<TEntity> {
            return super.search(search, ...clumns) as DbSetHandler<TEntity>;
        }

        searchMany(searches: string[], clumns: string[], mode = SearchManyMode.and): DbSetHandler<TEntity> {
            return super.searchMany(searches, clumns, mode) as DbSetHandler<TEntity>;
        }

        orderBy(...fields: Array<string>): DbSetHandler<TEntity> {
            return super.orderBy(...fields) as DbSetHandler<TEntity>;
        }

        skip(n: number): DbSetHandler<TEntity> {
            return super.skip(n) as DbSetHandler<TEntity>;
        }

        take(n: number): DbSetHandler<TEntity> {
            return super.take(n) as DbSetHandler<TEntity>;
        }

        clone(): DbSetHandler<TEntity> {
            let clone = new DbSetHandler<TEntity>(this.entityName, this.entityClient);
            NextAdmin.Copy.copyTo(this, clone);
            return clone;
        }

        async toArray(parameters?: Record<string, any>): Promise<Array<TEntity>> {
            let result = await this.entityClient.getEntities({
                entityName: this.entityName,
                skipRecordCount: this.query.skipRecordCount,
                takeRecordCount: this.query.takeRecordCount,
                whereQuery: this.query.whereQuery,
                whereQueryArgs: this.query.whereQueryArgs,
                columnToSelectNames: this.query.columnToSelectNames,
                orderColumnNames: this.query.orderColumnNames,
                isSelectDistinctQuery: this.query.isSelectDistinctQuery,
                parameters: parameters
            });
            return result.entities;
        }

        async first(parameters?: Record<string, any>): Promise<TEntity> {
            let result = await this.entityClient.getEntities({
                entityName: this.entityName,
                skipRecordCount: this.query.skipRecordCount,
                takeRecordCount: 1,
                whereQuery: this.query.whereQuery,
                whereQueryArgs: this.query.whereQueryArgs,
                columnToSelectNames: this.query.columnToSelectNames,
                orderColumnNames: this.query.orderColumnNames,
                parameters: parameters
            });
            if (result.entities != null && result.entities.length > 0) {
                return result.entities[0];
            }
            return null;
        }

        async addOrUpdate(entity: TEntity | any, parameters?: Record<string, any>): Promise<NextAdmin.Models.SaveEntityResponse<TEntity>> {
            return await this.entityClient.saveEntity({ entityName: this.entityName, entity: entity, parameters: parameters });
        }

        async addOrUpdateRange(entities: Array<TEntity | any>, parameters?: Record<string, any>): Promise<NextAdmin.Models.SaveEntitiesResponse<TEntity>> {
            return await this.entityClient.saveEntities({ entityName: this.entityName, entitiesToAddOrUpdate: entities, parameters: parameters });
        }


        async create(parameters?: Record<string, any>): Promise<TEntity> {
            return (await this.entityClient.createEntity({ entityName: this.entityName, parameters: parameters })).entity;
        }

        async delete(id?: any, parameters?: Record<string, any>): Promise<NextAdmin.Models.UpdateEntitiesResponse> {
            return await this.entityClient.deleteEntity({ entityName: this.entityName, entityId: id, parameters: parameters });
        }

        async deleteRange(ids?: Array<any>, parameters?: Record<string, any>): Promise<NextAdmin.Models.SaveEntitiesResponse<TEntity>> {
            return await this.entityClient.saveEntities({ entityName: this.entityName, entitiesToDeleteIds: ids, parameters: parameters });
        }

        async get(id?: any, parameters?: Record<string, any>): Promise<TEntity> {
            if (id == null)
                return null;
            return (await this.entityClient.getEntity({ entityName: this.entityName, entityId: id, parameters: parameters })).entity;
        }

        async count(): Promise<number> {
            return (await this.entityClient.countEntities({ entityName: this.entityName, skipRecordCount: this.query.skipRecordCount, takeRecordCount: this.query.takeRecordCount, whereQuery: this.query.whereQuery, whereQueryArgs: this.query.whereQueryArgs, columnToSelectNames: this.query.columnToSelectNames, orderColumnNames: this.query.orderColumnNames })).data;
        }

        async sum(member: string): Promise<number> {
            return (await this.entityClient.sumEntities({ entityName: this.entityName, skipRecordCount: this.query.skipRecordCount, takeRecordCount: this.query.takeRecordCount, whereQuery: this.query.whereQuery, whereQueryArgs: this.query.whereQueryArgs, columnToSelectNames: this.query.columnToSelectNames, orderColumnNames: this.query.orderColumnNames })).data;
        }

        async min(propertyName?: string): Promise<number> {
            return (await this.entityClient.minEntities({ entityName: this.entityName, skipRecordCount: this.query.skipRecordCount, takeRecordCount: this.query.takeRecordCount, whereQuery: this.query.whereQuery, whereQueryArgs: this.query.whereQueryArgs, columnToSelectNames: propertyName ? [propertyName] : this.query.columnToSelectNames, orderColumnNames: this.query.orderColumnNames })).data;
        }

        async max(propertyName?: string): Promise<number> {
            return (await this.entityClient.maxEntities({ entityName: this.entityName, skipRecordCount: this.query.skipRecordCount, takeRecordCount: this.query.takeRecordCount, whereQuery: this.query.whereQuery, whereQueryArgs: this.query.whereQueryArgs, columnToSelectNames: propertyName ? [propertyName] : this.query.columnToSelectNames, orderColumnNames: this.query.orderColumnNames })).data;
        }
    }



    export class EntityDbSetHandler<TEntity> extends DbSetHandler<TEntity> {

        entityInfo: EntityInfo<TEntity>;

        public constructor(entityInfo: EntityInfo_, entityClient: Services.EntityClient, query?: Models.Query) {
            super(entityInfo.name, entityClient, query);
            this.entityInfo = entityInfo;
        }

        clone(): EntityDbSetHandler<TEntity> {
            let clone = new EntityDbSetHandler<TEntity>(this.entityInfo, this.entityClient);
            NextAdmin.Copy.copyTo(this, clone);
            return clone;
        }

        getPropertyName(dataDefPropertyAction: (dataDef: TEntity) => any): any {
            return this.entityInfo.getPropertyName(dataDefPropertyAction);
        }

        async toArray_<TProp>(property: (dataDef: TEntity) => TProp, parameters?: Record<string, any>): Promise<Array<TProp>> {
            let entities = await this.toArray(parameters);
            if (!entities?.length) {
                return null;
            }
            let propertyName = this.entityInfo.getPropertyName(property);
            return entities.select(a => a[propertyName]);
        }

        async first_<TProp>(property: (dataDef: TEntity) => TProp, parameters?: Record<string, any>): Promise<TProp> {
            let entity = await this.first(parameters);
            if (entity == null) {
                return null;
            }
            return entity[this.entityInfo.getPropertyName(property)];
        }

        select(...fields: Array<string>): EntityDbSetHandler<TEntity> {
            return super.select(...fields) as EntityDbSetHandler<TEntity>;
        }

        distinct(value = true) {
            return super.distinct(value) as EntityDbSetHandler<TEntity>;
        }

        where(query: string, ...args: Array<any>): EntityDbSetHandler<TEntity> {
            return super.where(query, ...args) as EntityDbSetHandler<TEntity>;
        }

        orderBy(...fields: Array<string>): EntityDbSetHandler<TEntity> {
            return super.orderBy(...fields) as EntityDbSetHandler<TEntity>;
        }

        skip(n: number): EntityDbSetHandler<TEntity> {
            return super.skip(n) as EntityDbSetHandler<TEntity>;
        }

        take(n: number): EntityDbSetHandler<TEntity> {
            return super.take(n) as EntityDbSetHandler<TEntity>;
        }

        where_(property: (dataDef: TEntity) => any, operator: string, value?: any): EntityDbSetHandler<TEntity> {
            return super.where(this.entityInfo.getPropertyName(property) + ' ' + operator + ' ?', value) as EntityDbSetHandler<TEntity>;
        }

        whereIn_(property: (dataDef: TEntity) => any, ...args: Array<any>): EntityDbSetHandler<TEntity> {
            return super.whereIn(this.entityInfo.getPropertyName(property), ...args) as EntityDbSetHandler<TEntity>;
        }

        whereNotIn_(property: (dataDef: TEntity) => any, ...args: Array<any>): EntityDbSetHandler<TEntity> {
            return super.whereNotIn(this.entityInfo.getPropertyName(property), ...args) as EntityDbSetHandler<TEntity>;
        }

        whereContains_(property: (dataDef: TEntity) => any, search: string, invariantCase?: boolean): EntityDbSetHandler<TEntity> {
            return super.whereContains(this.entityInfo.getPropertyName(property), search, invariantCase) as EntityDbSetHandler<TEntity>;
        }

        whereNotContains_(property: (dataDef: TEntity) => any, search: string, invariantCase?: boolean): EntityDbSetHandler<TEntity> {
            return super.whereNotContains(this.entityInfo.getPropertyName(property), search, invariantCase) as EntityDbSetHandler<TEntity>;
        }

        whereIsNullOrEmpty_(property: (dataDef: TEntity) => any): EntityDbSetHandler<TEntity> {
            return this.whereIsNullOrEmpty(this.entityInfo.getPropertyName(property)) as EntityDbSetHandler<TEntity>;
        }

        whereIsNotNullOrEmpty_(property: (dataDef: TEntity) => any): EntityDbSetHandler<TEntity> {
            return this.whereIsNotNullOrEmpty(this.entityInfo.getPropertyName(property)) as EntityDbSetHandler<TEntity>;
        }

        search_(search?: string, ...properties: Array<(dataDef: TEntity) => any>): EntityDbSetHandler<TEntity> {
            let fieldNames = [];
            for (let field of properties) {
                fieldNames.add(this.entityInfo.getPropertyName(field));
            }
            return super.search(search, ...fieldNames) as EntityDbSetHandler<TEntity>;
        }

        searchMany_(searches: string[], properties: Array<(dataDef: TEntity) => any>, mode = SearchManyMode.and): EntityDbSetHandler<TEntity> {
            let fieldNames = [];
            for (let field of properties) {
                fieldNames.add(this.entityInfo.getPropertyName(field));
            }
            return super.searchMany(searches, fieldNames, mode) as EntityDbSetHandler<TEntity>;
        }

        orderBy_(...properties: Array<(dataDef: TEntity) => any>): EntityDbSetHandler<TEntity> {
            let fieldNames = [];
            for (let field of properties) {
                fieldNames.add(this.entityInfo.getPropertyName(field));
            }
            return super.orderBy(...fieldNames) as EntityDbSetHandler<TEntity>;
        }

        orderByDesc_(...properties: Array<(dataDef: TEntity) => any>): EntityDbSetHandler<TEntity> {
            let fieldNames = [];
            for (let field of properties) {
                fieldNames.add(this.entityInfo.getPropertyName(field) + ' DESC');
            }
            return super.orderBy(...fieldNames) as EntityDbSetHandler<TEntity>;
        }

        select_(...properties: Array<(dataDef: TEntity) => any>): EntityDbSetHandler<TEntity> {
            let fieldNames = [];
            for (let field of properties) {
                fieldNames.add(this.entityInfo.getPropertyName(field));
            }
            return super.select(...fieldNames) as EntityDbSetHandler<TEntity>;
        }

        selectMany_(properties: (dataDef: TEntity) => Array<any>): EntityDbSetHandler<TEntity> {
            return super.select(...this.entityInfo.getPropertyNames(properties)) as EntityDbSetHandler<TEntity>;
        }

        async getRange(ids: Array<any>, dataDefPropertyAction?: (dataDef: TEntity) => any, parameters?: Record<string, any>): Promise<Array<TEntity>> {
            if (ids == null)
                return null;
            return await this.where((dataDefPropertyAction ? this.entityInfo.getPropertyName(dataDefPropertyAction) : this.entityInfo.getPrimaryKey()) + ' IN(' + ids.select(a => '?').join(',') + ')', ...ids.select(a => a)).toArray(parameters);
        }

        async min_(property: (dataDef: TEntity) => any): Promise<number> {
            return this.min(this.entityInfo.getPropertyName(property));
        }

        async max_(property: (dataDef: TEntity) => any): Promise<number> {
            return this.max(this.entityInfo.getPropertyName(property));
        }

    }

}