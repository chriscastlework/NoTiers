namespace CustomLogic.Templates.Interfaces
{
    /// <summary>
    /// All C# Template loaders must inherit this interface and implement functions  
    /// Base class not possible as partial class already inherits
    /// </summary>
    public interface ITempalateCustomLogic : IModelInfoTemplate
    {
        //string GetClassName();
        //int GetClassId();
        //int SetClassId(int id);
        //string TransformText();
    }
}