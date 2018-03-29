using System.Data.Entity.Migrations;
using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.CustomFieldsService
{
    public class Update : IUpdateEvent<CustomFieldsViewModel, CustomField>
    {
       
        public int priority()
        {
            return 0;
        }

        public bool Run(CustomFieldsViewModel model, ref IQueryable<CustomField> repository, IUnitOfWork unitOfWork, Response<CustomFieldsViewModel> result, ICoreUser user)
        {
            var dbModel = repository.SingleOrDefault(c=>c.Id == model.Id);
            var updatedDbModel = CustomFieldsMapper.MapInsertModelToDbModel(model, dbModel);
            unitOfWork.With<CustomField>().AddOrUpdate(updatedDbModel);
            unitOfWork.SaveChanges();
            var newCustomResult = CustomFieldsMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
}