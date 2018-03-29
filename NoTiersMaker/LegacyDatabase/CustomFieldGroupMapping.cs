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

    // CustomFieldGroups
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class CustomFieldGroupMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<CustomFieldGroup>
    {
        public CustomFieldGroupMapping()
            : this("dbo")
        {
        }

        public CustomFieldGroupMapping(string schema)
        {
            ToTable("CustomFieldGroups", schema);
            HasKey(x => x.Id);

            Property(x => x.Id).HasColumnName(@"Id").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.OrganisationId).HasColumnName(@"OrganisationId").HasColumnType("int").IsRequired();
            Property(x => x.Name).HasColumnName(@"Name").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.GroupType).HasColumnName(@"GroupType").HasColumnType("int").IsRequired();
            Property(x => x.IsEnabled).HasColumnName(@"IsEnabled").HasColumnType("bit").IsRequired();
            Property(x => x.DisplayOrder).HasColumnName(@"DisplayOrder").HasColumnType("int").IsRequired();

            // Foreign keys
            HasRequired(a => a.Organisation).WithMany(b => b.CustomFieldGroups).HasForeignKey(c => c.OrganisationId); // FK_dbo.CustomFieldGroups_dbo.Organisations_OrganisationId
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>
