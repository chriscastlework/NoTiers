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

    // EditionCosts
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class EditionCostMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<EditionCost>
    {
        public EditionCostMapping()
            : this("dbo")
        {
        }

        public EditionCostMapping(string schema)
        {
            ToTable("EditionCosts", schema);
            HasKey(x => x.EditionCostId);

            Property(x => x.LastUpdated).HasColumnName(@"LastUpdated").HasColumnType("datetime2").IsOptional();
            Property(x => x.Currency).HasColumnName(@"Currency").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.Cost).HasColumnName(@"Cost").HasColumnType("decimal").IsRequired().HasPrecision(18,2);
            Property(x => x.EditionId).HasColumnName(@"Edition_Id").HasColumnType("int").IsOptional();
            Property(x => x.BraintreePlanId).HasColumnName(@"BraintreePlanId").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.EditionCostId).HasColumnName(@"EditionCostId").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);

            // Foreign keys
            HasOptional(a => a.Edition).WithMany(b => b.EditionCosts).HasForeignKey(c => c.EditionId).WillCascadeOnDelete(false); // FK_dbo.EditionCosts_dbo.Editions_Edition_Id
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>