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

    // Subscriptions
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class Subscription
    {
        public int Id { get; set; } // Id (Primary key)
        public int EditionId { get; set; } // EditionId
        public int GracePeriodDays { get; set; } // GracePeriodDays
        public string BillingCurrency { get; set; } // BillingCurrency
        public decimal BasePrice { get; set; } // BasePrice
        public decimal PricePerUser { get; set; } // PricePerUser
        public int BillDayOfMonth { get; set; } // BillDayOfMonth
        public string BraintreeSubscriptionId { get; set; } // BraintreeSubscriptionId
        public bool ActiveAccount { get; set; } // ActiveAccount
        public System.DateTime? TrialExpires { get; set; } // TrialExpires
        public System.DateTime? AccountCanceled { get; set; } // AccountCanceled
        public bool PayedEditionTrialPeriodUsed { get; set; } // PayedEditionTrialPeriodUsed
        public bool PerpetualTrial { get; set; } // PerpetualTrial

        // Reverse navigation
        public virtual System.Collections.Generic.ICollection<Organisation> Organisations { get; set; } // Organisations.FK_dbo.Organisations_dbo.Subscriptions_Subscription_Id
        public virtual System.Collections.Generic.ICollection<SubscriptionAddOn> SubscriptionAddOns { get; set; } // SubscriptionAddOns.FK_dbo.SubscriptionAddOns_dbo.Subscriptions_SubscriptionId

        // Foreign keys
        public virtual Edition Edition { get; set; } // FK_dbo.Subscriptions_dbo.Editions_EditionId

        public Subscription()
        {
            ActiveAccount = false;
            PayedEditionTrialPeriodUsed = false;
            PerpetualTrial = false;
            Organisations = new System.Collections.Generic.List<Organisation>();
            SubscriptionAddOns = new System.Collections.Generic.List<SubscriptionAddOn>();
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
