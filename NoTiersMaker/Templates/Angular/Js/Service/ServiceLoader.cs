using System.Reflection;
using CustomLogic.SchemaBuilder.MicrosoftSQL.SchemaModels;
using CustomLogic.Templates.Interfaces;

namespace CustomLogic.Templates.Angular.Js.Service
{
    public partial class Service : ITemplateAngularJs
    {

        public Service()
        {

        }

        private readonly ModelInfo _model;

        public Service(ModelInfo model)
        {
            _model = model;
        }

        private int ClassId { get; set; }
        public string GetClassName()
        {
            return MethodBase.GetCurrentMethod().DeclaringType.Name;
        }

        public int GetClassId()
        {
            return ClassId;
        }

        public int SetClassId(int id)
        {
            ClassId = id;
            return id;
        }

    }
}
