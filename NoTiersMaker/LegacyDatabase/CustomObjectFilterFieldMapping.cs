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

    // CustomObjectFilterFields
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class CustomObjectFilterFieldMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<CustomObjectFilterField>
    {
        public CustomObjectFilterFieldMapping()
            : this("dbo")
        {
        }

        public CustomObjectFilterFieldMapping(string schema)
        {
            ToTable("CustomObjectFilterFields", schema);
            HasKey(x => x.Id);

            Property(x => x.Id).HasColumnName(@"Id").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.CustomObjectFilterId).HasColumnName(@"CustomObjectFilterId").HasColumnType("int").IsRequired();
            Property(x => x.CustomFieldId).HasColumnName(@"CustomFieldId").HasColumnType("int").IsRequired();
            Property(x => x.PrefixText).HasColumnName(@"PrefixText").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.SuffixText).HasColumnName(@"SuffixText").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.Order).HasColumnName(@"Order").HasColumnType("int").IsRequired();

            // Foreign keys
            HasRequired(a => a.CustomField).WithMany(b => b.CustomObjectFilterFields).HasForeignKey(c => c.CustomFieldId); // FK_dbo.CustomObjectFilterFields_dbo.CustomFields_CustomFieldId
            HasRequired(a => a.CustomObjectFilter).WithMany(b => b.CustomObjectFilterFields).HasForeignKey(c => c.CustomObjectFilterId); // FK_dbo.CustomObjectFilterFields_dbo.CustomObjectFilters_CustomObjectFilterId
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>
