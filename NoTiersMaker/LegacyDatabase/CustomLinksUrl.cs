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

    // CustomLinksUrls
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class CustomLinksUrl
    {
        public int Id { get; set; } // Id (Primary key)
        public string Key { get; set; } // Key
        public string Label { get; set; } // Label

        // Reverse navigation
        public virtual System.Collections.Generic.ICollection<CustomLinksAndButton> CustomLinksAndButtons { get; set; } // CustomLinksAndButtons.FK_dbo.CustomObjects_dbo.CustomObjectUrls_CustomObjectUrl_Id

        public CustomLinksUrl()
        {
            CustomLinksAndButtons = new System.Collections.Generic.List<CustomLinksAndButton>();
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
