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

    // StcThemes
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class StcTheme
    {
        public int Id { get; set; } // Id (Primary key)
        public string NavBarBackgroundColour { get; set; } // NavBarBackgroundColour
        public System.DateTime? Created { get; set; } // Created
        public string CreatedUserId { get; set; } // CreatedUserId
        public System.DateTime? LastUpdated { get; set; } // LastUpdated
        public string LastUpdatedUserId { get; set; } // LastUpdatedUserId
        public string Name { get; set; } // Name
        public byte[] LogoImage { get; set; } // LogoImage
        public string CarotColour { get; set; } // CarotColour
        public string HighlightedColour { get; set; } // HighlightedColour
        public string TitleTextColour { get; set; } // TitleTextColour
        public string ExternalReference { get; set; } // ExternalReference
        public bool DefaultTheme { get; set; } // DefaultTheme
        public bool IsOrganisationTheme { get; set; } // IsOrganisationTheme
        public byte[] SmallLogoImageByteArray144144 { get; set; } // SmallLogoImageByteArray144144
        public byte[] SmallLogoImageByteArray114114 { get; set; } // SmallLogoImageByteArray114114
        public byte[] SmallLogoImageByteArray7272 { get; set; } // SmallLogoImageByteArray7272
        public byte[] SmallLogoImageByteArray5757 { get; set; } // SmallLogoImageByteArray5757
        public string BoxHeaderBackgroundColour { get; set; } // BoxHeaderBackgroundColour
        public string BoxHeaderTextColour { get; set; } // BoxHeaderTextColour
        public string SelectedNavStateTextColour { get; set; } // SelectedNavStateTextColour
        public string DropDownListBackgoundHover { get; set; } // DropDownListBackgoundHover
        public string DropDownListTextHoverColour { get; set; } // DropDownListTextHoverColour
        public byte[] MobileLogoImageByteArray { get; set; } // MobileLogoImageByteArray

        // Reverse navigation
        public virtual System.Collections.Generic.ICollection<Organisation> Organisations { get; set; } // Organisations.FK_dbo.Organisations_dbo.StcThemes_OrganisationTheme_Id
        public virtual System.Collections.Generic.ICollection<SalesTrainingCompany> SalesTrainingCompanies { get; set; } // SalesTrainingCompanies.FK_dbo.SalesTrainingCompanies_dbo.StcThemes_StcTheme_Id

        public StcTheme()
        {
            DefaultTheme = false;
            IsOrganisationTheme = false;
            Organisations = new System.Collections.Generic.List<Organisation>();
            SalesTrainingCompanies = new System.Collections.Generic.List<SalesTrainingCompany>();
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>