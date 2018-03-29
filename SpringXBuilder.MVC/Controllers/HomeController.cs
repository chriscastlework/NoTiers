using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Mvc;
using OptDev.Razor4T4;

namespace SpringXBuilder.MVC.Controllers
{
    public class HomeController : Controller
    {

        public ActionResult Accounts()
        {
          
            return View();
        }

        public ActionResult Deals()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Test()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Index()
        {
          
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}