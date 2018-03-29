using CustomLogic;
using CustomLogic.Core.BaseClasses;
using CustomLogic.Core.Interfaces;
using CustomLogic.Database;

namespace CustomLogic.Services.FieldTypesService
{
    /// <summary>
    /// This is the wrapper for the IService Please add your custom services here insert/update/get/list are already handled should be enough for rest api  
    /// </summary>
    public class FieldTypeService : ServiceBase<FieldTypesViewModel, FieldType>
    {
        public FieldTypeService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {

        }
    }
}
