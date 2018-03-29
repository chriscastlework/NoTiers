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

    // Stages
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class Stage
    {
        public int Id { get; set; } // Id (Primary key)
        public string Name { get; set; } // Name
        public int SalesProcessId { get; set; } // SalesProcessId
        public int OrderInProcess { get; set; } // OrderInProcess
        public int StagePercent { get; set; } // StagePercent
        public string Description { get; set; } // Description
        public string ExternalId { get; set; } // ExternalId
        public bool Won { get; set; } // Won
        public bool Closed { get; set; } // Closed

        // Reverse navigation
        public virtual System.Collections.Generic.ICollection<Account> Accounts { get; set; } // Accounts.FK_dbo.Accounts_dbo.Stages_StageId
        public virtual System.Collections.Generic.ICollection<Contact> Contacts { get; set; } // Contacts.FK_dbo.Contacts_dbo.Stages_StageId
        public virtual System.Collections.Generic.ICollection<CustomObjectRow> CustomObjectRows { get; set; } // CustomObjectRows.FK_dbo.CustomTableRows_dbo.Stages_StageId
        public virtual System.Collections.Generic.ICollection<Deal> Deals { get; set; } // Deals.FK_dbo.Deals_dbo.Stages_StageId
        public virtual System.Collections.Generic.ICollection<DealStageHistory> NewStage { get; set; } // DealStageHistories.FK_dbo.DealStageHistories_dbo.Stages_NewStageId
        public virtual System.Collections.Generic.ICollection<DealStageHistory> OldStage { get; set; } // DealStageHistories.FK_dbo.DealStageHistories_dbo.Stages_OldStageId
        public virtual System.Collections.Generic.ICollection<Section> Sections { get; set; } // Sections.FK_dbo.Sections_dbo.Stages_StageId
        public virtual System.Collections.Generic.ICollection<Step> Steps { get; set; } // Steps.FK_dbo.Steps_dbo.Stages_StageId
        public virtual System.Collections.Generic.ICollection<Task> Tasks { get; set; } // Tasks.FK_dbo.Tasks_dbo.Stages_StageId

        // Foreign keys
        public virtual SalesProcess SalesProcess { get; set; } // FK_dbo.Stages_dbo.SalesProcesses_SalesProcessId

        public Stage()
        {
            OrderInProcess = 0;
            StagePercent = 0;
            Won = false;
            Closed = false;
            Accounts = new System.Collections.Generic.List<Account>();
            Contacts = new System.Collections.Generic.List<Contact>();
            CustomObjectRows = new System.Collections.Generic.List<CustomObjectRow>();
            Deals = new System.Collections.Generic.List<Deal>();
            NewStage = new System.Collections.Generic.List<DealStageHistory>();
            OldStage = new System.Collections.Generic.List<DealStageHistory>();
            Sections = new System.Collections.Generic.List<Section>();
            Steps = new System.Collections.Generic.List<Step>();
            Tasks = new System.Collections.Generic.List<Task>();
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>