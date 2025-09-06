/// <reference path="../Dictionary.ts" />

namespace NextAdmin.Business {
    export class EntityInfos extends Dictionary<EntityInfo_> {

        constructor(entitiesInfo?: Array<Models.EntityInfo>) {
            super(null);

            for (let entityInfo of entitiesInfo) {
                this.add(entityInfo.entityName, new EntityInfo_(entityInfo));
            }
        }


        public getEntityPrimaryKey(entityName: string): string {
            let entityInfo = this.get(entityName);
            if (entityInfo == null)
                return null;
            return entityInfo.getPrimaryKey();
        }


        public getMemberInfo(entityName: string, memberName: string): DataPropertyInfo {
            let entityInfo = this.get(entityName);
            if (entityInfo == null) {
                return null;
            }
            let memberInfo = entityInfo.propertyInfos.get(memberName);
            return memberInfo;
        }

    }

    export class EntityInfo<T> implements DataInfo {

        name: string;

        tableName?: string;

        displayName?: string;

        displayPropertiesNames: string[];

        entityParentNames: string[];

        propertyInfos: Dictionary<DataPropertyInfo>;

        constructor(data: Models.EntityInfo) {
            this.name = data.entityName;
            this.tableName = data.entityTableName;
            this.displayName = data.entityDisplayName;
            this.entityParentNames = data.entityParentNames;
            this.displayPropertiesNames = data.displayMembersNames;
            this.propertyInfos = new Dictionary();
            for (let key in data.membersInfos) {
                let entityMemberInfo = data.membersInfos[key] as Models.EntityMemberInfo;
                this.propertyInfos.add(key, {
                    dataName: this.name,
                    name: entityMemberInfo.memberName,
                    displayName: entityMemberInfo.memberDisplayName,
                    type: entityMemberInfo.memberType,
                    isPrimaryKey: entityMemberInfo.isPrimaryKey,
                    isRequired: entityMemberInfo.isRequired,
                    values: entityMemberInfo.memberValues,
                    foreignDataName: entityMemberInfo.foreignEntityName,
                    foreignDataRelationName: entityMemberInfo.foreignEntityRelationName,
                    isQueryable: entityMemberInfo.isQueryable
                });
            }
        }



        private _dataDef: T;
        private getEntityDef(): T {
            if (this._dataDef == null) {
                this._dataDef = {} as T;
                for (let propertyName in this.propertyInfos) {
                    this._dataDef[propertyName] = propertyName;
                }
            }
            return this._dataDef;
        }

        public getPropertyName(dataDefPropertyAction: (dataDef: T) => any): string {
            return dataDefPropertyAction(this.getEntityDef());
        }

        public getPropertyNames(dataDefPropertyAction: (dataDef: T) => Array<any>): Array<string> {
            return dataDefPropertyAction(this.getEntityDef());
        }

        public getPropertyInfo(dataDefPropertyAction: (dataDef: T) => any): DataPropertyInfo {
            return this.propertyInfos[this.getPropertyName(dataDefPropertyAction)];
        }

        private _primaryKey = null;
        public getPrimaryKey(): string {
            if (this._primaryKey == null) {
                for (let memberInfo of this.propertyInfos.getValues()) {
                    if (memberInfo.isPrimaryKey) {
                        this._primaryKey = memberInfo.name;
                        break;
                    }
                }
            }
            return this._primaryKey;
        }

    }


    export class EntityInfo_ extends EntityInfo<any> {



    }


}