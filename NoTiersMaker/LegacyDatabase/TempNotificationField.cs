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

    // tempNotificationFields
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class TempNotificationField
    {
        public int Id { get; set; } // Id (Primary key)
        public string FieldName { get; set; } // FieldName
        public string OldValue { get; set; } // OldValue
        public string NewValue { get; set; } // NewValue
        public long? NotificationId { get; set; } // Notification_Id

        public TempNotificationField()
        {
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
