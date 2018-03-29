using System.Linq;
using System.Reflection;
using CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.Types;
using Newtonsoft.Json;

namespace CustomLogic.Services.PageBuilderService.Frameworks.Angular.Templates.Html.Table
{
    public partial class Type13 : IPageBuilderTemplate
    {
        private string[] currentlAllowedList = new[] {"Deals", "Accounts"};

        private PageBuilderDefinitionClasses.Types.Type13 _model { get; set; }

        public string GetClassName()
        {
            return MethodBase.GetCurrentMethod().DeclaringType.Name;
        }

        public string CreateHtml(object pageBuilderTemplate)
        {
            _model = JsonConvert.DeserializeObject<PageBuilderDefinitionClasses.Types.Type13>(pageBuilderTemplate.ToString());
            if (string.IsNullOrEmpty(_model.mappedEntityId))
                return string.Empty;
            var entityName = _model.mappedEntityId.Replace(_model.mappingContextId, "").Replace(".", "");
            if (currentlAllowedList.Contains(entityName))
            {
                return this.TransformText();
            }

            return string.Empty;
        }
    }
}
