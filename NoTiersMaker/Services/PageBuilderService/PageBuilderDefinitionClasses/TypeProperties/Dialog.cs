using System.Collections.Generic;

namespace CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.TypeProperties
{
    public class Dialog
    {
        public int type { get; set; }
        public string id { get; set; }
        public string mappedEntityId { get; set; }
        public string mappingContextId { get; set; }
        public string name { get; set; }
        public Visibility visibility { get; set; }
        public List<object> elements { get; set; }
        public BackgroundColor backgroundColor { get; set; }
        public BorderColor borderColor { get; set; }
        public string showMethod { get; set; }
    }
}