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

    // CurrencyAmounts
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class CurrencyAmountMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<CurrencyAmount>
    {
        public CurrencyAmountMapping()
            : this("dbo")
        {
        }

        public CurrencyAmountMapping(string schema)
        {
            ToTable("CurrencyAmounts", schema);
            HasKey(x => x.Id);

            Property(x => x.Id).HasColumnName(@"Id").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.CurrencyCode).HasColumnName(@"CurrencyCode").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.Amount).HasColumnName(@"Amount").HasColumnType("decimal").IsRequired().HasPrecision(18,2);
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>
