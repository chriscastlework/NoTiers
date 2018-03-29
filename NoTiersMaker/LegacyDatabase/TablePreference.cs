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

    // TablePreferences
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class TablePreference
    {
        public int Id { get; set; } // Id (Primary key)
        public string Name { get; set; } // Name
        public int? SystemPreferencesId { get; set; } // SystemPreferences_Id

        // Reverse navigation
        public virtual System.Collections.Generic.ICollection<ColumnPreference> ColumnPreferences { get; set; } // ColumnPreferences.FK_dbo.ColumnPreferences_dbo.TablePreferences_TablePreference_Id

        // Foreign keys
        public virtual SystemPreference SystemPreference { get; set; } // FK_dbo.TablePreferences_dbo.SystemPreferences_SystemPreferences_Id

        public TablePreference()
        {
            ColumnPreferences = new System.Collections.Generic.List<ColumnPreference>();
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
