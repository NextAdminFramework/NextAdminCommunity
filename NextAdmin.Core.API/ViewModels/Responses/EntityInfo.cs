namespace NextAdmin.Core.API.ViewModels.Responses
{
    public class EntityInfo
    {

        public string EntityName { get; set; }

        public string EntityDisplayName { get; set; }

        public string EntityTableName { get; set; }

        public List<string> EntityParentNames { get; set; }

        public List<string> DisplayMembersNames { get; set; }

        public Dictionary<string, EntityMemberInfo> MembersInfos { get; set; }


        public EntityInfo(Model.EntityInfo entityInfo)
        {
            EntityName = entityInfo.EntityName;
            EntityDisplayName = entityInfo.EntityDisplayName;
            EntityTableName = entityInfo.EntityTableName;
            EntityParentNames = entityInfo.EntityParentNames;
            DisplayMembersNames = entityInfo.DisplayMembersNames.Select(e => e.FirstCharToLower()).ToList();
            MembersInfos = entityInfo.MembersInfos.Values.Select(e => new EntityMemberInfo(e)).ToDictionary(e => e.MemberName);
        }
    }


    public class EntityMemberInfo
    {

        public string MemberName { get; set; }


        public string MemberDisplayName { get; set; }


        public string MemberType { get; set; }


        public bool IsPrimaryKey { get; set; }


        public bool IsRequired { get; set; }

        public string ForeignEntityName { get; set; }

        public string ForeignEntityRelationName { get; set; }

        public bool IsQueryable { get; set; }

        public List<Model.ValueItem> MemberValues { get; set; }


        public EntityMemberInfo(Model.EntityMemberInfo memberInfo)
        {
            MemberName = memberInfo.MemberName.FirstCharToLower();
            MemberDisplayName = memberInfo.MemberDisplayName;
            MemberType = memberInfo.MemberType.GetJSName();
            IsPrimaryKey = memberInfo.IsPrimaryKey;
            IsRequired = memberInfo.IsRequired;
            ForeignEntityName = memberInfo.ForeignEntityName;
            ForeignEntityRelationName = memberInfo.ForeignEntityRelationName;
            IsQueryable = memberInfo.IsQueryable;
            MemberValues = memberInfo.MemberValues;
        }

    }


}
