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

    // CustomLinksAndButtons
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class CustomLinksAndButton
    {
        public int Id { get; set; } // Id (Primary key)
        public string Name { get; set; } // Name
        public string Label { get; set; } // Label
        public string Url { get; set; } // Url
        public int IconType { get; set; } // IconType
        public string IconClass { get; set; } // IconClass
        public byte[] IconImage { get; set; } // IconImage
        public bool IsActive { get; set; } // IsActive
        public int? CustomLinksButtonPlacementId { get; set; } // CustomLinksButtonPlacement_Id
        public int? CustomLinksUrlId { get; set; } // CustomLinksUrl_Id
        public int OrganisationId { get; set; } // OrganisationId
        public int Action { get; set; } // Action
        public int ButtonType { get; set; } // ButtonType
        public int EntityType { get; set; } // EntityType
        public string PlacementCustomObjectKey { get; set; } // PlacementCustomObjectKey

        // Reverse navigation
        public virtual System.Collections.Generic.ICollection<SectionCustomLink> SectionCustomLinks { get; set; } // SectionCustomLinks.FK_dbo.SectionCustomLinks_dbo.CustomObjects_CustomLinkId

        // Foreign keys
        public virtual CustomLinksButtonPlacement CustomLinksButtonPlacement { get; set; } // FK_dbo.CustomObjects_dbo.CustomObjectButtonPlacements_CustomObjectButtonPlacement_Id
        public virtual CustomLinksUrl CustomLinksUrl { get; set; } // FK_dbo.CustomObjects_dbo.CustomObjectUrls_CustomObjectUrl_Id
        public virtual Organisation Organisation { get; set; } // FK_dbo.CustomObjects_dbo.Organisations_OrganisationId

        public CustomLinksAndButton()
        {
            EntityType = 0;
            SectionCustomLinks = new System.Collections.Generic.List<SectionCustomLink>();
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>