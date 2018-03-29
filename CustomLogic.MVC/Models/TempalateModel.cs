using System;
using CustomLogic.Templates.Interfaces;

namespace CSharpeToolSet.Models
{
    /// <summary>
    /// Used to make insantcise of the templates
    /// </summary>
    public class TempalateClassModel : ITempalateCustomLogic
    {

        public TempalateClassModel()
        {
            UseTemplate = true;
        }
        /// <summary>
        /// The type of file you are creating js or c# could be others
        /// </summary>
        public string FileType { get; set; }

        /// <summary>
        /// Weather you want this template to be run should default to true
        /// </summary>
        public bool UseTemplate { get; set; }

        public string ClassName { get; set; }
        public int ClassId { get; set; }

        public int GetClassId()
        {
            return ClassId;
        }

        public string GetClassName()
        {
            return ClassName;
        }

        public string TransformText()
        {
            // shouldn't be used 
            throw new NotImplementedException();
        }

        public int SetClassId(int id)
        {
            ClassId = id;
            return id;
        }
    }
}