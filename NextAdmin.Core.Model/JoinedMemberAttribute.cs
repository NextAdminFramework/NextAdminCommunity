using System.ComponentModel.DataAnnotations.Schema;

namespace NextAdmin.Core.Model
{
    public class JoinedMemberAttribute : NotMappedAttribute
    {
        public string Path { get; set; }

        public JoinedMemberAttribute(string path)
        {
            Path = path;
        }

    }
}
