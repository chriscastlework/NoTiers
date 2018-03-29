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

    // ItemSteps
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class ItemStepMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<ItemStep>
    {
        public ItemStepMapping()
            : this("dbo")
        {
        }

        public ItemStepMapping(string schema)
        {
            ToTable("ItemSteps", schema);
            HasKey(x => x.Id);

            Property(x => x.Id).HasColumnName(@"Id").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.ActionValue).HasColumnName(@"ActionValue").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.ActionIdValue).HasColumnName(@"ActionIdValue").HasColumnType("int").IsOptional();
            Property(x => x.Completed).HasColumnName(@"Completed").HasColumnType("bit").IsRequired();
            Property(x => x.CompletedDateTime).HasColumnName(@"CompletedDateTime").HasColumnType("datetime2").IsOptional();
            Property(x => x.Hidden).HasColumnName(@"Hidden").HasColumnType("bit").IsRequired();
            Property(x => x.StepId).HasColumnName(@"StepId").HasColumnType("int").IsOptional();
            Property(x => x.ReminderTaskId).HasColumnName(@"ReminderTaskId").HasColumnType("int").IsOptional();
            Property(x => x.CustomObjectRowId).HasColumnName(@"CustomObjectRowId").HasColumnType("bigint").IsOptional();
            Property(x => x.TaskId).HasColumnName(@"TaskId").HasColumnType("int").IsOptional();
            Property(x => x.ContactId).HasColumnName(@"ContactId").HasColumnType("int").IsOptional();
            Property(x => x.AccountId).HasColumnName(@"AccountId").HasColumnType("int").IsOptional();
            Property(x => x.Discriminator).HasColumnName(@"Discriminator").HasColumnType("nvarchar").IsRequired().HasMaxLength(128);

            // Foreign keys
            HasOptional(a => a.Account).WithMany(b => b.ItemSteps).HasForeignKey(c => c.AccountId); // FK_dbo.ItemSteps_dbo.Accounts_AccountId
            HasOptional(a => a.Contact).WithMany(b => b.ItemSteps).HasForeignKey(c => c.ContactId); // FK_dbo.ItemSteps_dbo.Contacts_ContactId
            HasOptional(a => a.CustomObjectRow).WithMany(b => b.ItemSteps).HasForeignKey(c => c.CustomObjectRowId); // FK_dbo.ItemSteps_dbo.CustomTableRows_CustomTableRowId
            HasOptional(a => a.ReminderTask).WithMany(b => b.ItemSteps).HasForeignKey(c => c.ReminderTaskId).WillCascadeOnDelete(false); // FK_dbo.ItemSteps_dbo.ReminderTasks_ReminderTaskId
            HasOptional(a => a.Step).WithMany(b => b.ItemSteps).HasForeignKey(c => c.StepId).WillCascadeOnDelete(false); // FK_dbo.ItemSteps_dbo.Steps_StepId
            HasOptional(a => a.Task).WithMany(b => b.ItemSteps).HasForeignKey(c => c.TaskId); // FK_dbo.ItemSteps_dbo.Tasks_TaskId
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>