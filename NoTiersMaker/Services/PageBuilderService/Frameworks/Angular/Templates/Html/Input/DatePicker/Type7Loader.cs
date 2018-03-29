using System.Reflection;
using CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.Types;
using Newtonsoft.Json;

namespace CustomLogic.Services.PageBuilderService.Frameworks.Angular.Templates.Html.Input.DatePicker
{
    public partial class Type7 : IPageBuilderTemplate
    {
        private PageBuilderDefinitionClasses.Types.Type7 _model { get; set; }

        public string GetClassName()
        {
            return MethodBase.GetCurrentMethod().DeclaringType.Name;
        }

        public string CreateHtml(object pageBuilderTemplate)
        {
            _model = JsonConvert.DeserializeObject<PageBuilderDefinitionClasses.Types.Type7>(pageBuilderTemplate.ToString());
            return this.TransformText();
        }
    }
}
