using System;

namespace NextAdmin.Core.Model
{
    public class Lock
    {
        public static int DefaultLockDuration = 30;

        public string Key { get; set; }

        public DateTime CreationDate { get; set; }

        public DateTime ExpirationDate { get; set; }

        public string OwnerName { get; set; }


        public Lock(string key, DateTime expirationDate, string ownerName = null)
        {
            Key = key;
            CreationDate = DateTime.Now;
            ExpirationDate = expirationDate;
            OwnerName = ownerName;
        }

        public Lock(string key, int? durationSeconde = null, string ownerName = null)
            : this(key, DateTime.Now.AddSeconds(durationSeconde ?? DefaultLockDuration), ownerName)
        {

        }

        public void Update(string key, int? durationSeconde = null, string ownerName = null)
        {
            Key = key;
            ExpirationDate = DateTime.Now.AddSeconds(durationSeconde ?? DefaultLockDuration);
            OwnerName = ownerName;
        }

    }
}
