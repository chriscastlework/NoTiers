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

    // StcOrgs
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class StcOrg
    {
        public int SalesTrainingCompanyId { get; set; } // SalesTrainingCompanyId (Primary key)
        public int OrganisationId { get; set; } // OrganisationId (Primary key)
        public int Priority { get; set; } // Priority

        // Foreign keys
        public virtual Organisation Organisation { get; set; } // FK_dbo.StcOrgs_dbo.Organisations_OrganisationId
        public virtual SalesTrainingCompany SalesTrainingCompany { get; set; } // FK_dbo.StcOrgs_dbo.SalesTrainingCompanies_SalesTrainingCompanyId

        public StcOrg()
        {
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>