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

    // Searches
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class SearchMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Search>
    {
        public SearchMapping()
            : this("dbo")
        {
        }

        public SearchMapping(string schema)
        {
            ToTable("Searches", schema);
            HasKey(x => x.Id);

            Property(x => x.Id).HasColumnName(@"Id").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.SerachType).HasColumnName(@"SerachType").HasColumnType("int").IsRequired();
            Property(x => x.SearchValue).HasColumnName(@"SearchValue").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.RuleId).HasColumnName(@"RuleId").HasColumnType("int").IsRequired();

            // Foreign keys
            HasRequired(a => a.Rule).WithMany(b => b.Searches).HasForeignKey(c => c.RuleId); // FK_dbo.Searches_dbo.Rules_Rule_Id
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>
