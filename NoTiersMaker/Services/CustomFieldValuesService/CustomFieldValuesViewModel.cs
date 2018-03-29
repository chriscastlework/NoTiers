using CustomLogic.Services.CustomFieldsService;

namespace CustomLogic.Services.CustomFieldValuesService
{
    public class CustomFieldValuesViewModel
    {

        public int CustomFieldId { get; set; }
        public int EntityId { get; set; }
        public string Value { get; set; }
        public CustomFieldsViewModel CustomFieldsViewModel { get; set; }
    }
}