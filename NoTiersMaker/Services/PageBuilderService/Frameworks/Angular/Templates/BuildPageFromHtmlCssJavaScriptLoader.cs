using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CustomLogic.Services.PageBuilderService.FrameWorks.Angular;

namespace CustomLogic.Services.PageBuilderService.Frameworks.Angular.Templates
{
    public partial class BuildPageFromHtmlCssJavaScript
    {
        private readonly PageObject _model;

        public BuildPageFromHtmlCssJavaScript(PageObject model)
        {
            _model = model;
        }
    }
}
