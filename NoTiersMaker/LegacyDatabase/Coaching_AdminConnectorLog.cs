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

    // Admin_ConnectorLog
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class Coaching_AdminConnectorLog
    {
        public int ConnectorLogId { get; set; } // ConnectorLogID (Primary key)
        public string RequestType { get; set; } // RequestType (length: 50)
        public string Url { get; set; } // URL
        public string RequestXml { get; set; } // RequestXML
        public string ResponseXml { get; set; } // ResponseXML
        public int? OrgId { get; set; } // OrgID
        public int? AppletId { get; set; } // AppletID
        public string TimeStamp { get; set; } // TimeStamp (length: 50)

        public Coaching_AdminConnectorLog()
        {
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>