using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.Types;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace CustomLogic.Services.PageBuilderService.Frameworks.Angular
{
    public static class NgHelp
    {
        private static string GetNgMapping(this object item)
        {
            var element = JsonConvert.DeserializeObject<Element>(item.ToString());
            if (!string.IsNullOrEmpty(element.mappedEntityId))
            {
                var mapping = element.mappedEntityId.ToString().Replace(element.mappingContextId.ToString(), "").RemoveStuff();
                return mapping;
            }
         
            return "";
        }
        

        private static string RemoveStuff(this string item)
        {
            item = item.Replace("_", "").Replace(".", "");
            return item;
        }

        public static string GetNgTable(Type13 tableElement)
        {
            var newName = tableElement.mappedEntityId.Replace(tableElement.mappingContextId, "").RemoveStuff();
            return $"{newName}.tableParams";
        }

        public static string GetNgTableControllerName(Type13 tableElement)
        {
            if (string.IsNullOrEmpty(tableElement.mappedEntityId))
            {
                return "";
            }
            var newName = tableElement.mappedEntityId.Replace(tableElement.mappingContextId, "").RemoveStuff();
            return newName + "TableController";
        }
        
        public static string GetServiceName(Type13 tableElement)
        {
            if (string.IsNullOrEmpty(tableElement.mappedEntityId))
            {
                return "";
            }
            var newName = tableElement.mappedEntityId.Replace(tableElement.mappingContextId, "").RemoveStuff();
            return newName;
        }


        public static string GetNgTableController(Type13 tableElement)
        {
            if (string.IsNullOrEmpty(tableElement.mappedEntityId))
            {
                return "";
            }
            var newName = tableElement.mappedEntityId.Replace(tableElement.mappingContextId, "").RemoveStuff();
            return $"{newName}TableController as {newName}";
        }
        

        public static string GetNgTableTdFilter(object tableColumHtml)
        {
            var element = JsonConvert.DeserializeObject<Element>(tableColumHtml.ToString());
            if (!string.IsNullOrEmpty(element.mappedEntityId))
            {
                var mapping = element.mappedEntityId.ToString().Replace(element.mappingContextId.ToString(), "").RemoveStuff();
                return "filter=\"{" + mapping + ": 'text'}\"";
            }
            var newName = tableColumHtml;
            return "filter=\"{Id: 'text'}\"";
        }

        public static string GetNgTableTdSort(object tableColumHtml)
        {
            // mihgt have more elements
            return "sortable=\"'Id'\"";
        }

        public static string GetNgTableTdBinding(object tableColumHtml)
        {
            var mapping = tableColumHtml.GetNgMapping();
            return mapping;
        }

        public static string GetLabelBinding(string tableColumHtml)
        {
            if (string.IsNullOrEmpty(tableColumHtml))
            {
                return "";
            }
          
            if (!tableColumHtml.Contains("Org."))
            {
                    return "not a binding lable" + tableColumHtml;
            }
            
            return "{{"+ tableColumHtml + "}}"  ;
        }

    }
}
