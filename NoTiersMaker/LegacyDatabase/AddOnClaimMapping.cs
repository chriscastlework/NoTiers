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

    // AddOnClaims
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class AddOnClaimMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<AddOnClaim>
    {
        public AddOnClaimMapping()
            : this("dbo")
        {
        }

        public AddOnClaimMapping(string schema)
        {
            ToTable("AddOnClaims", schema);
            HasKey(x => x.Id);

            Property(x => x.Id).HasColumnName(@"Id").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.AddOnId).HasColumnName(@"AddOnId").HasColumnType("int").IsRequired();
            Property(x => x.Name).HasColumnName(@"Name").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.Description).HasColumnName(@"Description").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.ClaimType).HasColumnName(@"ClaimType").HasColumnType("nvarchar(max)").IsOptional();

            // Foreign keys
            HasRequired(a => a.AddOn).WithMany(b => b.AddOnClaims).HasForeignKey(c => c.AddOnId).WillCascadeOnDelete(false); // FK_dbo.AddOnClaims_dbo.AddOns_AddOnId
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>
