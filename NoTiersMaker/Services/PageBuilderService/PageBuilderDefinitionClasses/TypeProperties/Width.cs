namespace CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.TypeProperties
{
    public class Width
    {
        public string type { get; set; }
        public string id { get; set; }
        public int width { get; set; }
        public string size { get; set; }

        public string GetSpanSize()
        {
            if (size.ToLower() == "full")
            {
                return "row";
            }
            else
            {
                return "col-md-6";
            }
        }
    }
}