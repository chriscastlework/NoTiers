using System;
using System.Data;
using System.Net.Mime;

namespace CustomLogic.SchemaBuilder.MicrosoftSQL.SchemaModels
{
    public class TableInfo
    {
        public string Name { get; set; }
        public string Owner { get; set; }
        public string Type { get; set; }
        public string Created_datetime { get; set; }
        
    }
}