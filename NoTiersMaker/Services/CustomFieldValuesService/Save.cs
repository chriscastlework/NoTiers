using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.CustomFieldValuesService
{
    public class Save : IInsertEvent<CustomFieldValuesViewModel>
    {
        public int CustomFieldId = 0;
        public int EntityId = 0;

        public bool Run(CustomFieldValuesViewModel model, IUnitOfWork unitOfWork, Response<CustomFieldValuesViewModel> result, ICoreUser user)
        {

            var newCustom = CustomFieldValuesMapper.MapInsertModelToDbModel(model);
            unitOfWork.With<CustomFieldValue>().Add(newCustom);
            unitOfWork.SaveChanges();
            CustomFieldId = newCustom.CustomFieldId;
            EntityId = newCustom.EntityId;
            var newCustomResult = CustomFieldValuesMapper.MapDbModelToViewModel(newCustom);
            result.Data = newCustomResult;
            return true;
        }

        public bool Rollback(CustomFieldValuesViewModel model, IUnitOfWork unitOfWork)
        {
            var removeItem = unitOfWork.With<CustomFieldValue>().FirstOrDefault(c => c.CustomFieldId == CustomFieldId
            && c.EntityId == EntityId);
            unitOfWork.With<CustomFieldValue>().Remove(removeItem);
            unitOfWork.SaveChanges();
            return true;
        }
    }
}