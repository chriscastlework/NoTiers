using System.Collections.Generic;

namespace CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.TypeProperties
{
    public class LookupData
    {
        public string mappedEntityId { get; set; }
        public string mappingContextId { get; set; }
        public List<object> dialogFieldIds { get; set; }
        public string lookUpPath { get; set; }
        public string associatedFieldId { get; set; }
    }
}