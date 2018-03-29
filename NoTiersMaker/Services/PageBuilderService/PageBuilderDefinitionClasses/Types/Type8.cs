using System;
using System.Reflection;

namespace CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.Types
{
    
    public class Type8 : Element, IPageBuilderElement
    {
       // public string specifiedWidth { get; set; }
       // public TypeProperties.Hyperlink hyperlink { get; set; }

        public new string GetClassName()
        {
            return MethodBase.GetCurrentMethod().DeclaringType.Name;
        }

    }
}