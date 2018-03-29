using System;
using System.Collections.Generic;
using System.Reflection;
using CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.TypeProperties;

namespace CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.Types
{
    public class Type22 : Element, IPageBuilderElement
    {
        public Height height { get; set; }
        public CardDetails cardDetails { get; set; }
        public Dialog dialog { get; set; }
        public LookupData lookupData { get; set; }
        public List<object> connections { get; set; }
        public MapDataMappingOptions mapDataMappingOptions { get; set; }

        public new string GetClassName()
        {
            return MethodBase.GetCurrentMethod().DeclaringType.Name;
        }
    }
}