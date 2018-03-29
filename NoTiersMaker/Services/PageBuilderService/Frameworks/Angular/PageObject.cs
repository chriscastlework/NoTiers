using System;

namespace CustomLogic.Services.PageBuilderService.FrameWorks.Angular
{
    public class PageObject
    {
        public PageObject()
        {
            Html = String.Empty;
            Css = String.Empty;
            JavaScript = String.Empty;
        }

        public string Id { get; set; }
        public string Html { get; set; }
        public string JavaScript { get; set; }
        public string Css { get; set; }
    }
}