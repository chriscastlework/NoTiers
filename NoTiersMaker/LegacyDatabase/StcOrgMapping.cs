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

    // StcOrgs
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class StcOrgMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<StcOrg>
    {
        public StcOrgMapping()
            : this("dbo")
        {
        }

        public StcOrgMapping(string schema)
        {
            ToTable("StcOrgs", schema);
            HasKey(x => new { x.SalesTrainingCompanyId, x.OrganisationId });

            Property(x => x.SalesTrainingCompanyId).HasColumnName(@"SalesTrainingCompanyId").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.None);
            Property(x => x.OrganisationId).HasColumnName(@"OrganisationId").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.None);
            Property(x => x.Priority).HasColumnName(@"Priority").HasColumnType("int").IsRequired();

            // Foreign keys
            HasRequired(a => a.Organisation).WithMany(b => b.StcOrgs).HasForeignKey(c => c.OrganisationId); // FK_dbo.StcOrgs_dbo.Organisations_OrganisationId
            HasRequired(a => a.SalesTrainingCompany).WithMany(b => b.StcOrgs).HasForeignKey(c => c.SalesTrainingCompanyId); // FK_dbo.StcOrgs_dbo.SalesTrainingCompanies_SalesTrainingCompanyId
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>