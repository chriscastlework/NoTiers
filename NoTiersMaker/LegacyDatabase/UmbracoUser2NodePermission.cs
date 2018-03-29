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

    // umbracoUser2NodePermission
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class UmbracoUser2NodePermission
    {
        public int UserId { get; set; } // userId (Primary key)
        public int NodeId { get; set; } // nodeId (Primary key)
        public string Permission { get; set; } // permission (Primary key) (length: 255)

        // Foreign keys
        public virtual UmbracoNode UmbracoNode { get; set; } // FK_umbracoUser2NodePermission_umbracoNode_id
        public virtual UmbracoUser UmbracoUser { get; set; } // FK_umbracoUser2NodePermission_umbracoUser_id

        public UmbracoUser2NodePermission()
        {
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
