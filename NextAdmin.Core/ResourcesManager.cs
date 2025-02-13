using System.Collections.Generic;
using System.Linq;

namespace NextAdmin.Core
{
    public class ResourcesManager : Dictionary<string, string>
    {

        public ResourcesManager(params ResourcesManager[] subResources)
        {
            if (subResources != null)
            {
                this.JoinRange(subResources);
            }
        }

        public string Get(string key)
        {
            var propertyValue = this.TryGetPropetyValue(key) as string;
            if (propertyValue == null && !TryGetValue(key, out propertyValue))
            {
                propertyValue = key;
            }
            return propertyValue;
        }


        public List<KeyValuePair<string, string>> ToList()
        {
            var list = Enumerable.ToList(this);

            foreach (var propertyName in this.GetPropertiesNames())
            {
                if (!new string[] { "Comparer", "Count", "Keys", "Values", "Item" }.Contains(propertyName))//Exclude dictionary internal properties
                {
                    list.Add(new KeyValuePair<string, string>(propertyName, this.GetPropetyValue(propertyName) as string));
                }
            }
            return list;
        }


        public void Set(string key, string value)
        {
            if (this.TrySetPropertyValue(key, value))
            {
                return;
            }
            if (this.ContainsKey(key))
            {
                this[key] = value;
            }
            else
            {
                this.Add(key, value);
            }
        }

        public void JoinRange(params ResourcesManager[] subResources)
        {
            foreach (var resource in subResources)
            {
                this.Join(resource);
            }
        }

        public void Join(ResourcesManager resources)
        {
            foreach (var resource in resources.ToList())
            {
                this.Set(resource.Key, resource.Value);
            }
        }


    }
}
