using System;

namespace NextAdmin.Core.Model
{
    public class PreviewAttribute : Attribute
    {
        public int Index { get; set; }

        public PreviewAttribute(int index = 0)
        {
            Index = index;
        }



    }
}
