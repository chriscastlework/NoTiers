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

    // Statements
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class StatementMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Statement>
    {
        public StatementMapping()
            : this("dbo")
        {
        }

        public StatementMapping(string schema)
        {
            ToTable("Statements", schema);
            HasKey(x => x.Id);

            Property(x => x.Id).HasColumnName(@"Id").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.Name).HasColumnName(@"Name").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.ClassName).HasColumnName(@"ClassName").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.Amount).HasColumnName(@"Amount").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.RuleId).HasColumnName(@"Rule_Id").HasColumnType("int").IsRequired();

            // Foreign keys
            HasRequired(a => a.Rule).WithMany(b => b.Statements).HasForeignKey(c => c.RuleId); // FK_dbo.Statements_dbo.Rules_Rule_Id
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>
