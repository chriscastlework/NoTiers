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

    // tempNotifications
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class TempNotification
    {
        public long Id { get; set; } // Id (Primary key)
        public string TableName { get; set; } // TableName
        public string UserId { get; set; } // UserId (length: 128)
        public string Actions { get; set; } // Actions
        public long TableIdValue { get; set; } // TableIdValue (Primary key)
        public System.DateTime? UpdateDate { get; set; } // UpdateDate

        public TempNotification()
        {
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
