using System;
using System.Reflection;
using CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.TypeProperties;

namespace CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.Types
{
    public class Type3 : Element, IPageBuilderElement
    {
        public DisplayValue displayValue { get; set; }

        public new string GetClassName()
        {
            return MethodBase.GetCurrentMethod().DeclaringType.Name;
        }
    }
}