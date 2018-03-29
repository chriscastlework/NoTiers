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

    // Roles
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class Role
    {
        public string Id { get; set; } // Id (Primary key) (length: 128)
        public string Name { get; set; } // Name (length: 256)
        public bool EnabledForAllOrgs { get; set; } // EnabledForAllOrgs

        // Reverse navigation
        public virtual System.Collections.Generic.ICollection<RoleClaim> RoleClaims { get; set; } // RoleClaims.FK_dbo.RoleClaims_dbo.Roles_ApplicationRole_Id
        public virtual System.Collections.Generic.ICollection<UserRole> UserRoles { get; set; } // Many to many mapping

        public Role()
        {
            EnabledForAllOrgs = false;
            RoleClaims = new System.Collections.Generic.List<RoleClaim>();
            UserRoles = new System.Collections.Generic.List<UserRole>();
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
