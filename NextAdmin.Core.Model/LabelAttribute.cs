using System;

namespace NextAdmin.Core.Model
{
    public class LabelAttribute : Attribute
    {

        public string ResourceName { get; set; }

        public LabelAttribute(string resourceName = null)
        {
            ResourceName = resourceName;
        }

    }
}
