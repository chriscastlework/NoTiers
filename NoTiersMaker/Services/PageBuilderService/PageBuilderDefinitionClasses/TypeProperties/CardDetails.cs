using System.Collections.Generic;
using CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.Types;

namespace CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.TypeProperties
{
    public class CardDetails
    {
        public int type { get; set; }
        public string id { get; set; }
        public object mappedEntityId { get; set; }
        public string mappingContextId { get; set; }
        public string name { get; set; }
        public Visibility visibility { get; set; }
        public List<Element> elements { get; set; }
        public BackgroundColor backgroundColor { get; set; }
        public BorderColor borderColor { get; set; }
    }
}