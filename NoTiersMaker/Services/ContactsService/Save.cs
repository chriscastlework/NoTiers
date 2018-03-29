using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.ContactsService
{
    public class Save : IInsertEvent<ContactsViewModel>
    {
        public int CreatedId = 0;

        public bool Run(ContactsViewModel model, IUnitOfWork unitOfWork, Response<ContactsViewModel> result, ICoreUser user)
        {

            var newCustom = ContactsMapper.MapInsertModelToDbModel(model);
            unitOfWork.With<Contact>().Add(newCustom);
            unitOfWork.SaveChanges();
            CreatedId = newCustom.Id;
            var newCustomResult = ContactsMapper.MapDbModelToViewModel(newCustom);
            result.Data = newCustomResult;
            return true;
        }

        public bool Rollback(ContactsViewModel model, IUnitOfWork unitOfWork)
        {
            var removeItem = unitOfWork.With<Contact>().FirstOrDefault(c => c.Id == CreatedId);
            unitOfWork.With<Contact>().Remove(removeItem);
            unitOfWork.SaveChanges();
            return true;
        }
    }
}