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

    // AddOnClaimValues
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class AddOnClaimValue
    {
        public int SubscriptionAddOnId { get; set; } // SubscriptionAddOnId (Primary key)
        public int AddOnClaimId { get; set; } // AddOnClaimId (Primary key)
        public string Value { get; set; } // Value

        // Foreign keys
        public virtual AddOnClaim AddOnClaim { get; set; } // FK_dbo.AddOnClaimValues_dbo.AddOnClaims_AddOnClaimId
        public virtual SubscriptionAddOn SubscriptionAddOn { get; set; } // FK_dbo.AddOnClaimValues_dbo.SubscriptionAddOns_SubscriptionAddOnId

        public AddOnClaimValue()
        {
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
