namespace NextAdmin.Business {

    export class EntityHelper {

        public static async getLinkedEntities(entityClient: Services.EntityClient, entittyInfos: EntityInfos, entityName: string, entityPrimaryKey: string): Promise<Array<LinkedEntitiesInfo>> {

            let linkedEntittiesInfos = new Array<LinkedEntitiesInfo>();
            for (let entityInfo of entittyInfos.getValues()) {
                let foreignEntityLinkedMember = entityInfo.propertyInfos.getValues().where(a => a.foreignDataRelationName == entityName);
                if (foreignEntityLinkedMember.length > 0) {
                    let foreignEntityDbset = new DbSetHandler(entityInfo.name, entityClient);
                    let linkedEntities = await foreignEntityDbset.where(foreignEntityLinkedMember.select(a => a.name + ' = ' + "'" + entityPrimaryKey + "'").join(' OR ')).toArray();
                    if (linkedEntities.length > 0) {
                        linkedEntittiesInfos.add({
                            entityInfo: entityInfo,
                            entities: linkedEntities
                        });
                    }
                }
            }
            return linkedEntittiesInfos;
        }

    }

    export interface LinkedEntitiesInfo {

        entityInfo: EntityInfo_;

        entities: Array<any>;

    }
}