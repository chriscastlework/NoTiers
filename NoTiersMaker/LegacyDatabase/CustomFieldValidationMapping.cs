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

    // CustomFieldValidations
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class CustomFieldValidationMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<CustomFieldValidation>
    {
        public CustomFieldValidationMapping()
            : this("dbo")
        {
        }

        public CustomFieldValidationMapping(string schema)
        {
            ToTable("CustomFieldValidations", schema);
            HasKey(x => x.Id);

            Property(x => x.Id).HasColumnName(@"Id").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.Name).HasColumnName(@"Name").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.Regex).HasColumnName(@"Regex").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.FieldType).HasColumnName(@"FieldType").HasColumnType("int").IsRequired();
            Property(x => x.ErrorMessage).HasColumnName(@"ErrorMessage").HasColumnType("nvarchar(max)").IsOptional();
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>
