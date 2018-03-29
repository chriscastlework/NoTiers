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

    // UserRoles
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class UserRole
    {
        public string UserId { get; set; } // UserId (Primary key) (length: 128)
        public string RoleId { get; set; } // RoleId (Primary key) (length: 128)
        public string IdentityUserId { get; set; } // IdentityUser_Id (length: 128)

        // Foreign keys
        public virtual Role Role { get; set; } // FK_dbo.UserRoles_dbo.Roles_RoleId
        public virtual User User { get; set; } // FK_dbo.UserRoles_dbo.Users_IdentityUser_Id

        public UserRole()
        {
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>