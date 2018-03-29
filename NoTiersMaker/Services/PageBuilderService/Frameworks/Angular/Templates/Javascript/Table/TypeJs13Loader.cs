using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.Types;
using Newtonsoft.Json;

namespace CustomLogic.Services.PageBuilderService.Frameworks.Angular.Templates.Javascript.Table
{
    public partial class TypeJs13: IPageBuilderTemplate
    {
        private PageBuilderDefinitionClasses.Types.Type13 _model { get; set; }

        public string GetClassName()
        {
            return MethodBase.GetCurrentMethod().DeclaringType.Name;
        }

        public string CreateHtml(object pageBuilderTemplate)
        {
            _model = JsonConvert.DeserializeObject<PageBuilderDefinitionClasses.Types.Type13>(pageBuilderTemplate.ToString());
            if (string.IsNullOrEmpty(_model.mappedEntityId))
                return "";

            return this.TransformText();
        }
    }
}
