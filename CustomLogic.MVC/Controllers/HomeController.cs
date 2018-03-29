using System.Web.Mvc;

namespace CustomLogic.MVC.Controllers
{
    public class HomeController : BaseController
    {
        public ActionResult Index()
        {
       
            ViewBag.Title = "Home Page";

            return View();
        }

        public ActionResult Razor4T4()
        {

            ViewBag.Title = "Home Page";

            return View();
        }

        /// <summary>
        /// Links to a page about Architecture 
        /// </summary>
        /// <returns></returns>
        public ActionResult Architecture()
        {
            return View();
        }

        
    }
}
