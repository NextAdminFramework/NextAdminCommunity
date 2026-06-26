namespace NextAdmin.Core.API.Attrbutes
{
    public class MaxUserMinuteRequestAttribute : Attribute//Never tested
    {

        public int value { get; set; }

        public MaxUserMinuteRequestAttribute(int value)
        {
            this.value = value;
        }
    }
}
