namespace NextAdmin.Core
{

    public interface IDocument
    {

        byte[] Data { get; set; }

        string Name { get; set; }

        string Extension { get; set; }

    }

}
