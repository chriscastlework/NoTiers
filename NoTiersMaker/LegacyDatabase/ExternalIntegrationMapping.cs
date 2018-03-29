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
    public partial class ExternalIntegrationMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<ExternalIntegration>
    {
        public ExternalIntegrationMapping()
            : this("dbo")
        {
        }

        public ExternalIntegrationMapping(string schema)
        {
            ToTable("ExternalIntegrations", schema);
            HasKey(x => x.Id);

            Property(x => x.Id).HasColumnName(@"Id").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.OrganisationId).HasColumnName(@"OrganisationId").HasColumnType("int").IsRequired();
            Property(x => x.ApiConnectorId).HasColumnName(@"ApiConnectorId").HasColumnType("int").IsRequired();
            Property(x => x.Enabled).HasColumnName(@"Enabled").HasColumnType("bit").IsRequired();
            Property(x => x.Username).HasColumnName(@"Username").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.Password).HasColumnName(@"Password").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.ExternalOrganisationId).HasColumnName(@"ExternalOrganisationId").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.CustomScript).HasColumnName(@"CustomScript").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.CustomUserScript).HasColumnName(@"CustomUserScript").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.ImportMissingUsers).HasColumnName(@"ImportMissingUsers").HasColumnType("bit").IsOptional();
            Property(x => x.DailyBulkUpdateEnabled).HasColumnName(@"DailyBulkUpdateEnabled").HasColumnType("bit").IsOptional();
            Property(x => x.BulkUpdateTime).HasColumnName(@"BulkUpdateTime").HasColumnType("datetime2").IsOptional();

            // Foreign keys
            HasRequired(a => a.ApiConnector).WithMany(b => b.ExternalIntegrations).HasForeignKey(c => c.ApiConnectorId); // FK_dbo.ExternalIntegrations_dbo.ApiConnectors_ApiConnectorId
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>