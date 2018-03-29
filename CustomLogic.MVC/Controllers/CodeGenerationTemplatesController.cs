using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Compilation;
using System.Web.Hosting;
using System.Web.Mvc;
using CSharpeToolSet.Models;
using CustomLogic.Factory;
using CustomLogic.SchemaBuilder.MicrosoftSQL.SchemaModels;
using CustomLogic.Templates.Interfaces;

namespace CustomLogic.MVC.Controllers
{
    public class CodeGenerationTemplatesController : BaseController
    {
        // GET: RazorTemplates
        private readonly TemplateFactory<ITempalateCustomLogic> customLogicTemplateFactory = new TemplateFactory<ITempalateCustomLogic>();

        /// <summary>
        /// Please run this as a singleton
        /// </summary>
        /// <param name="id"></param>
        /// <param name="appInfo"></param>
        /// <returns></returns>
        public ActionResult RenderTemplates(string id, AppInfo appInfo)
        {
            string fileTypeName = id;
            Dictionary<string, string> filesDictionary = new Dictionary<string, string>();
            string baseFolder = AppDomain.CurrentDomain.BaseDirectory + "/Download/";

            // get all razor templates
            var razorTemplates = Directory.GetFiles($"{HostingEnvironment.ApplicationPhysicalPath}/Views", "*.cshtml", SearchOption.AllDirectories).Where(c => c.ToLower().Contains(fileTypeName)).ToArray();

            //Parallel.ForEach(appInfo.TableInfomation, (tableInfo) =>
            //{

            foreach (ModelInfo tableInfo in appInfo.TableInfomation)
            {
                string innerFolder = tableInfo.TableName + "Service";
                string currentFolder = baseFolder + innerFolder;
                Directory.CreateDirectory(currentFolder);


                foreach (var file in razorTemplates)
                {
                    var relativePath = file.Replace(HostingEnvironment.ApplicationPhysicalPath, String.Empty);

                    Type type = BuildManager.GetCompiledType(relativePath);

                    var modelProperty = type.GetProperties().FirstOrDefault(p => p.Name == "Model");

                    if (modelProperty != null && modelProperty.PropertyType == typeof(ModelInfo))
                    {
                        // You got the correct type
                        string[] viewNamebreakDown = modelProperty.ReflectedType.Name.Split('_');
                        string fileName = viewNamebreakDown[viewNamebreakDown.Length - 4]; // the name of the class
                        string fileType = viewNamebreakDown[viewNamebreakDown.Length - 3];
                            // the type of class .. backend.. test.. presentation.. ui
                        string languageType = viewNamebreakDown[viewNamebreakDown.Length - 2];
                            // the language .. cs.. js.. html .. css.. ..cshtml

                        string classText = null;
                        using (var sw = new StringWriter())
                        {
                            ViewData.Model = tableInfo;
                            var viewResult = ViewEngines.Engines.FindPartialView(ControllerContext,
                                $"{fileName}_{fileType}_{languageType}");
                            var viewContext = new ViewContext(ControllerContext, viewResult.View,
                                ViewData, TempData, sw);
                            viewResult.View.Render(viewContext, sw);
                            viewResult.ViewEngine.ReleaseView(ControllerContext, viewResult.View);
                            classText = sw.GetStringBuilder().ToString();
                        }

                        string path = currentFolder + "/" + fileName;

                        using (FileStream fs = System.IO.File.Create(path))
                        {
                            Byte[] info = new UTF8Encoding(true).GetBytes(classText);
                            fs.Write(info, 0, info.Length);
                        }
                        if (!filesDictionary.ContainsKey(path))
                            filesDictionary.Add(path, innerFolder + "/" + fileName + "." + languageType);
                    }
                }
             }
            //});

            string zipFolder = baseFolder + "/Services.zip";

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

            return File(zipFolder,"application/zip", "bundle.zip");

        }
    }
}