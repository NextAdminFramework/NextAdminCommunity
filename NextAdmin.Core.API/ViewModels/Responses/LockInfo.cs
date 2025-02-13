using NextAdmin.Core.Model;

namespace NextAdmin.Core.API.ViewModels.Responses
{
    public class LockInfo
    {
        public DateTime? CreationDate { get; set; }

        public DateTime? ExpirationDate { get; set; }

        public string? OwnerName { get; set; }

        public bool IsOwner { get; set; }

        public LockInfo(Lock _lock, bool isOwner = false)
        {
            CreationDate = _lock.CreationDate;
            ExpirationDate = _lock.ExpirationDate;
            OwnerName = _lock.OwnerName;
            IsOwner = isOwner;
        }

    }
}
