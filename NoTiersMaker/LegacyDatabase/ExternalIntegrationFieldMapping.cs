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

    // ExternalIntegrationFieldMappings
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class ExternalIntegrationFieldMapping
    {
        public int Id { get; set; } // Id (Primary key)
        public int ExternalIntegrationTypeMappingId { get; set; } // ExternalIntegrationTypeMappingId
        public string ExternalField { get; set; } // ExternalField
        public string VrField { get; set; } // VrField
        public string DirectionalSyncUpRule { get; set; } // DirectionalSyncUpRule
        public string DirectionalSyncDownRule { get; set; } // DirectionalSyncDownRule

        // Foreign keys
        public virtual ExternalIntegrationTypeMapping ExternalIntegrationTypeMapping { get; set; } // FK_dbo.ExternalIntegrationFieldMappings_dbo.ExternalIntegrationTypeMappings_ExternalIntegrationTypeMappingId

        public ExternalIntegrationFieldMapping()
        {
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>