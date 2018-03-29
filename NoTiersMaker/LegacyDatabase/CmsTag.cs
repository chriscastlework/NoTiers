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

    // cmsTags
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class CmsTag
    {
        public int Id { get; set; } // id (Primary key)
        public string Tag { get; set; } // tag (length: 200)
        public int? ParentId { get; set; } // ParentId
        public string Group { get; set; } // group (length: 100)

        // Reverse navigation
        public virtual System.Collections.Generic.ICollection<CmsTag> CmsTags { get; set; } // cmsTags.FK_cmsTags_cmsTags
        public virtual System.Collections.Generic.ICollection<CmsTagRelationship> CmsTagRelationships { get; set; } // Many to many mapping

        // Foreign keys
        public virtual CmsTag Parent { get; set; } // FK_cmsTags_cmsTags

        public CmsTag()
        {
            CmsTagRelationships = new System.Collections.Generic.List<CmsTagRelationship>();
            CmsTags = new System.Collections.Generic.List<CmsTag>();
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>