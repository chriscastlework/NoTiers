using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.CustomObjectRowFieldsService
{
    public class Save : IInsertEvent<CustomObjectRowFieldsViewModel>
    {
        public int CreatedId = 0;

        public bool Run(CustomObjectRowFieldsViewModel model, IUnitOfWork unitOfWork, Response<CustomObjectRowFieldsViewModel> result, ICoreUser user)
        {

            var newCustom = CustomObjectRowFieldsMapper.MapInsertModelToDbModel(model);
            unitOfWork.With<CustomObjectRowField>().Add(newCustom);
            unitOfWork.SaveChanges();
            var newCustomResult = CustomObjectRowFieldsMapper.MapDbModelToViewModel(newCustom);
            result.Data = newCustomResult;
            return true;
        }

        public bool Rollback(CustomObjectRowFieldsViewModel model, IUnitOfWork unitOfWork)
        {
            var removeItem = unitOfWork.With<CustomObjectRowField>().FirstOrDefault(c => c.Id == CreatedId);
            unitOfWork.With<CustomObjectRowField>().Remove(removeItem);
            unitOfWork.SaveChanges();
            return true;
        }
    }
}

