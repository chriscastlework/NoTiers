namespace CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses.TypeProperties
{
    public class Date
    {
        public string id { get; set; }
        public string @default { get; set; }
        public object specifiedDate { get; set; }
        public int adjustmentFactor { get; set; }
        public string adjustmentUnit { get; set; }
        public string @operator { get; set; }
    }
}