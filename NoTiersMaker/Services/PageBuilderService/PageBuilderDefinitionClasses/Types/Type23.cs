using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.TypeProperties;

namespace CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.Types
{
    
    public class Type23 : Element, IPageBuilderElement
    {

        public new string GetClassName()
        {
            return MethodBase.GetCurrentMethod().DeclaringType.Name;
        }

    }

}
