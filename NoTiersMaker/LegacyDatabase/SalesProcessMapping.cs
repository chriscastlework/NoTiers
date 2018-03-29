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

    // SalesProcesses
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class SalesProcessMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<SalesProcess>
    {
        public SalesProcessMapping()
            : this("dbo")
        {
        }

        public SalesProcessMapping(string schema)
        {
            ToTable("SalesProcesses", schema);
            HasKey(x => x.Id);

            Property(x => x.Id).HasColumnName(@"Id").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.Name).HasColumnName(@"Name").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.Description).HasColumnName(@"Description").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.OrganisationId).HasColumnName(@"OrganisationId").HasColumnType("int").IsOptional();
            Property(x => x.SalesProcessStatus).HasColumnName(@"SalesProcessStatus").HasColumnType("int").IsRequired();
            Property(x => x.StepLevelProbability).HasColumnName(@"StepLevelProbability").HasColumnType("bit").IsRequired();
            Property(x => x.CustomTableId).HasColumnName(@"CustomTableId").HasColumnType("int").IsOptional();
            Property(x => x.EntityType).HasColumnName(@"EntityType").HasColumnType("int").IsRequired();
            Property(x => x.RecordTypeId).HasColumnName(@"RecordTypeId").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.AutomaticMandatoryStepProgression).HasColumnName(@"AutomaticMandatoryStepProgression").HasColumnType("bit").IsRequired();
            Property(x => x.HideProbability).HasColumnName(@"HideProbability").HasColumnType("bit").IsOptional();
            Property(x => x.HideVerifiableOutcomes).HasColumnName(@"HideVerifiableOutcomes").HasColumnType("bit").IsOptional();

            // Foreign keys
            HasOptional(a => a.Organisation).WithMany(b => b.SalesProcesses).HasForeignKey(c => c.OrganisationId).WillCascadeOnDelete(false); // FK_dbo.SalesProcesses_dbo.Organisations_OrganisationId
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>