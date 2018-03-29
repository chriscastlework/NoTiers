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
    public partial class Localization
    {
        public int Pk { get; set; } // pk (Primary key)
        public string ResourceId { get; set; } // ResourceId (length: 1024)
        public string Value { get; set; } // Value
        public string LocaleId { get; set; } // LocaleId (length: 30)
        public string ResourceSet { get; set; } // ResourceSet (length: 512)
        public string Type { get; set; } // Type (length: 512)
        public byte[] BinFile { get; set; } // BinFile
        public string TextFile { get; set; } // TextFile
        public string Filename { get; set; } // Filename (length: 128)
        public string Comment { get; set; } // Comment (length: 512)
        public int ValueType { get; set; } // ValueType
        public System.DateTime? Updated { get; set; } // Updated

        public Localization()
        {
            Value = "";
            LocaleId = "";
            ResourceSet = "";
            Type = "";
            Filename = "";
            ValueType = 0;
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>