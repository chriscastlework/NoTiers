using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.BL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.ContactsService
{
    public class LimitContacts : IViewListRule<ContactsViewModel, Deal>
    {
        public bool Run(NgTableParams model, ref IQueryable<Deal> repository, NgTable<ContactsViewModel> result, ICoreUser user, IUnitOfWork unitOfWork)
        {
           // throw new NotImplementedException();
            return true;
        }
    }


}