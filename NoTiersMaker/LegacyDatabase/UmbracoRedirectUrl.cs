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

    // umbracoRedirectUrl
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class UmbracoRedirectUrl
    {
        public System.Guid Id { get; set; } // id (Primary key)
        public System.Guid ContentKey { get; set; } // contentKey
        public System.DateTime CreateDateUtc { get; set; } // createDateUtc
        public string Url { get; set; } // url (length: 255)
        public string UrlHash { get; set; } // urlHash (length: 40)


        public UmbracoRedirectUrl()
        {
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
