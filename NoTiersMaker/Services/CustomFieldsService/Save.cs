using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.CustomFieldsService
{
    public class Save : IInsertEvent<CustomFieldsViewModel>
    {
        public int CreatedId = 0;

        public bool Run(CustomFieldsViewModel model, IUnitOfWork unitOfWork, Response<CustomFieldsViewModel> result, ICoreUser user)
        {

            var newCustom = CustomFieldsMapper.MapInsertModelToDbModel(model);
            unitOfWork.With<CustomField>().Add(newCustom);
            unitOfWork.SaveChanges();
            CreatedId = newCustom.Id;
            var newCustomResult = CustomFieldsMapper.MapDbModelToViewModel(newCustom);
            result.Data = newCustomResult;
            return true;
        }

        public bool Rollback(CustomFieldsViewModel model, IUnitOfWork unitOfWork)
        {
            var removeItem = unitOfWork.With<CustomField>().FirstOrDefault(c => c.Id == CreatedId);
            unitOfWork.With<CustomField>().Remove(removeItem);
            unitOfWork.SaveChanges();
            return true;
        }
    }
}
