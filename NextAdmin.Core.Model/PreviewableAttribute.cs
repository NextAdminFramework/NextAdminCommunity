using System;

namespace NextAdmin.Core.Model
{
    public class PreviewableAttribute : Attribute
    {
        public int Index { get; set; }

        public PreviewableAttribute(int index = 0)
        {
            Index = index;
        }



    }
}
