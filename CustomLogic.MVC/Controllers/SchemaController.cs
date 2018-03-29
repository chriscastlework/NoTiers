using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using CSharpeToolSet.Models;
using CustomLogic.Factory;
using CustomLogic.MVC.Models;
using CustomLogic.SchemaBuilder.MicrosoftSQL;
using CustomLogic.SchemaBuilder.MicrosoftSQL.SchemaModels;
using CustomLogic.Templates.Interfaces;

namespace CustomLogic.MVC.Controllers
{

  
    public class SchemaController : BaseController
    {
        private readonly TemplateFactory<ITempalateCustomLogic> customLogicTemplateFactory = new TemplateFactory<ITempalateCustomLogic>();
        private readonly TemplateFactory<ITemplateAngular> AngularFrontEndTemplateFactory = new TemplateFactory<ITemplateAngular>();

        private readonly AppInfo _appInfo = new AppInfo(); // the big page object
        private readonly GetMicrosoftDatabaseSchemaDetails _microsoftDatabaseSchemaDetails = new GetMicrosoftDatabaseSchemaDetails();

        private static string GetConnectionString(ServerModel model)
        {
            if (model.WindowsAuthentication)
            {
                return $"Data Source={model.Server};Initial Catalog={model.Database};Persist Security Info=True;Integrated Security=true;MultipleActiveResultSets=True";
            }
            // not tested
            return  $"Data Source={model.Server};Database={model.Database};User ID={model.UserName};Password={model.Password};Encrypt=True;TrustServerCertificate=True;Connection Timeout=30;MultipleActiveResultSets=True;";
            
        }

        /// <summary>
        /// Alow user to enter server and database name locked down to local host for now
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            ServerModel model = new ServerModel(); // TODO throw in database type field and authentication and stuff so we can connect to different databases
            model.Server = @"tcp:devvrdata.database.windows.net,1433";
            return View(model);
        }
        

        // Send in server connection string and the required tables to get a UI to select db tables to make your application
        [HttpPost]
        public ActionResult DefineApplication(ServerModel model)
        {
            // 1. Test view model
            if (!ModelState.IsValid)
            {
                return View("Index", model);
            }

            string[] reqList = null;
            if (model.RequiredList != null)
            {
                reqList = model.RequiredList.ToLower().Split(',').ToList().Select(c => c.Trim()).ToArray();
            }
            
            var result = _microsoftDatabaseSchemaDetails.GetTableDefinition(GetConnectionString(model), reqList); // getting the database mode 3 seconds


            // 2. Test Service result for getting schema data
            if (!result.Success)
            {
                Danger(string.Join("<br/>", result.Messages.Where(c=>c.SeverityLevel == "error").Select(cc=>cc.MessageText)));
                return View("Index", model);
            }

            List<ModelInfo> tableInfomation = result.Data;
            _appInfo.TableInfomation = tableInfomation;

            // Custom Logic templates
            List<IModelInfoTemplate> templates = customLogicTemplateFactory.GetModelInfoTemplates(null);
            _appInfo.Templates = templates.Select(c => new TempalateClassModel
            {
                ClassId = c.GetClassId(),
                ClassName = c.GetClassName()
            }).ToList();

            List<IModelInfoTemplate> templatesFront = AngularFrontEndTemplateFactory.GetModelInfoTemplates(null);

            _appInfo.FrontEndTemplates = templatesFront.Select(c => new TempalateClassModel
            {
                ClassId = c.GetClassId(),
                ClassName = c.GetClassName()
            }).ToList();
            
            return View(_appInfo);
        }
    }
}