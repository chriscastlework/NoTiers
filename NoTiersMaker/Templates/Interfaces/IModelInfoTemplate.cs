namespace CustomLogic.Templates.Interfaces
{
    public interface IModelInfoTemplate
    {
        string GetClassName();
        int SetClassId(int id);
        int GetClassId();
        string TransformText();
    }
}