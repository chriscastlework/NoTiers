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

    // DealStageHistories
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class DealStageHistoryMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<DealStageHistory>
    {
        public DealStageHistoryMapping()
            : this("dbo")
        {
        }

        public DealStageHistoryMapping(string schema)
        {
            ToTable("DealStageHistories", schema);
            HasKey(x => x.Id);

            Property(x => x.Id).HasColumnName(@"Id").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.DealId).HasColumnName(@"DealId").HasColumnType("int").IsRequired();
            Property(x => x.OldStageId).HasColumnName(@"OldStageId").HasColumnType("int").IsOptional();
            Property(x => x.NewStageId).HasColumnName(@"NewStageId").HasColumnType("int").IsRequired();
            Property(x => x.UserId).HasColumnName(@"UserId").HasColumnType("nvarchar").IsOptional().HasMaxLength(128);
            Property(x => x.Date).HasColumnName(@"Date").HasColumnType("datetime2").IsOptional();

            // Foreign keys
            HasOptional(a => a.OldStage).WithMany(b => b.OldStage).HasForeignKey(c => c.OldStageId).WillCascadeOnDelete(false); // FK_dbo.DealStageHistories_dbo.Stages_OldStageId
            HasOptional(a => a.User).WithMany(b => b.DealStageHistories).HasForeignKey(c => c.UserId).WillCascadeOnDelete(false); // FK_dbo.DealStageHistories_dbo.Users_UserId
            HasRequired(a => a.Deal).WithMany(b => b.DealStageHistories).HasForeignKey(c => c.DealId); // FK_dbo.DealStageHistories_dbo.Deals_DealId
            HasRequired(a => a.NewStage).WithMany(b => b.NewStage).HasForeignKey(c => c.NewStageId); // FK_dbo.DealStageHistories_dbo.Stages_NewStageId
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>