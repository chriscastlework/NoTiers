namespace CustomLogic.Templates.Interfaces
{
    /// <summary>
    /// All Html Template loaders must inherit this interface and implement functions 
    /// Base class not possible as partial class already inherits
    /// </summary>
    public interface ITemplateAngularJs : IModelInfoTemplate
    {
        //string GetClassName();
        //int GetClassId();
        //int SetClassId(int id);
        //string TransformText();
    }
}