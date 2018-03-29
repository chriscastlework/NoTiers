using CustomLogic.Core.BaseClasses;
using CustomLogic.Core.Interfaces;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.ContactsService
{
    /// <summary>
    /// This is the wrapper for the IService Please add your custom services here insert/update/get/list are already handled should be enough for rest api  
    /// </summary>
    public class ContactService : ServiceBase<ContactsViewModel, Contact>
    {
        public ContactService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {

        }
    }
}