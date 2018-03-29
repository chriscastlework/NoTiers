using System;
using System.Linq;
using CustomLogic.Core.BaseClasses;
using CustomLogic.Core.Database;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Models;
using CustomLogic.Services.CustomObjectRowFieldsService;
using CustomLogic.Services.PageBuilderService.FrameWorks.Angular;
using CustomLogic.Services.PageBuilderService.FrameWorks.SpringX;
using CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses;
using Newtonsoft.Json;

namespace CustomLogic.Services.PageBuilderService
{
    public class PageBuilderService : ServiceBase<string, string>
    {
        public PageBuilderService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public Response<string> GetPageBuilderXml(string id)
        {
            var pageObject = GatPageBuilderPageDefiniton(id);
            
            SpringxBuilder springXBuilder = new SpringxBuilder();

            Response<string> result = springXBuilder.ConvertApp(pageObject);

            return result;
        }

        /// <summary>
        /// Builds your page from the pagebuilder definition retuns html/css/javascript
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Response<PageObject> GetPageBuilderAngular(string id)
        {
            var pageObject = GatPageBuilderPageDefiniton(id);
            
            // create the Html
            var result = AngularBuilder.ConvertApp(pageObject);

            return result;
        }

        public string GetPageBuilderType(string id)
        {
            var pageObject = GatPageBuilderPageDefiniton(id);
            
            return pageObject.page.mappedEntityId.Split('.').Last();
        }

        private static PageDefiniton GatPageBuilderPageDefiniton(string id)
        {
            // get the json
            CustomObjectRowFieldService service = new CustomObjectRowFieldService(new VelocityRocketLegacy());
            var result = service.View(new CustomObjectRowFieldsViewModel {Id = Convert.ToInt32(id)}, null);


            if (string.IsNullOrEmpty(id))
            {
                string path = System.AppDomain.CurrentDomain.BaseDirectory;
                string jsonString = System.IO.File.ReadAllText(path+"/TestJson/json.json");
                result = new Response<CustomObjectRowFieldsViewModel>();
                result.Data = new CustomObjectRowFieldsViewModel();
                result.Data.Value = jsonString;
            }
            // cast to c#
            PageDefiniton pageObject = JsonConvert.DeserializeObject<PageDefiniton>(result.Data.Value);
            
            return pageObject;
        }


      
    }
}
