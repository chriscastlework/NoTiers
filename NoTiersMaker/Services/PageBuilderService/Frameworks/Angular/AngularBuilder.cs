using System;
using System.Collections.Generic;
using System.Linq;
using CustomLogic.Core.Helpers;
using CustomLogic.Core.Models;
using CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses;
using CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.Types;
using Newtonsoft.Json;
using Element = CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.Types.Element;

namespace CustomLogic.Services.PageBuilderService.FrameWorks.Angular
{
    public static class AngularBuilder
    {
        private const string PlaceHolder = "<@>"; // Use in templates so child elements know where to be rendered
        private const string ClassPrefix = "Type"; // All my models and templates are called TypeN for templates and models 
        private static readonly string[] BadHtmlArray = new[] {"<div class=\"row\"/>"}; // Any bad types of HTML can be eleiminated by adding here


        public static Response<PageObject> ConvertApp(PageDefiniton pageObject)
        {
            var result = new Response<PageObject>();
            PageObject pageHtmlCssJavascript = new PageObject();
            CreateHtml(pageObject, pageHtmlCssJavascript);
            result.Data = pageHtmlCssJavascript;
            return result;
        }
        
        private static void CreateHtml(PageDefiniton pageObject, PageObject pageHtmlCssJavascript)
        {
            string mainHtml = "";
            foreach (var elements in pageObject.page.elements)
            {
                var html = CreateHtmlForElement(elements);
                if (!BadHtmlArray.Contains(html))
                {
                    mainHtml += html;
                }
            }
            pageHtmlCssJavascript.Html = mainHtml;
        }
        
        /// <summary>
        /// Recursive function loops though inner elements to create html
        /// </summary>
        /// <param name="currentElement"></param>
        /// <param name="templatesList"></param>
        /// <param name="newController"></param>
        /// <returns></returns>
        public static string CreateHtmlForElement(object currentElement,  List<IPageBuilderTemplate> templatesList = null, bool newController = false)
        {
            if (templatesList == null)
            {
                InterfaceLoader<IPageBuilderTemplate> pageBuilderTemplateClasses = new InterfaceLoader<IPageBuilderTemplate>();
                templatesList = pageBuilderTemplateClasses.InterfaceImplementations;
            }

            string elementHtml = "";
            
            var element = JsonConvert.DeserializeObject<Element>(currentElement.ToString());
            
            var templateClass = templatesList.FirstOrDefault(c => c.GetClassName() == ClassPrefix + element.type);
            
            if (templateClass != null)
            {
                Type templateType = templateClass.GetType(); 
                IPageBuilderTemplate newClass = (IPageBuilderTemplate)Activator.CreateInstance(templateType); // Create new instance can not reuse old ones
                elementHtml = newClass.CreateHtml(currentElement);
            }
            else
            {
                //throw new Exception("What is this?");
                // what the hell is this?
            }

            string innerElementHtml = String.Empty;

            if (element.elements != null)
            {
                foreach (var innerElement in element.elements)
                {
                    var html = CreateHtmlForElement(innerElement, templatesList, newController); // inner element html
                    innerElementHtml += html; // acumilated inner element html 
                }
            }
            return elementHtml.Replace(PlaceHolder, innerElementHtml); ;
        }
    }
}
