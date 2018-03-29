using CustomLogic.Core.BaseClasses;
using CustomLogic.Core.Interfaces;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.CustomFieldsService
{
    /// <summary>
    /// This is the wrapper for the IService Please add your custom services here insert/update/get/list are already handled should be enough for rest api  
    /// </summary>
    public class CustomFieldService : ServiceBase<CustomFieldsViewModel, CustomField>
    {
        public CustomFieldService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {

        }
    }
}