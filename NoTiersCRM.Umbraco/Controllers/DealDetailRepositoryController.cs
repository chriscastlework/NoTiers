using System.Web.Mvc;
using CustomLogic.Core.Database;
using CustomLogic.Services.DealsService;
using CustomLogic.UmbracoApis;
using umbraco.cms.businesslogic.member;
using Umbraco.Web.Models;
using Umbraco.Web.Mvc;

namespace NoTiersCRM.Umbraco.Controllers
{
    public class DealDetailController : RenderMvcController
    {
        // GET: DealDetailRepository
        public override ActionResult Index(RenderModel model)
        {
            
            var coreUser = new CoreUser();

            var mymember = Member.GetCurrentMember();

            if (mymember != null)
            {

                coreUser.Id = mymember.getProperty("velocityRocketUserID").Value.ToString();
                coreUser.OrganisationId = int.Parse(mymember.getProperty("organisationID").Value.ToString());
            }

            var dealId =  HttpContext.Request.QueryString["id"];

            DealService service = new DealService(new VelocityRocketLegacy());


            var dealResult = service.View(new DealsViewModel() {Id = int.Parse(dealId)}, coreUser);
            
            DealDetailRenderModel renderModel = new DealDetailRenderModel(model.Content);

            renderModel.DealViewModel = dealResult.Data;

            return base.Index(renderModel);
        }
    }
}