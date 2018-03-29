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

    // ViewRecords
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class ViewRecordMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<ViewRecord>
    {
        public ViewRecordMapping()
            : this("dbo")
        {
        }

        public ViewRecordMapping(string schema)
        {
            ToTable("ViewRecords", schema);
            HasKey(x => x.Id);

            Property(x => x.Id).HasColumnName(@"Id").HasColumnType("bigint").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.DateViewed).HasColumnName(@"DateViewed").HasColumnType("datetime2").IsOptional();
            Property(x => x.AccountId).HasColumnName(@"AccountId").HasColumnType("int").IsOptional();
            Property(x => x.ContactId).HasColumnName(@"ContactId").HasColumnType("int").IsOptional();
            Property(x => x.DealId).HasColumnName(@"DealId").HasColumnType("int").IsOptional();
            Property(x => x.TaskId).HasColumnName(@"TaskId").HasColumnType("int").IsOptional();
            Property(x => x.Discriminator).HasColumnName(@"Discriminator").HasColumnType("nvarchar").IsRequired().HasMaxLength(128);
            Property(x => x.UserId).HasColumnName(@"UserId").HasColumnType("nvarchar").IsOptional().HasMaxLength(128);

            // Foreign keys
            HasOptional(a => a.Account).WithMany(b => b.ViewRecords).HasForeignKey(c => c.AccountId); // FK_dbo.ViewRecords_dbo.Accounts_AccountId
            HasOptional(a => a.Contact).WithMany(b => b.ViewRecords).HasForeignKey(c => c.ContactId); // FK_dbo.ViewRecords_dbo.Contacts_ContactId
            HasOptional(a => a.Deal).WithMany(b => b.ViewRecords).HasForeignKey(c => c.DealId); // FK_dbo.ViewRecords_dbo.Deals_DealId
            HasOptional(a => a.Task).WithMany(b => b.ViewRecords).HasForeignKey(c => c.TaskId); // FK_dbo.ViewRecords_dbo.Tasks_TaskId
            HasOptional(a => a.User).WithMany(b => b.ViewRecords).HasForeignKey(c => c.UserId).WillCascadeOnDelete(false); // FK_dbo.ViewRecords_dbo.Users_User_Id
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>
