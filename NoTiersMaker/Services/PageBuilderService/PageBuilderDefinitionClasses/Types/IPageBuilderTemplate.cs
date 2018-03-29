namespace CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.Types
{
    public interface IPageBuilderTemplate
    {
        string GetClassName();
        
        string CreateHtml(object pageBuilderTemplate);
    }
}