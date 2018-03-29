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

    // ApiKeys
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class ApiKey
    {
        public int Id { get; set; } // Id (Primary key)
        public string Key { get; set; } // Key
        public bool Enabled { get; set; } // Enabled
        public System.DateTime? DateCreated { get; set; } // DateCreated
        public System.DateTime? DateLastModeified { get; set; } // DateLastModeified
        public string CreatedById { get; set; } // CreatedById (length: 128)
        public string LastModifiedById { get; set; } // LastModifiedById (length: 128)
        public string ContactFirst { get; set; } // ContactFirst
        public string ContactLast { get; set; } // ContactLast
        public string ContactEmail { get; set; } // ContactEmail
        public int? OrganisationId { get; set; } // OrganisationId
        public string Company { get; set; } // Company

        // Foreign keys
        public virtual Organisation Organisation { get; set; } // FK_dbo.ApiKeys_dbo.Organisations_OrganisationId
        public virtual User CreatedBy { get; set; } // FK_dbo.ApiKeys_dbo.Users_CreatedById
        public virtual User LastModifiedBy { get; set; } // FK_dbo.ApiKeys_dbo.Users_LastModifiedById

        public ApiKey()
        {
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
