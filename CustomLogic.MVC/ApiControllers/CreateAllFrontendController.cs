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
    public class CreateAllFrontendController : ApiController
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
            Dictionary<string,string> filesDictionary = new Dictionary<string, string>();

            string baseFolder = AppDomain.CurrentDomain.BaseDirectory + "/Download/";

            foreach (ModelInfo tableInfo in appInfo.TableInfomation)
            {
                //if (!tableInfo.Required)
                //    continue;
                string innerFolder = tableInfo.TableName + "Service";
                string currentFolder = baseFolder + innerFolder;
                System.IO.Directory.CreateDirectory(currentFolder);
                GetMicrosoftDatabaseSchemaDetails DbSchema = new GetMicrosoftDatabaseSchemaDetails();
               
                List<IModelInfoTemplate> allLogicTemplates = templateFactory.GetModelInfoTemplates(tableInfo);

                foreach (IModelInfoTemplate logicTemplate in allLogicTemplates)
                {
                    IModelInfoTemplate template = allLogicTemplates.FirstOrDefault(c => c.GetClassId() == logicTemplate.GetClassId());
                    string classText = template.TransformText();
                    // create a file in the folder
                    var fileName = template.GetClassName() + ".cs";
                    string path = currentFolder + "/" + fileName;

                    using (FileStream fs = System.IO.File.Create(path))
                    {
                        Byte[] info = new UTF8Encoding(true).GetBytes(classText);
                        fs.Write(info, 0, info.Length);
                    }

                    filesDictionary.Add(path, innerFolder + "/" + fileName);
                }
            }

            string zipFolder = baseFolder + "/FrontEnd.zip";

            if (System.IO.File.Exists(zipFolder))
            {
                System.IO.File.Delete(zipFolder);
            }
            ZipArchive zip = ZipFile.Open(zipFolder, ZipArchiveMode.Create);
            
            foreach (var file in filesDictionary)
            {
                zip.CreateEntryFromFile(file.Key, file.Value.Replace("_", ""));
            }
            zip.Dispose();
            
            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            var stream = new FileStream(zipFolder, FileMode.Open, FileAccess.Read);
            result.Content = new StreamContent(stream);
            result.Content.Headers.ContentType =
                new MediaTypeHeaderValue("application/octet-stream");
            return result;

        }
    }
}