using System.Web.Mvc;
using CustomLogic.Core.Models;
using Newtonsoft.Json;
using CustomLogic.Services.CustomObjectRowFieldsService;
using CustomLogic.Core.Database;
using SpringXBuilder.MVC.PageModels;

namespace SpringXBuilder.MVC.Controllers
{
    
    public class CustomFieldValuesController : Controller
    {

        // GET: PageBuilderApps
        public ActionResult Index()
        {
            return View();
        }
        
    }
}


