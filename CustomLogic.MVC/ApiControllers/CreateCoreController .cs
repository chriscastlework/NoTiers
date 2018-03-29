using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
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
    public class CreateCoreController : ApiController
    {
      
        private readonly TemplateFactory<ITemplateAngular> templateFactory = new TemplateFactory<ITemplateAngular>();

        /// <summary>
        /// Creates a zip file that contains all front end code not sure what this out put is
        /// </summary>
        /// <param name="appInfo">ALl information about application derived from database schema</param>
        /// <returns></returns>
        [System.Web.Http.HttpPost]
        public HttpResponseMessage Post(AppInfo appInfo)
        {
            string baseFolder = AppDomain.CurrentDomain.BaseDirectory + "/Download/";
            
            string zipFolder = baseFolder + "/Core.zip";
            
            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            var stream = new FileStream(zipFolder, FileMode.Open, FileAccess.Read);
            result.Content = new StreamContent(stream);
            result.Content.Headers.ContentType =
                new MediaTypeHeaderValue("application/octet-stream");
            return result;

        }
    }
}