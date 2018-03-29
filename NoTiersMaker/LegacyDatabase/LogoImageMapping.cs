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

    // LogoImages
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class LogoImageMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<LogoImage>
    {
        public LogoImageMapping()
            : this("dbo")
        {
        }

        public LogoImageMapping(string schema)
        {
            ToTable("LogoImages", schema);
            HasKey(x => x.Id);

            Property(x => x.Id).HasColumnName(@"Id").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.Image).HasColumnName(@"Image").HasColumnType("varbinary").IsOptional();
            Property(x => x.AccountId).HasColumnName(@"AccountId").HasColumnType("int").IsOptional();
            Property(x => x.Discriminator).HasColumnName(@"Discriminator").HasColumnType("nvarchar").IsRequired().HasMaxLength(128);
            Property(x => x.ContactId).HasColumnName(@"ContactId").HasColumnType("int").IsOptional();
            Property(x => x.UserId).HasColumnName(@"UserId").HasColumnType("nvarchar").IsOptional().HasMaxLength(128);

            // Foreign keys
            HasOptional(a => a.Account).WithMany(b => b.LogoImages).HasForeignKey(c => c.AccountId); // FK_dbo.LogoImages_dbo.Accounts_AccountId
            HasOptional(a => a.Contact).WithMany(b => b.LogoImages).HasForeignKey(c => c.ContactId); // FK_dbo.LogoImages_dbo.Contacts_ContactId
            HasOptional(a => a.User).WithMany(b => b.LogoImages).HasForeignKey(c => c.UserId).WillCascadeOnDelete(false); // FK_dbo.LogoImages_dbo.Users_User_Id
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>
