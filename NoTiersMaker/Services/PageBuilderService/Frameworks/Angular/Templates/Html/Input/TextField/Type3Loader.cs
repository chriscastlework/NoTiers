using System.Reflection;
using CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.Types;
using Newtonsoft.Json;

namespace CustomLogic.Services.PageBuilderService.Frameworks.Angular.Templates.Html.Input.TextField
{
    public partial class Type3 : IPageBuilderTemplate
    {
        private PageBuilderDefinitionClasses.Types.Type3 _model { get; set; }

        public string GetClassName()
        {
            return MethodBase.GetCurrentMethod().DeclaringType.Name;
        }

        public string CreateHtml(object pageBuilderTemplate)
        {
            _model = JsonConvert.DeserializeObject<PageBuilderDefinitionClasses.Types.Type3>(pageBuilderTemplate.ToString());

            if (_model.mappedEntityId == null)
            {
                _model.mappedEntityId = _model.displayValue.mappedEntityId;
                if (string.IsNullOrEmpty(_model.mappedEntityId))
                {
                    _model.mappedEntityId = "";
                }
            }

            return this.TransformText();
        }
    }
}
