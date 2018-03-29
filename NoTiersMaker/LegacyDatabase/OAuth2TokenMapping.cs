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

    // OAuth2Token
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class OAuth2TokenMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<OAuth2Token>
    {
        public OAuth2TokenMapping()
            : this("dbo")
        {
        }

        public OAuth2TokenMapping(string schema)
        {
            ToTable("OAuth2Token", schema);
            HasKey(x => x.Id);

            Property(x => x.Id).HasColumnName(@"Id").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.OAuth2TokenType).HasColumnName(@"OAuth2TokenType").HasColumnType("int").IsRequired();
            Property(x => x.CreatedDateTime).HasColumnName(@"CreatedDateTime").HasColumnType("datetime2").IsOptional();
            Property(x => x.UserId).HasColumnName(@"User_Id").HasColumnType("nvarchar").IsOptional().HasMaxLength(128);
            Property(x => x.AccessToken).HasColumnName(@"AccessToken").HasColumnType("nvarchar(max)").IsOptional();

            // Foreign keys
            HasOptional(a => a.User).WithMany(b => b.OAuth2Token).HasForeignKey(c => c.UserId).WillCascadeOnDelete(false); // FK_dbo.OAuth2Token_dbo.Users_User_Id
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>