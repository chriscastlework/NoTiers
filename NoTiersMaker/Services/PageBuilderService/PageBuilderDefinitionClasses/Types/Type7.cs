using System;
using System.Reflection;
using CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.TypeProperties;

namespace CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.Types
{
    public class Type7 : Element, IPageBuilderElement
    {
        public new string GetClassName()
        {
            return MethodBase.GetCurrentMethod().DeclaringType.Name;
        }
    }
}