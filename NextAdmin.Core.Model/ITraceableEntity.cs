using System;

namespace NextAdmin.Core.Model
{
    public interface ITraceableEntity
    {

        string? CreationUserId { get; set; }

        string? ModificationUserId { get; set; }

        DateTime? CreationDate { get; set; }

        DateTime? ModificationDate { get; set; }

    }

}
