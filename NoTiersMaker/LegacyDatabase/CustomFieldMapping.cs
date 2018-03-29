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

    // CustomFields
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class CustomFieldMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<CustomField>
    {
        public CustomFieldMapping()
            : this("dbo")
        {
        }

        public CustomFieldMapping(string schema)
        {
            ToTable("CustomFields", schema);
            HasKey(x => x.Id);

            Property(x => x.Id).HasColumnName(@"Id").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.Name).HasColumnName(@"Name").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.FieldType).HasColumnName(@"FieldType").HasColumnType("int").IsRequired();
            Property(x => x.ValdiationRegex).HasColumnName(@"ValdiationRegex").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.OrganisationId).HasColumnName(@"OrganisationId").HasColumnType("int").IsRequired();
            Property(x => x.EntityType).HasColumnName(@"EntityType").HasColumnType("int").IsRequired();
            Property(x => x.IconClass).HasColumnName(@"IconClass").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.Color).HasColumnName(@"Color").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.CustomObjectRowId).HasColumnName(@"CustomObjectRow_Id").HasColumnType("bigint").IsOptional();
            Property(x => x.CustomObjectId).HasColumnName(@"CustomObject_Id").HasColumnType("bigint").IsOptional();
            Property(x => x.IsNotVisible).HasColumnName(@"IsNotVisible").HasColumnType("bit").IsRequired();
            Property(x => x.CustomFieldGroupId).HasColumnName(@"CustomFieldGroupId").HasColumnType("int").IsOptional();
            Property(x => x.DisplayOrder).HasColumnName(@"DisplayOrder").HasColumnType("int").IsRequired();
            Property(x => x.CustomFieldValidationId).HasColumnName(@"CustomFieldValidation_Id").HasColumnType("int").IsOptional();
            Property(x => x.Required).HasColumnName(@"Required").HasColumnType("bit").IsRequired();
            Property(x => x.Min).HasColumnName(@"Min").HasColumnType("int").IsOptional();
            Property(x => x.Max).HasColumnName(@"Max").HasColumnType("int").IsOptional();
            Property(x => x.MinDate).HasColumnName(@"MinDate").HasColumnType("datetime2").IsOptional();
            Property(x => x.MaxDate).HasColumnName(@"MaxDate").HasColumnType("datetime2").IsOptional();

            // Foreign keys
            HasOptional(a => a.CustomFieldGroup).WithMany(b => b.CustomFields).HasForeignKey(c => c.CustomFieldGroupId).WillCascadeOnDelete(false); // FK_dbo.CustomFields_dbo.CustomFieldGroups_CustomFieldGroupId
            HasOptional(a => a.CustomFieldValidation).WithMany(b => b.CustomFields).HasForeignKey(c => c.CustomFieldValidationId).WillCascadeOnDelete(false); // FK_dbo.CustomFields_dbo.CustomFieldValidations_CustomFieldValidation_Id
            HasOptional(a => a.CustomObject).WithMany(b => b.CustomFields).HasForeignKey(c => c.CustomObjectId).WillCascadeOnDelete(false); // FK_dbo.CustomFields_dbo.CustomTables_CustomTable_Id
            HasOptional(a => a.CustomObjectRow).WithMany(b => b.CustomFields).HasForeignKey(c => c.CustomObjectRowId).WillCascadeOnDelete(false); // FK_dbo.CustomFields_dbo.CustomTableRows_CustomTableRow_Id
            HasRequired(a => a.Organisation).WithMany(b => b.CustomFields).HasForeignKey(c => c.OrganisationId); // FK_dbo.CustomFields_dbo.Organisations_OrganisationId
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>