using System.Reflection;
using CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.Types;
using Newtonsoft.Json;

namespace CustomLogic.Services.PageBuilderService.Frameworks.Angular.Templates.Html.Input.Checkbox
{
    public partial class Type6 : IPageBuilderTemplate
    {
        private PageBuilderDefinitionClasses.Types.Type6 _model { get; set; }

        public string GetClassName()
        {
            return MethodBase.GetCurrentMethod().DeclaringType.Name;
        }

        public string CreateHtml(object pageBuilderTemplate)
        {
            _model = JsonConvert.DeserializeObject<PageBuilderDefinitionClasses.Types.Type6>(pageBuilderTemplate.ToString());
            return this.TransformText();
        }
    }
}
