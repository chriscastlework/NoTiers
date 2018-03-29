using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.ContactsService
{
    public class View : IViewEvent<ContactsViewModel, Contact>
    {
        public int CreatedId = 0;
        
        public Response<ContactsViewModel> Run(ContactsViewModel model, ref IQueryable<Contact> repository, IUnitOfWork db, Response<ContactsViewModel> result, ICoreUser user)
        {
            var itemToUpdate = repository.SingleOrDefault(c => c.Id == model.Id);

            if (itemToUpdate != null)
            {
                var newCustomResult = ContactsMapper.MapDbModelToViewModel(itemToUpdate);
                result.Data = newCustomResult;
                result.Success = true;
            }
            else
            {
                result.Success = false;
                result.LogError("Error viewing Contacts");
            }

            return result;
        }
    }
}