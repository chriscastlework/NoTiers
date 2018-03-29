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

    // DealShares
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class DealShare
    {
        public int Id { get; set; } // Id (Primary key)
        public string UserId { get; set; } // UserId
        public System.DateTime? DateShared { get; set; } // DateShared
        public int? DealId { get; set; } // Deal_Id
        public bool Writable { get; set; } // Writable

        // Foreign keys
        public virtual Deal Deal { get; set; } // FK_dbo.DealShares_dbo.Deals_Deal_Id

        public DealShare()
        {
            Writable = false;
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>