using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using CustomLogic.Core.Database;
using CustomLogic.Services.CustomObjectRowFieldsService;
using CustomLogic.Services.PageBuilderService;


namespace SpringXBuilder.MVC.Controllers
{
    public class AppletController : Controller
    {

        private PageBuilderService service = new PageBuilderService(new VelocityRocketLegacy());

        /// <summary>
        /// Loads the with the springX application
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            return View();
        }
        
        public ActionResult Load(string id)
        {
            if (id == "test")
            {
                string xmlString = System.IO.File.ReadAllText(ControllerContext.HttpContext.Server.MapPath("~/TestXML/Test.xml"));
                return this.Content(xmlString, "text/xml");
            }
            else
            {
               var result = service.GetPageBuilderXml(id);
               return this.Content(result.Data, "text/xml");
            }
        }


        public ActionResult LoadAngular(string id)
        {
            var result = service.GetPageBuilderAngular(id);

            string mainPageMappingType = service.GetPageBuilderType(id);

            result.Data.Id = "2541"; // for testing

            if (mainPageMappingType == "Account")
            {
                return View("LoadAngularAccount", result);
            }
            if (mainPageMappingType == "Deal")
            {
                return View("LoadAngularDeal", result);
            }

            
            return View("LoadAngularCustomObject", result);
        }
    }
}