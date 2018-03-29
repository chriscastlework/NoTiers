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
using System.Web.Mvc;
using CSharpeToolSet.Models;
using CustomLogic.Factory;
using CustomLogic.SchemaBuilder.MicrosoftSQL;
using CustomLogic.SchemaBuilder.MicrosoftSQL.SchemaModels;
using CustomLogic.Templates.Interfaces;

// For extension methods.

namespace CustomLogic.MVC.ApiControllers
{
    public class CreateAllServiceController : ApiController
    {

        private readonly TemplateFactory<ITempalateCustomLogic> customLogicTemplateFactory = new TemplateFactory<ITempalateCustomLogic>();

        
        /// <summary>
        /// Creates a zip file that returns everything that implements ITempalateCustomLogic 
        /// </summary>
        /// <param name="generateAllFiles"></param>
        /// <returns></returns>
        [System.Web.Http.HttpPost]
        public HttpResponseMessage Post(AppInfo generateAllFiles)
        {
            

            Dictionary<string,string> filesDictionary = new Dictionary<string, string>();

            string baseFolder = AppDomain.CurrentDomain.BaseDirectory + "/Download/";

            foreach (ModelInfo tableInfo in generateAllFiles.TableInfomation)
            {
                //if (!tableInfo.Required)
                //    continue;
                // create a folder
                string innerFolder = tableInfo.TableName + "Service";
                string currentFolder = baseFolder + innerFolder;
                System.IO.Directory.CreateDirectory(currentFolder);
                GetMicrosoftDatabaseSchemaDetails DbSchema = new GetMicrosoftDatabaseSchemaDetails();
                List<IModelInfoTemplate> allLogicTemplates = customLogicTemplateFactory.GetModelInfoTemplates(tableInfo);

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
                        // Add some information to the file.
                        fs.Write(info, 0, info.Length);
                    }
                    if(!filesDictionary.ContainsKey(path))
                    filesDictionary.Add(path, innerFolder + "/" + fileName);
                }
            }

            string zipFolder = baseFolder + "/Services.zip";

            if (System.IO.File.Exists(zipFolder))
            {
                System.IO.File.Delete(zipFolder);
            }
            ZipArchive zip = ZipFile.Open(zipFolder, ZipArchiveMode.Create);
            
            foreach (var file in filesDictionary)
            {
                zip.CreateEntryFromFile(file.Key, file.Value.Replace("_",""));
            }
            zip.Dispose();

            // return File(zipFolder,"application/zip", "bundle.zip");

            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            var stream = new FileStream(zipFolder, FileMode.Open, FileAccess.Read);
            result.Content = new StreamContent(stream);
            result.Content.Headers.ContentType =
                new MediaTypeHeaderValue("application/octet-stream");
            return result;

        }
    }
}