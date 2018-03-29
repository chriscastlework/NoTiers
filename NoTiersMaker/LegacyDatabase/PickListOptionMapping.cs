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

    // PickListOptions
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class PickListOptionMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<PickListOption>
    {
        public PickListOptionMapping()
            : this("dbo")
        {
        }

        public PickListOptionMapping(string schema)
        {
            ToTable("PickListOptions", schema);
            HasKey(x => x.Id);

            Property(x => x.Id).HasColumnName(@"Id").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.PickListId).HasColumnName(@"PickListId").HasColumnType("int").IsRequired();
            Property(x => x.OptionName).HasColumnName(@"OptionName").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.OptionValue).HasColumnName(@"OptionValue").HasColumnType("nvarchar(max)").IsOptional();

            // Foreign keys
            HasRequired(a => a.PickList).WithMany(b => b.PickListOptions).HasForeignKey(c => c.PickListId); // FK_dbo.PickListOptions_dbo.PickLists_PickListId
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>