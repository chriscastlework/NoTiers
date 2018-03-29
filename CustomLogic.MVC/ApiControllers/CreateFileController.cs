using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web.Http;
using CSharpeToolSet.Models;
using CustomLogic.Factory;
using CustomLogic.SchemaBuilder.MicrosoftSQL;
using CustomLogic.SchemaBuilder.MicrosoftSQL.SchemaModels;
using CustomLogic.Templates.Interfaces;

namespace CustomLogic.MVC.ApiControllers
{
    public class CreateFileController : ApiController
    {


        private readonly TemplateFactory<IModelInfoTemplate> templateFactory = new TemplateFactory<IModelInfoTemplate>();

        /// <summary>
        /// Creates the code that is created from the sent in template id this is for updating or for sampling
        /// </summary>
        /// <param name="model">Contains the template id and the table and view model information</param>
        /// <returns></returns>
        [HttpPost]
        public HttpResponseMessage Post(GenerateFile model)
        {
            ModelInfo modelInfo = model.ModelInfo;
            int id = model.TemplateId;

            GetMicrosoftDatabaseSchemaDetails microsoftDatabaseSchemaDetails = new GetMicrosoftDatabaseSchemaDetails();
            List<IModelInfoTemplate> templates = templateFactory.GetModelInfoTemplates(modelInfo);
            IModelInfoTemplate template = templates.FirstOrDefault(c => c.GetClassId() == id);

            string documentText = "Error no template found!";

            if (template != null)
            { 
                documentText = template.TransformText();
            }
            
            var result = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ByteArrayContent(Encoding.ASCII.GetBytes(documentText))
            };

            result.Content.Headers.ContentDisposition =
                new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment")
                {
                    FileName = "CertificationCard.cs"
                };

            result.Content.Headers.ContentType = new MediaTypeHeaderValue("text/plain");

            return result;
        }
    }
}