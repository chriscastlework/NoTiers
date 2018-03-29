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

    // UsageRecords
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class UsageRecord
    {
        public int Id { get; set; } // Id (Primary key)
        public string UserId { get; set; } // UserId (length: 128)
        public int? UsageActionId { get; set; } // UsageActionId
        public long? StandardObjectDefinitionId { get; set; } // StandardObjectDefinitionId
        public int? RecordId { get; set; } // RecordId
        public System.DateTime DateOfAction { get; set; } // DateOfAction

        // Foreign keys
        public virtual StandardObjectDefinition StandardObjectDefinition { get; set; } // FK_dbo.UsageRecords_dbo.StandardObjectDefinitions_StandardObjectDefinitionId
        public virtual UsageAction UsageAction { get; set; } // FK_dbo.UsageRecords_dbo.UsageActions_UsageActionId
        public virtual User User { get; set; } // FK_dbo.UsageRecords_dbo.Users_UserId

        public UsageRecord()
        {
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
