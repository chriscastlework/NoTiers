using System.Collections.Generic;
using CustomLogic.SchemaBuilder.MicrosoftSQL.SchemaModels;

namespace CSharpeToolSet.Models
{
    /// <summary>
    /// This is used by user to define there application 
    /// </summary>
    public class AppInfo
    {
        public AppInfo()
        {
            TableInfomation = new List<ModelInfo>();
        }
        /// <summary>
        /// Database modle infomation
        /// </summary>
        public List<ModelInfo> TableInfomation { get; set; }
        /// <summary>
        /// Back end templates
        /// </summary>
        public List<TempalateClassModel> Templates { get; set; }
        /// <summary>
        /// Front end templates
        /// </summary>
        public List<TempalateClassModel> FrontEndTemplates { get; set; }
    }
}