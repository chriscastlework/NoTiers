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

    // ScopeSecrets
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class IdenServ_ScopeSecret
    {
        public int Id { get; set; } // Id (Primary key)
        public string Description { get; set; } // Description (length: 1000)
        public System.DateTimeOffset? Expiration { get; set; } // Expiration
        public string Type { get; set; } // Type (length: 250)
        public string Value { get; set; } // Value (length: 250)
        public int? ScopeId { get; set; } // Scope_Id

        // Foreign keys
        public virtual IdenServ_Scope IdenServ_Scope { get; set; } // FK_IdenServ.ScopeSecrets_IdenServ.Scopes_Scope_Id

        public IdenServ_ScopeSecret()
        {
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
