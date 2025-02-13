namespace NextAdmin.Core.API.ViewModels.Args
{
    public class EntityArgs
    {
        public string? EntityName { get; set; }

        public string? CustomActionName { get; set; }

        public Dictionary<string, object>? CustomActionArgs { get; set; }

        public Dictionary<string, object>? Parameters { get; set; }

    }
}
