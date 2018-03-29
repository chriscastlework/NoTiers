namespace CustomLogic.SchemaBuilder.MicrosoftSQL.SchemaModels
{
    public class TableFkInfo
    {
        /// <summary>
        /// This will always be empty as the table column has spaces in the data table and i don't know how to sort this out right now
        /// </summary>
        public string TableIsReferencedByForeignKey { get; set; }
    }
}