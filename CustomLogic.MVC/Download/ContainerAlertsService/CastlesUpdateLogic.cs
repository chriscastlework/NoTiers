 using CustomLogic.Core.Interfaces;
 using CustomLogic.Core.Interfaces.DL;
 using CustomLogic.Core.Models;
using CustomLogic.Database;
 using System.Linq;

namespace CustomLogic.Services.ContainerAlertsService
{
 public class Update : IUpdateEvent<ContainerAlertsViewModel,ContainerAlert>
    {

        public int priority()
        {
            return 0;
        }

        public bool Run(ContainerAlertsViewModel model, ref IQueryable<ContainerAlert> repository, IUnitOfWork unitOfWork, Response<ContainerAlertsViewModel> result, ICoreUser user)
        {
            var dbModel =  repository.Single(c=>c.Id == model.Id); // you need to be using the primary key could be composit
            var updatedDbModel = ContainerAlertsMapper.MapInsertModelToDbModel(model, dbModel);
            unitOfWork.With<ContainerAlert>().AddOrUpdate(updatedDbModel);
            unitOfWork.SaveChanges();
            var newCustomResult = ContainerAlertsMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
}
