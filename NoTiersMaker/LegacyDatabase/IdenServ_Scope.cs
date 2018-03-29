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

    // Scopes
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class IdenServ_Scope
    {
        public int Id { get; set; } // Id (Primary key)
        public bool Enabled { get; set; } // Enabled
        public string Name { get; set; } // Name (length: 200)
        public string DisplayName { get; set; } // DisplayName (length: 200)
        public string Description { get; set; } // Description (length: 1000)
        public bool Required { get; set; } // Required
        public bool Emphasize { get; set; } // Emphasize
        public int Type { get; set; } // Type
        public bool IncludeAllClaimsForUser { get; set; } // IncludeAllClaimsForUser
        public string ClaimsRule { get; set; } // ClaimsRule (length: 200)
        public bool ShowInDiscoveryDocument { get; set; } // ShowInDiscoveryDocument
        public bool AllowUnrestrictedIntrospection { get; set; } // AllowUnrestrictedIntrospection

        // Reverse navigation
        public virtual System.Collections.Generic.ICollection<IdenServ_ScopeClaim> IdenServ_ScopeClaims { get; set; } // ScopeClaims.FK_IdenServ.ScopeClaims_IdenServ.Scopes_Scope_Id
        public virtual System.Collections.Generic.ICollection<IdenServ_ScopeSecret> IdenServ_ScopeSecrets { get; set; } // ScopeSecrets.FK_IdenServ.ScopeSecrets_IdenServ.Scopes_Scope_Id

        public IdenServ_Scope()
        {
            IdenServ_ScopeClaims = new System.Collections.Generic.List<IdenServ_ScopeClaim>();
            IdenServ_ScopeSecrets = new System.Collections.Generic.List<IdenServ_ScopeSecret>();
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
