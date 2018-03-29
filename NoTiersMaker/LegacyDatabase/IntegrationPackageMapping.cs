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

    // IntegrationPackages
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class IntegrationPackageMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<IntegrationPackage>
    {
        public IntegrationPackageMapping()
            : this("dbo")
        {
        }

        public IntegrationPackageMapping(string schema)
        {
            ToTable("IntegrationPackages", schema);
            HasKey(x => x.Id);

            Property(x => x.Id).HasColumnName(@"Id").HasColumnType("uniqueidentifier").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.Name).HasColumnName(@"Name").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.Description).HasColumnName(@"Description").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.HashedPassword).HasColumnName(@"HashedPassword").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.PasswordSalt).HasColumnName(@"PasswordSalt").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.DateCreated).HasColumnName(@"DateCreated").HasColumnType("datetime2").IsOptional();
            Property(x => x.DateLastModified).HasColumnName(@"DateLastModified").HasColumnType("datetime2").IsOptional();
            Property(x => x.CreatedById).HasColumnName(@"CreatedById").HasColumnType("nvarchar").IsOptional().HasMaxLength(128);
            Property(x => x.LastModifiedById).HasColumnName(@"LastModifiedById").HasColumnType("nvarchar").IsOptional().HasMaxLength(128);
            Property(x => x.OrganisationId).HasColumnName(@"Organisation_Id").HasColumnType("int").IsOptional();
            Property(x => x.Active).HasColumnName(@"Active").HasColumnType("bit").IsRequired();
            Property(x => x.OriginalPackageId).HasColumnName(@"OriginalPackageId").HasColumnType("uniqueidentifier").IsRequired();
            Property(x => x.Installed).HasColumnName(@"Installed").HasColumnType("bit").IsRequired();

            // Foreign keys
            HasOptional(a => a.CreatedBy).WithMany(b => b.IntegrationPackages_CreatedById).HasForeignKey(c => c.CreatedById).WillCascadeOnDelete(false); // FK_dbo.IntegrationPackages_dbo.Users_CreatedById
            HasOptional(a => a.LastModifiedBy).WithMany(b => b.IntegrationPackages_LastModifiedById).HasForeignKey(c => c.LastModifiedById).WillCascadeOnDelete(false); // FK_dbo.IntegrationPackages_dbo.Users_LastModifiedById
            HasOptional(a => a.Organisation).WithMany(b => b.IntegrationPackages).HasForeignKey(c => c.OrganisationId).WillCascadeOnDelete(false); // FK_dbo.IntegrationPackages_dbo.Organisations_Organisation_Id
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>
