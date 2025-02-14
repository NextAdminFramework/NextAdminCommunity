
namespace NextAdmin.Models {
    export interface EntityMemberInfo {

        memberName: string;

        memberDisplayName: string;

        memberType: string;

        isPrimaryKey: boolean;

        isRequired: boolean;

        memberValues?: ValueItem[];

        foreignEntityName?: string;

        foreignEntityRelationName?: string;

        isQueryable?: boolean;
    }


    export interface EntityInfo {

        entityName: string;

        entityDisplayName?: string;

        entityParentNames: string[];

        displayMembersNames: string[];

        membersInfos: {};

    }
}