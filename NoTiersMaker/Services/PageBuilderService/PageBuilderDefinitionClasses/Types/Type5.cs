using System.Reflection;

namespace CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.Types
{
  
    public class Type5 : Element, IPageBuilderElement
    {
        public new string GetClassName()
        {
            return MethodBase.GetCurrentMethod().DeclaringType.Name;
        }
    }
}