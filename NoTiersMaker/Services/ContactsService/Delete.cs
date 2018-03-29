using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.ContactsService
{
    public class Delete : IDeleteEvent<ContactsViewModel, Contact>
    {
        public bool Run(ContactsViewModel model, IUnitOfWork unitOfWork, Response<ContactsViewModel> result, ICoreUser user)
        {
            var customToRemove = unitOfWork.With<Contact>().Find(model.Id);
            unitOfWork.With<Contact>().Remove(customToRemove);
            unitOfWork.SaveChanges();
            return true;
        }

        public bool Run(ContactsViewModel model, ref IQueryable<Contact> repository, IUnitOfWork unitOfWork, Response<ContactsViewModel> result, ICoreUser user)
        {
            throw new System.NotImplementedException();
        }
    }
}
