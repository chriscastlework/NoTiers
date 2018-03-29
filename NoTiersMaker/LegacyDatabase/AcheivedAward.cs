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
    public partial class AcheivedAward
    {
        public int Id { get; set; } // Id (Primary key)
        public int UserId1 { get; set; } // UserId
        public int AwardId { get; set; } // AwardId
        public System.DateTime? AcheviedDate { get; set; } // AcheviedDate
        public string UserId { get; set; } // User_Id (length: 128)

        // Foreign keys
        public virtual Award Award { get; set; } // FK_dbo.AcheivedAwards_dbo.Awards_AwardId
        public virtual User User { get; set; } // FK_dbo.AcheivedAwards_dbo.Users_User_Id

        public AcheivedAward()
        {
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>