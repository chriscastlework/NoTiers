using System;
using CustomLogic.Core.Models;
using CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses;

namespace CustomLogic.Services.PageBuilderService.FrameWorks.SpringX
{
    public class SpringxBuilder
    {
        public Response<string> ConvertApp(PageDefiniton pageObject)
        {
            Response<string> result = new Response<string>();

            string xmlString = "";

            // Create resource xml
            xmlString += CreateResoureXml(pageObject);

            // create ui xml
            xmlString += CreateResoureXml(pageObject);

            // create record data
            xmlString += CreateResoureXml(pageObject);

            // create main data
            xmlString += CreateResoureXml(pageObject);

            result.Data = xmlString;

            return result;
        }
        

        private string CreateResoureXml(PageDefiniton pageObject)
        {
            throw new NotImplementedException();
        }
    }
}
