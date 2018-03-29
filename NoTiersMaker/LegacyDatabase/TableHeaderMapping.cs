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

    // TableHeaders
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class TableHeaderMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<TableHeader>
    {
        public TableHeaderMapping()
            : this("dbo")
        {
        }

        public TableHeaderMapping(string schema)
        {
            ToTable("TableHeaders", schema);
            HasKey(x => x.Id);

            Property(x => x.Id).HasColumnName(@"Id").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.Name).HasColumnName(@"Name").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.Display).HasColumnName(@"Display").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.Visible).HasColumnName(@"Visible").HasColumnType("bit").IsRequired();
            Property(x => x.StandardObjectDefinitionId).HasColumnName(@"StandardObjectDefinition_Id").HasColumnType("bigint").IsOptional();
            Property(x => x.FieldType).HasColumnName(@"FieldType").HasColumnType("int").IsRequired();
            Property(x => x.TestMigration).HasColumnName(@"TestMigration").HasColumnType("nvarchar(max)").IsOptional();

            // Foreign keys
            HasOptional(a => a.StandardObjectDefinition).WithMany(b => b.TableHeaders).HasForeignKey(c => c.StandardObjectDefinitionId).WillCascadeOnDelete(false); // FK_dbo.TableHeaders_dbo.StandardObjectDefinitions_StandardObjectDefinition_Id
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>