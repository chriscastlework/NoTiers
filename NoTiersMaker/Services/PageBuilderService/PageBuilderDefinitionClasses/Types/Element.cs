using System;
using System.Collections.Generic;
using System.Reflection;
using CustomLogic.Services.PageBuilderService.FrameWorks.Angular;
using CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.TypeProperties;

namespace CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.Types
{
    public class Element: IPageBuilderElement
    {
        public int type { get; set; }
        public string id { get; set; }
        public int index { get; set; }
        public string mappedEntityId { get; set; }
        public string mappingContextId { get; set; }
        public string name { get; set; }
        public TypeProperties.Visibility visibility { get; set; }
        public Width width { get; set; }
        public string specifiedWidth { get; set; }
        public TypeProperties.Hyperlink hyperlink { get; set; }
        public List<object> elements { get; set; }
        public TypeProperties.LayoutDirection layoutDirection { get; set; }
        public TypeProperties.BackgroundColor backgroundColor { get; set; }
        public TypeProperties.BorderColor borderColor { get; set; }

        public string GetClassName()
        {
            return MethodBase.GetCurrentMethod().DeclaringType.Name;
        }
        
    }
}