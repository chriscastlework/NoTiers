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

    // Localizations
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class LocalizationMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Localization>
    {
        public LocalizationMapping()
            : this("dbo")
        {
        }

        public LocalizationMapping(string schema)
        {
            ToTable("Localizations", schema);
            HasKey(x => x.Pk);

            Property(x => x.Pk).HasColumnName(@"pk").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.ResourceId).HasColumnName(@"ResourceId").HasColumnType("nvarchar").IsRequired().HasMaxLength(1024);
            Property(x => x.Value).HasColumnName(@"Value").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.LocaleId).HasColumnName(@"LocaleId").HasColumnType("nvarchar").IsOptional().HasMaxLength(30);
            Property(x => x.ResourceSet).HasColumnName(@"ResourceSet").HasColumnType("nvarchar").IsOptional().HasMaxLength(512);
            Property(x => x.Type).HasColumnName(@"Type").HasColumnType("nvarchar").IsOptional().HasMaxLength(512);
            Property(x => x.BinFile).HasColumnName(@"BinFile").HasColumnType("varbinary").IsOptional();
            Property(x => x.TextFile).HasColumnName(@"TextFile").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.Filename).HasColumnName(@"Filename").HasColumnType("nvarchar").IsOptional().HasMaxLength(128);
            Property(x => x.Comment).HasColumnName(@"Comment").HasColumnType("nvarchar").IsOptional().HasMaxLength(512);
            Property(x => x.ValueType).HasColumnName(@"ValueType").HasColumnType("int").IsRequired();
            Property(x => x.Updated).HasColumnName(@"Updated").HasColumnType("datetime2").IsOptional();
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>
