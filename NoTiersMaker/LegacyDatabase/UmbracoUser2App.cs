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

    // umbracoUser2app
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class UmbracoUser2App
    {
        public int User { get; set; } // user (Primary key)
        public string App { get; set; } // app (Primary key) (length: 50)

        // Foreign keys
        public virtual UmbracoUser UmbracoUser { get; set; } // FK_umbracoUser2app_umbracoUser_id

        public UmbracoUser2App()
        {
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>