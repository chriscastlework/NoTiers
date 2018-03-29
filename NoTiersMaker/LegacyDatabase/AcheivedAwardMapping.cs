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

    // AcheivedAwards
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class AcheivedAwardMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<AcheivedAward>
    {
        public AcheivedAwardMapping()
            : this("dbo")
        {
        }

        public AcheivedAwardMapping(string schema)
        {
            ToTable("AcheivedAwards", schema);
            HasKey(x => x.Id);

            Property(x => x.Id).HasColumnName(@"Id").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.UserId1).HasColumnName(@"UserId").HasColumnType("int").IsRequired();
            Property(x => x.AwardId).HasColumnName(@"AwardId").HasColumnType("int").IsRequired();
            Property(x => x.AcheviedDate).HasColumnName(@"AcheviedDate").HasColumnType("datetime2").IsOptional();
            Property(x => x.UserId).HasColumnName(@"User_Id").HasColumnType("nvarchar").IsOptional().HasMaxLength(128);

            // Foreign keys
            HasOptional(a => a.User).WithMany(b => b.AcheivedAwards).HasForeignKey(c => c.UserId).WillCascadeOnDelete(false); // FK_dbo.AcheivedAwards_dbo.Users_User_Id
            HasRequired(a => a.Award).WithMany(b => b.AcheivedAwards).HasForeignKey(c => c.AwardId); // FK_dbo.AcheivedAwards_dbo.Awards_AwardId
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>
