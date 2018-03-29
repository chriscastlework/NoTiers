using System.Data.Entity.Migrations;
using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.ContactsService
{
    public class Update : IUpdateEvent<ContactsViewModel, Contact>
    {
      

        public int priority()
        {
            return 0;
        }

        public bool Run(ContactsViewModel model, ref IQueryable<Contact> repository, IUnitOfWork unitOfWork, Response<ContactsViewModel> result, ICoreUser user)
        {
            var dbModel = repository.SingleOrDefault(c=>c.Id == model.Id);
            var updatedDbModel = ContactsMapper.MapInsertModelToDbModel(model, dbModel);
            unitOfWork.With<Contact>().AddOrUpdate(updatedDbModel);
            unitOfWork.SaveChanges();
            var newCustomResult = ContactsMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
}