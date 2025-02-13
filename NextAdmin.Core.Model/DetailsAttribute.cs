using System.ComponentModel.DataAnnotations.Schema;

namespace NextAdmin.Core.Model
{
    public class DetailsAttribute : NotMappedAttribute
    {
        public string DetailForeignKeyName { get; set; }

        public string MasterKeyName { get; set; }

        public bool AutoLoad { get; set; }

        public bool AutoUpdate { get; set; }

        public bool AutoDelete { get; set; }

        public DetailsAttribute(string detailForeignKeyName, bool autoLoad = false, bool autoUpdate = true, bool autoDelete = true, string masterKeyName = null)
        {
            DetailForeignKeyName = detailForeignKeyName;
            MasterKeyName = masterKeyName;
            AutoLoad = autoLoad;
            AutoUpdate = autoUpdate;
            AutoDelete = autoDelete;
            MasterKeyName = masterKeyName;
        }

    }

}
