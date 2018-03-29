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

    // LeadConversions
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class LeadConversionMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<LeadConversion>
    {
        public LeadConversionMapping()
            : this("dbo")
        {
        }

        public LeadConversionMapping(string schema)
        {
            ToTable("LeadConversions", schema);
            HasKey(x => x.Id);

            Property(x => x.Id).HasColumnName(@"Id").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.DealId).HasColumnName(@"DealId").HasColumnType("int").IsRequired();
            Property(x => x.DateCreated).HasColumnName(@"DateCreated").HasColumnType("datetime2").IsOptional();
            Property(x => x.DateLastModeified).HasColumnName(@"DateLastModeified").HasColumnType("datetime2").IsOptional();
            Property(x => x.CreatedById).HasColumnName(@"CreatedById").HasColumnType("nvarchar").IsOptional().HasMaxLength(128);
            Property(x => x.LastModifiedById).HasColumnName(@"LastModifiedById").HasColumnType("nvarchar").IsOptional().HasMaxLength(128);
            Property(x => x.ApprovalDate).HasColumnName(@"ApprovalDate").HasColumnType("datetime2").IsOptional();
            Property(x => x.Approved).HasColumnName(@"Approved").HasColumnType("bit").IsRequired();
            Property(x => x.FailureReason).HasColumnName(@"FailureReason").HasColumnType("nvarchar(max)").IsOptional();

            // Foreign keys
            HasOptional(a => a.CreatedBy).WithMany(b => b.LeadConversions_CreatedById).HasForeignKey(c => c.CreatedById).WillCascadeOnDelete(false); // FK_dbo.LeadConversions_dbo.Users_CreatedById
            HasOptional(a => a.LastModifiedBy).WithMany(b => b.LeadConversions_LastModifiedById).HasForeignKey(c => c.LastModifiedById).WillCascadeOnDelete(false); // FK_dbo.LeadConversions_dbo.Users_LastModifiedById
            HasRequired(a => a.Deal).WithMany(b => b.LeadConversions).HasForeignKey(c => c.DealId); // FK_dbo.LeadConversions_dbo.Deals_DealId
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>