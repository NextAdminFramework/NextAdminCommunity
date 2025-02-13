using Newtonsoft.Json.Linq;

namespace NextAdmin.Core.API.ViewModels.Args
{
    public class SaveEntityArgs : EntityArgs
    {
        public JObject? Entity { get; set; }

        public ConflictAction ConflictAction { get; set; }

        public string? LockKey { get; set; }

    }


    public enum ConflictAction
    {
        Overwrite,
        Cancel
    }
}