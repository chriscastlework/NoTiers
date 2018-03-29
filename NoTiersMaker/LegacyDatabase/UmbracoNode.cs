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

    // umbracoNode
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class UmbracoNode
    {
        public int Id { get; set; } // id (Primary key)
        public bool Trashed { get; set; } // trashed
        public int ParentId { get; set; } // parentID
        public int? NodeUser { get; set; } // nodeUser
        public int Level { get; set; } // level
        public string Path { get; set; } // path (length: 150)
        public int SortOrder { get; set; } // sortOrder
        public System.Guid UniqueId { get; set; } // uniqueID
        public string Text { get; set; } // text (length: 255)
        public System.Guid? NodeObjectType { get; set; } // nodeObjectType
        public System.DateTime CreateDate { get; set; } // createDate

        // Reverse navigation
        public virtual CmsMember CmsMember { get; set; } // cmsMember.FK_cmsMember_umbracoNode_id
        public virtual System.Collections.Generic.ICollection<CmsContent> CmsContents { get; set; } // cmsContent.FK_cmsContent_umbracoNode_id
        public virtual System.Collections.Generic.ICollection<CmsContentType> CmsContentTypes { get; set; } // cmsContentType.FK_cmsContentType_umbracoNode_id
        public virtual System.Collections.Generic.ICollection<CmsDataType> CmsDataTypes { get; set; } // cmsDataType.FK_cmsDataType_umbracoNode_id
        public virtual System.Collections.Generic.ICollection<CmsDocument> CmsDocuments { get; set; } // cmsDocument.FK_cmsDocument_umbracoNode_id
        public virtual System.Collections.Generic.ICollection<CmsDocumentType> CmsDocumentTypes { get; set; } // Many to many mapping
        public virtual System.Collections.Generic.ICollection<CmsMember> CmsMembers { get; set; } // Many to many mapping
        public virtual System.Collections.Generic.ICollection<CmsMemberType> CmsMemberTypes { get; set; } // cmsMemberType.FK_cmsMemberType_umbracoNode_id
        public virtual System.Collections.Generic.ICollection<CmsPropertyData> CmsPropertyDatas { get; set; } // cmsPropertyData.FK_cmsPropertyData_umbracoNode_id
        public virtual System.Collections.Generic.ICollection<CmsTask> CmsTasks { get; set; } // cmsTask.FK_cmsTask_umbracoNode_id
        public virtual System.Collections.Generic.ICollection<CmsTemplate> CmsTemplates { get; set; } // cmsTemplate.FK_cmsTemplate_umbracoNode
        public virtual System.Collections.Generic.ICollection<UmbracoAccess> LoginNode { get; set; } // umbracoAccess.FK_umbracoAccess_umbracoNode_id1
        public virtual System.Collections.Generic.ICollection<UmbracoAccess> NoAccessNode { get; set; } // umbracoAccess.FK_umbracoAccess_umbracoNode_id2
        public virtual System.Collections.Generic.ICollection<UmbracoAccess> Node { get; set; } // umbracoAccess.FK_umbracoAccess_umbracoNode_id
        public virtual System.Collections.Generic.ICollection<UmbracoDomain> UmbracoDomains { get; set; } // umbracoDomains.FK_umbracoDomains_umbracoNode_id
        public virtual System.Collections.Generic.ICollection<UmbracoNode> ChildContentType { get; set; } // Many to many mapping
        public virtual System.Collections.Generic.ICollection<UmbracoNode> ParentContentTypeId { get; set; } // Many to many mapping
        public virtual System.Collections.Generic.ICollection<UmbracoNode> UmbracoNodes_ParentId { get; set; } // umbracoNode.FK_umbracoNode_umbracoNode_id
        public virtual System.Collections.Generic.ICollection<UmbracoRelation> Child { get; set; } // umbracoRelation.FK_umbracoRelation_umbracoNode1
        public virtual System.Collections.Generic.ICollection<UmbracoRelation> UmbracoRelations_ParentId { get; set; } // umbracoRelation.FK_umbracoRelation_umbracoNode
        public virtual System.Collections.Generic.ICollection<UmbracoUser2NodeNotify> UmbracoUser2NodeNotify { get; set; } // Many to many mapping
        public virtual System.Collections.Generic.ICollection<UmbracoUser2NodePermission> UmbracoUser2NodePermission { get; set; } // Many to many mapping

        // Foreign keys
        public virtual UmbracoNode UmbracoNode_ParentId { get; set; } // FK_umbracoNode_umbracoNode_id

        public UmbracoNode()
        {
            Trashed = true;
            UniqueId = System.Guid.NewGuid();
            CreateDate = System.DateTime.Now;
            CmsContents = new System.Collections.Generic.List<CmsContent>();
            CmsContentTypes = new System.Collections.Generic.List<CmsContentType>();
            CmsDataTypes = new System.Collections.Generic.List<CmsDataType>();
            CmsDocuments = new System.Collections.Generic.List<CmsDocument>();
            CmsDocumentTypes = new System.Collections.Generic.List<CmsDocumentType>();
            CmsMemberTypes = new System.Collections.Generic.List<CmsMemberType>();
            CmsPropertyDatas = new System.Collections.Generic.List<CmsPropertyData>();
            CmsTasks = new System.Collections.Generic.List<CmsTask>();
            CmsTemplates = new System.Collections.Generic.List<CmsTemplate>();
            LoginNode = new System.Collections.Generic.List<UmbracoAccess>();
            NoAccessNode = new System.Collections.Generic.List<UmbracoAccess>();
            Node = new System.Collections.Generic.List<UmbracoAccess>();
            UmbracoDomains = new System.Collections.Generic.List<UmbracoDomain>();
            UmbracoNodes_ParentId = new System.Collections.Generic.List<UmbracoNode>();
            Child = new System.Collections.Generic.List<UmbracoRelation>();
            UmbracoRelations_ParentId = new System.Collections.Generic.List<UmbracoRelation>();
            UmbracoUser2NodeNotify = new System.Collections.Generic.List<UmbracoUser2NodeNotify>();
            UmbracoUser2NodePermission = new System.Collections.Generic.List<UmbracoUser2NodePermission>();
            ChildContentType = new System.Collections.Generic.List<UmbracoNode>();
            ParentContentTypeId = new System.Collections.Generic.List<UmbracoNode>();
            CmsMembers = new System.Collections.Generic.List<CmsMember>();
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
