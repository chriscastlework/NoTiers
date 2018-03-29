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

    // ScopeClaims
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class IdenServ_ScopeClaim
    {
        public int Id { get; set; } // Id (Primary key)
        public string Name { get; set; } // Name (length: 200)
        public string Description { get; set; } // Description (length: 1000)
        public bool AlwaysIncludeInIdToken { get; set; } // AlwaysIncludeInIdToken
        public int? ScopeId { get; set; } // Scope_Id

        // Foreign keys
        public virtual IdenServ_Scope IdenServ_Scope { get; set; } // FK_IdenServ.ScopeClaims_IdenServ.Scopes_Scope_Id

        public IdenServ_ScopeClaim()
        {
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>