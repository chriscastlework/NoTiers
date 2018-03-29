using System.Web.Mvc;

namespace CustomLogic.MVC.Controllers
{
    public class DownloadController : Controller
    {
        public FileResult Core()
        {
            string CurrentFileName = "bundle.zip";
            string contentType = "application/zip";          
            return File(CurrentFileName, contentType, CurrentFileName);
        }
    }
}