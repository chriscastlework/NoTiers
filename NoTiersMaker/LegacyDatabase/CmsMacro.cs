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

    // cmsMacro
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class CmsMacro
    {
        public int Id { get; set; } // id (Primary key)
        public System.Guid UniqueId { get; set; } // uniqueId
        public bool MacroUseInEditor { get; set; } // macroUseInEditor
        public int MacroRefreshRate { get; set; } // macroRefreshRate
        public string MacroAlias { get; set; } // macroAlias (length: 255)
        public string MacroName { get; set; } // macroName (length: 255)
        public string MacroScriptType { get; set; } // macroScriptType (length: 255)
        public string MacroScriptAssembly { get; set; } // macroScriptAssembly (length: 255)
        public string MacroXslt { get; set; } // macroXSLT (length: 255)
        public bool MacroCacheByPage { get; set; } // macroCacheByPage
        public bool MacroCachePersonalized { get; set; } // macroCachePersonalized
        public bool MacroDontRender { get; set; } // macroDontRender
        public string MacroPython { get; set; } // macroPython (length: 255)

        // Reverse navigation
        public virtual System.Collections.Generic.ICollection<CmsMacroProperty> CmsMacroProperties { get; set; } // cmsMacroProperty.FK_cmsMacroProperty_cmsMacro_id

        public CmsMacro()
        {
            MacroUseInEditor = true;
            MacroRefreshRate = 0;
            MacroCacheByPage = true;
            MacroCachePersonalized = true;
            MacroDontRender = true;
            CmsMacroProperties = new System.Collections.Generic.List<CmsMacroProperty>();
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
