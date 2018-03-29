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

    // Editions
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class Edition
    {
        public int Id { get; set; } // Id (Primary key)
        public string Name { get; set; } // Name
        public int Status { get; set; } // Status
        public int EditionLevel { get; set; } // EditionLevel

        // Reverse navigation
        public virtual System.Collections.Generic.ICollection<AddOn> AddOns { get; set; } // Many to many mapping
        public virtual System.Collections.Generic.ICollection<EditionCost> EditionCosts { get; set; } // EditionCosts.FK_dbo.EditionCosts_dbo.Editions_Edition_Id
        public virtual System.Collections.Generic.ICollection<Feature> Features { get; set; } // Many to many mapping
        public virtual System.Collections.Generic.ICollection<Subscription> Subscriptions { get; set; } // Subscriptions.FK_dbo.Subscriptions_dbo.Editions_EditionId

        public Edition()
        {
            Status = 0;
            EditionLevel = 0;
            EditionCosts = new System.Collections.Generic.List<EditionCost>();
            Subscriptions = new System.Collections.Generic.List<Subscription>();
            AddOns = new System.Collections.Generic.List<AddOn>();
            Features = new System.Collections.Generic.List<Feature>();
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
