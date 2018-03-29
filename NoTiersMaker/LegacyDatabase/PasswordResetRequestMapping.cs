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

    // PasswordResetRequests
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class PasswordResetRequestMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<PasswordResetRequest>
    {
        public PasswordResetRequestMapping()
            : this("dbo")
        {
        }

        public PasswordResetRequestMapping(string schema)
        {
            ToTable("PasswordResetRequests", schema);
            HasKey(x => x.Id);

            Property(x => x.Id).HasColumnName(@"Id").HasColumnType("nvarchar").IsRequired().HasMaxLength(128).HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.None);
            Property(x => x.UserId).HasColumnName(@"UserId").HasColumnType("nvarchar").IsOptional().HasMaxLength(128);
            Property(x => x.Used).HasColumnName(@"Used").HasColumnType("bit").IsRequired();
            Property(x => x.Expiry).HasColumnName(@"Expiry").HasColumnType("datetime2").IsOptional();

            // Foreign keys
            HasOptional(a => a.User).WithMany(b => b.PasswordResetRequests).HasForeignKey(c => c.UserId).WillCascadeOnDelete(false); // FK_dbo.PasswordResetRequests_dbo.Users_UserId
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>
