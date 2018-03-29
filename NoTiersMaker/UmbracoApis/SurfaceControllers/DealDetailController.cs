using System.Web.Mvc;
using CustomLogic.Services.DealsService;
using Umbraco.Web.Mvc;

namespace CustomLogic.UmbracoApis.SurfaceControllers
{
    public class DealDetailEditController : SurfaceController
    {
        [HttpPost]
        public ActionResult HandleDealDetail([Bind(Prefix = "DealViewModel")] DealsViewModel model)
        {
            return CurrentUmbracoPage();
        }
    }
}