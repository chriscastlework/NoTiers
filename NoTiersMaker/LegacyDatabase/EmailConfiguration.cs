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

    // EmailConfiguration
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class EmailConfiguration
    {
        public int Id { get; set; } // ID (Primary key)
        public string Description { get; set; } // Description
        public string ApiUserName { get; set; } // ApiUserName
        public string ApiPassword { get; set; } // APIPassword
        public string DomainAddressId { get; set; } // DomainAddressID
        public string EmailConnectorUrl { get; set; } // EmailConnectorURL

        public EmailConfiguration()
        {
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>