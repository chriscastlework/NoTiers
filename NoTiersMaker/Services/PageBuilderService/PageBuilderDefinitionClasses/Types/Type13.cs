using System;
using System.Collections.Generic;
using System.Reflection;
using CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.TypeProperties;

namespace CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.Types
{
    public class GridColumnOption
    {
        public int type { get; set; }
        public string id { get; set; }
        public string mappedEntityId { get; set; }
        public string mappingContextId { get; set; }
        public string name { get; set; }
        public TypeProperties.Visibility visibility { get; set; }
        public List<object> elements { get; set; }
        public Field field { get; set; }
        public DisplayValue displayValue { get; set; }
        public TypeProperties.BackgroundColor backgroundColor { get; set; }
        public SummaryOptions summaryOptions { get; set; }
    }
    
    public class Type13 : Element, IPageBuilderElement
    {
        public List<GridColumnOption> gridColumnOptions { get; set; }

        //public string GetClassName()
        //{
        //    return MethodBase.GetCurrentMethod().DeclaringType.Name;
        //}
    }
}