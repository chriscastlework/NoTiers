// <auto-generated>
// ReSharper disable ConvertPropertyToExpressionBody
// ReSharper disable DoNotCallOverridableMethodsInConstructor
// ReSharper disable InconsistentNaming
// ReSharper disable PartialMethodWithSinglePart
// ReSharper disable PartialTypeWithSinglePart
// ReSharper disable RedundantNameQualifier
// ReSharper disable RedundantOverridenMember
// ReSharper disable UseNameofExpression
// TargetFrameworkVersion = 4.52
#pragma warning disable 1591    //  Ignore "Missing XML Comment" warning


namespace CustomLogic.LegacyDatabase
{

    // ExternalIntegrations
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class ExternalIntegration
    {
        public int Id { get; set; } // Id (Primary key)
        public int OrganisationId { get; set; } // OrganisationId
        public int ApiConnectorId { get; set; } // ApiConnectorId
        public bool Enabled { get; set; } // Enabled
        public string Username { get; set; } // Username
        public string Password { get; set; } // Password
        public string ExternalOrganisationId { get; set; } // ExternalOrganisationId
        public string CustomScript { get; set; } // CustomScript
        public string CustomUserScript { get; set; } // CustomUserScript
        public bool? ImportMissingUsers { get; set; } // ImportMissingUsers
        public bool? DailyBulkUpdateEnabled { get; set; } // DailyBulkUpdateEnabled
        public System.DateTime? BulkUpdateTime { get; set; } // BulkUpdateTime

        // Reverse navigation
        public virtual System.Collections.Generic.ICollection<ExternalIntegrationTypeMapping> ExternalIntegrationTypeMappings { get; set; } // ExternalIntegrationTypeMappings.FK_dbo.ExternalIntegrationTypeMappings_dbo.ExternalIntegrations_ExternalIntegrationId

        // Foreign keys
        public virtual ApiConnector ApiConnector { get; set; } // FK_dbo.ExternalIntegrations_dbo.ApiConnectors_ApiConnectorId

        public ExternalIntegration()
        {
            ExternalIntegrationTypeMappings = new System.Collections.Generic.List<ExternalIntegrationTypeMapping>();
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>