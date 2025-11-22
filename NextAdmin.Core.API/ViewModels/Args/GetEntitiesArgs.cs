namespace NextAdmin.Core.API.ViewModels.Args
{
    public class GetEntitiesArgs : EntityArgs
    {
        public string? WhereQuery { get; set; }

        public List<object>? WhereQueryArgs { get; set; }

        public List<string>? SelectQueries { get; set; }

        public bool IsSelectDistinctQuery { get; set; }

        public List<string>? OrderByQueries { get; set; }

        public int? SkipRecordCount { get; set; }

        public int? TakeRecordCount { get; set; }

    }
}
