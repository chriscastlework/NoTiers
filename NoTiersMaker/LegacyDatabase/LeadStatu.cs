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

    // LeadStatus
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class LeadStatu
    {
        public int Id { get; set; } // Id (Primary key)
        public string Label { get; set; } // Label
        public string Key { get; set; } // Key

        // Reverse navigation
        public virtual System.Collections.Generic.ICollection<Deal> Deals { get; set; } // Deals.FK_dbo.Deals_dbo.LeadStatus_LeadStatus_Id

        public LeadStatu()
        {
            Deals = new System.Collections.Generic.List<Deal>();
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
