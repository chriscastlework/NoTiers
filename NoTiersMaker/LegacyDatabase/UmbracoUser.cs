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

    // umbracoUser
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class UmbracoUser
    {
        public int Id { get; set; } // id (Primary key)
        public bool UserDisabled { get; set; } // userDisabled
        public bool UserNoConsole { get; set; } // userNoConsole
        public int UserType { get; set; } // userType
        public int StartStructureId { get; set; } // startStructureID
        public int? StartMediaId { get; set; } // startMediaID
        public string UserName { get; set; } // userName (length: 255)
        public string UserLogin { get; set; } // userLogin (length: 125)
        public string UserPassword { get; set; } // userPassword (length: 500)
        public string UserEmail { get; set; } // userEmail (length: 255)
        public string UserLanguage { get; set; } // userLanguage (length: 10)
        public string SecurityStampToken { get; set; } // securityStampToken (length: 255)
        public int? FailedLoginAttempts { get; set; } // failedLoginAttempts
        public System.DateTime? LastLockoutDate { get; set; } // lastLockoutDate
        public System.DateTime? LastPasswordChangeDate { get; set; } // lastPasswordChangeDate
        public System.DateTime? LastLoginDate { get; set; } // lastLoginDate

        // Reverse navigation
        public virtual System.Collections.Generic.ICollection<CmsTask> ParentUser { get; set; } // cmsTask.FK_cmsTask_umbracoUser
        public virtual System.Collections.Generic.ICollection<CmsTask> User { get; set; } // cmsTask.FK_cmsTask_umbracoUser1
        public virtual System.Collections.Generic.ICollection<UmbracoUser2App> UmbracoUser2App { get; set; } // Many to many mapping
        public virtual System.Collections.Generic.ICollection<UmbracoUser2NodeNotify> UmbracoUser2NodeNotify { get; set; } // Many to many mapping
        public virtual System.Collections.Generic.ICollection<UmbracoUser2NodePermission> UmbracoUser2NodePermission { get; set; } // Many to many mapping

        // Foreign keys
        public virtual UmbracoUserType UmbracoUserType { get; set; } // FK_umbracoUser_umbracoUserType_id

        public UmbracoUser()
        {
            UserDisabled = true;
            UserNoConsole = true;
            ParentUser = new System.Collections.Generic.List<CmsTask>();
            User = new System.Collections.Generic.List<CmsTask>();
            UmbracoUser2App = new System.Collections.Generic.List<UmbracoUser2App>();
            UmbracoUser2NodeNotify = new System.Collections.Generic.List<UmbracoUser2NodeNotify>();
            UmbracoUser2NodePermission = new System.Collections.Generic.List<UmbracoUser2NodePermission>();
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
