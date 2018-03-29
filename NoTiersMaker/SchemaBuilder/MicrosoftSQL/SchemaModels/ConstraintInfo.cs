namespace CustomLogic.SchemaBuilder.MicrosoftSQL.SchemaModels
{
    public class ConstraintInfo
    {
        public string constraint_type { get; set; }
        public string constraint_name { get; set; }
        public string delete_action { get; set; }
        public string update_action { get; set; }

        public string status_enabled { get; set; }
        public string status_for_replication { get; set; }

        public string constraint_keys { get; set; }
    }
}