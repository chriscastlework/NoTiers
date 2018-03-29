using System;
using System.Reflection;
using CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.TypeProperties;

namespace CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.Types
{
    public class Type2 : Element, IPageBuilderElement
    {
        public DisplayValue displayValue { get; set; }
        
        //public string GetClassName()
        //{
        //    return MethodBase.GetCurrentMethod().DeclaringType.Name;
        //}
    }
}