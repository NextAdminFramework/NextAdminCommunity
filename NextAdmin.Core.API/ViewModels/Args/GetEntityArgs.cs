namespace NextAdmin.Core.API.ViewModels.Args
{
    public class GetEntityArgs : EntityArgs
    {
        public object? EntityId { get; set; }

        public string? LockKey { get; set; }

        public List<string>? DetailToLoadNames { get; set; }

    }
}
