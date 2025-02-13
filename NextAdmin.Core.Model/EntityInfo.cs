using System;
using System.Collections.Generic;
using System.Linq;

namespace NextAdmin.Core.Model
{
    public class EntityInfo
    {

        public string EntityName { get; set; }

        public string EntityDisplayName { get; set; }

        public string EntityTableName { get; set; }

        public List<string> EntityParentNames { get; set; }

        public List<string> DisplayMembersNames { get; set; }

        public Dictionary<string, EntityMemberInfo> MembersInfos { get; set; }


        public EntityInfo(string entityName)
        {
            EntityName = entityName;
            MembersInfos = new Dictionary<string, EntityMemberInfo>();
            DisplayMembersNames = new List<string>();
        }


        private string _primaryKey = null;
        public string GetPrimaryKeyName()
        {
            if (_primaryKey == null)
            {
                _primaryKey = MembersInfos.FirstOrDefault(e => e.Value.IsPrimaryKey).Key;
            }
            return _primaryKey;
        }

        public EntityMemberInfo GetPrimaryKeyInfo()
        {
            return MembersInfos.Select(e => e.Value).FirstOrDefault(e => e.IsPrimaryKey);
        }
    }


    public class EntityMemberInfo
    {

        public string MemberName { get; set; }


        public string MemberDisplayName { get; set; }


        public Type MemberType { get; set; }


        public bool IsPrimaryKey { get; set; }


        public bool IsRequired { get; set; }

        public string ForeignEntityName { get; set; }

        public string ForeignEntityRelationName { get; set; }

        public bool IsQueryable { get; set; }

        public List<ValueItem> MemberValues { get; set; }

    }

    public class ValueItem
    {

        public object Value { get; set; }

        public string Label { get; set; }

        public ValueItem(object value, string label)
        {
            Value = value;
            Label = label;
        }

    }




}
