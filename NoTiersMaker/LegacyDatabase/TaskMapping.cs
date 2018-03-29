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

    // Tasks
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class TaskMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Task>
    {
        public TaskMapping()
            : this("dbo")
        {
        }

        public TaskMapping(string schema)
        {
            ToTable("Tasks", schema);
            HasKey(x => x.Id);

            Property(x => x.Id).HasColumnName(@"Id").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.Name).HasColumnName(@"Name").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.DealId).HasColumnName(@"DealId").HasColumnType("int").IsOptional();
            Property(x => x.DueDate).HasColumnName(@"DueDate").HasColumnType("datetime2").IsOptional();
            Property(x => x.IsImportant).HasColumnName(@"IsImportant").HasColumnType("bit").IsRequired();
            Property(x => x.TaskTypeId).HasColumnName(@"TaskTypeId").HasColumnType("int").IsRequired();
            Property(x => x.IsDone).HasColumnName(@"IsDone").HasColumnType("bit").IsRequired();
            Property(x => x.UserId).HasColumnName(@"UserId").HasColumnType("nvarchar").IsRequired().HasMaxLength(128);
            Property(x => x.DateCreated).HasColumnName(@"DateCreated").HasColumnType("datetime2").IsOptional();
            Property(x => x.DateLastModeified).HasColumnName(@"DateLastModeified").HasColumnType("datetime2").IsOptional();
            Property(x => x.CreatedById).HasColumnName(@"CreatedById").HasColumnType("nvarchar").IsOptional().HasMaxLength(128);
            Property(x => x.LastModifiedById).HasColumnName(@"LastModifiedById").HasColumnType("nvarchar").IsOptional().HasMaxLength(128);
            Property(x => x.ChartX).HasColumnName(@"ChartX").HasColumnType("int").IsRequired();
            Property(x => x.ChartY).HasColumnName(@"ChartY").HasColumnType("int").IsRequired();
            Property(x => x.ChartZoom).HasColumnName(@"ChartZoom").HasColumnType("float").IsRequired();
            Property(x => x.MeetingName).HasColumnName(@"MeetingName").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.MeetingDate).HasColumnName(@"MeetingDate").HasColumnType("datetime2").IsOptional();
            Property(x => x.MeetingLocation).HasColumnName(@"MeetingLocation").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.CompletedDate).HasColumnName(@"CompletedDate").HasColumnType("datetime2").IsOptional();
            Property(x => x.AccountId).HasColumnName(@"AccountId").HasColumnType("int").IsOptional();
            Property(x => x.Notes).HasColumnName(@"Notes").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.ExternalId).HasColumnName(@"ExternalId").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.PendingExternalContacts).HasColumnName(@"PendingExternalContacts").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.SalesProcessId).HasColumnName(@"SalesProcessId").HasColumnType("int").IsOptional();
            Property(x => x.StageId).HasColumnName(@"StageId").HasColumnType("int").IsOptional();
            Property(x => x.CustomTableRowId).HasColumnName(@"CustomTableRowId").HasColumnType("bigint").IsOptional();
            Property(x => x.CustomObjectRowId).HasColumnName(@"CustomObjectRow_Id").HasColumnType("bigint").IsOptional();

            // Foreign keys
            HasOptional(a => a.Account).WithMany(b => b.Tasks).HasForeignKey(c => c.AccountId).WillCascadeOnDelete(false); // FK_dbo.Tasks_dbo.Accounts_AccountId
            HasOptional(a => a.CreatedBy).WithMany(b => b.Tasks_CreatedById).HasForeignKey(c => c.CreatedById).WillCascadeOnDelete(false); // FK_dbo.Tasks_dbo.Users_CreatedById
            HasOptional(a => a.CustomObjectRow).WithMany(b => b.Tasks).HasForeignKey(c => c.CustomObjectRowId).WillCascadeOnDelete(false); // FK_dbo.Tasks_dbo.CustomObjectRows_CustomObjectRow_Id
            HasOptional(a => a.Deal).WithMany(b => b.Tasks).HasForeignKey(c => c.DealId).WillCascadeOnDelete(false); // FK_dbo.Tasks_dbo.Deals_DealId
            HasOptional(a => a.LastModifiedBy).WithMany(b => b.Tasks_LastModifiedById).HasForeignKey(c => c.LastModifiedById).WillCascadeOnDelete(false); // FK_dbo.Tasks_dbo.Users_LastModifiedById
            HasOptional(a => a.SalesProcess).WithMany(b => b.Tasks).HasForeignKey(c => c.SalesProcessId).WillCascadeOnDelete(false); // FK_dbo.Tasks_dbo.SalesProcesses_SalesProcessId
            HasOptional(a => a.Stage).WithMany(b => b.Tasks).HasForeignKey(c => c.StageId).WillCascadeOnDelete(false); // FK_dbo.Tasks_dbo.Stages_StageId
            HasRequired(a => a.TaskType).WithMany(b => b.Tasks).HasForeignKey(c => c.TaskTypeId); // FK_dbo.Tasks_dbo.TaskTypes_TaskTypeId
            HasRequired(a => a.User_UserId).WithMany(b => b.Tasks_UserId).HasForeignKey(c => c.UserId); // FK_dbo.Tasks_dbo.Users_UserId
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>