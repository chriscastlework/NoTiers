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

    // umbracoExternalLogin
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class UmbracoExternalLoginMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<UmbracoExternalLogin>
    {
        public UmbracoExternalLoginMapping()
            : this("dbo")
        {
        }

        public UmbracoExternalLoginMapping(string schema)
        {
            ToTable("umbracoExternalLogin", schema);
            HasKey(x => x.Id);

            Property(x => x.Id).HasColumnName(@"id").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.UserId).HasColumnName(@"userId").HasColumnType("int").IsRequired();
            Property(x => x.LoginProvider).HasColumnName(@"loginProvider").HasColumnType("nvarchar").IsRequired().HasMaxLength(4000);
            Property(x => x.ProviderKey).HasColumnName(@"providerKey").HasColumnType("nvarchar").IsRequired().HasMaxLength(4000);
            Property(x => x.CreateDate).HasColumnName(@"createDate").HasColumnType("datetime").IsRequired();
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>