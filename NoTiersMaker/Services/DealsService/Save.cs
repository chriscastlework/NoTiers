using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.DealsService
{
    public class Save : IInsertEvent<DealsViewModel>
    {
        public int CreatedId = 0;

        public bool Run(DealsViewModel model, IUnitOfWork unitOfWork, Response<DealsViewModel> result, ICoreUser user)
        {

            var newCustom = DealsMapper.MapInsertModelToDbModel(model);
            unitOfWork.With<Deal>().Add(newCustom);
            unitOfWork.SaveChanges();
            CreatedId = newCustom.Id;
            var newCustomResult = DealsMapper.MapDbModelToViewModel(newCustom);
            result.Data = newCustomResult;
            return true;
        }

        public bool Rollback(DealsViewModel model, IUnitOfWork unitOfWork)
        {
            var removeItem = unitOfWork.With<Deal>().FirstOrDefault(c => c.Id == CreatedId);
            unitOfWork.With<Deal>().Remove(removeItem);
            unitOfWork.SaveChanges();
            return true;
        }
    }
}