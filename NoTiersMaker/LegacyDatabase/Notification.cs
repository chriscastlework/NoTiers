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

    // Notifications
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class Notification
    {
        public long Id { get; set; } // Id (Primary key)
        public string TableName { get; set; } // TableName
        public string UserId { get; set; } // UserId (length: 128)
        public string Actions { get; set; } // Actions
        public long TableIdValue { get; set; } // TableIdValue
        public System.DateTime? UpdateDate { get; set; } // UpdateDate

        // Reverse navigation
        public virtual System.Collections.Generic.ICollection<NotificationField> NotificationFields { get; set; } // NotificationFields.FK_dbo.NotificationFields_dbo.Notifications_Notification_Id

        public Notification()
        {
            NotificationFields = new System.Collections.Generic.List<NotificationField>();
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
