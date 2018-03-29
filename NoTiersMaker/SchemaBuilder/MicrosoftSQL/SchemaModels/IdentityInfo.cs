namespace CustomLogic.SchemaBuilder.MicrosoftSQL.SchemaModels
{
    public class IdentityInfo
    {
        public string Identity { get; set; }
        public string Seed { get; set; }
        public string Increment { get; set; }
        /// <summary>
        /// This will always be empty as i dont know how to sort this out
        /// </summary>
        public string NotForReplication { get; set; }
    }
}