 using CustomLogic.Core.Interfaces;
 using CustomLogic.Core.Interfaces.DL;
 using CustomLogic.Core.Models;
using CustomLogic.Database;
 using System.Linq;

namespace CustomLogic.Services.AlertsService
{
 public class Update : IUpdateEvent<AlertsViewModel,Alert>
    {

        public int priority()
        {
            return 0;
        }

        public bool Run(AlertsViewModel model, ref IQueryable<Alert> repository, IUnitOfWork unitOfWork, Response<AlertsViewModel> result, ICoreUser user)
        {
            var dbModel =  repository.Single(c=>c.Id == model.Id); // you need to be using the primary key could be composit
            var updatedDbModel = AlertsMapper.MapInsertModelToDbModel(model, dbModel);
            unitOfWork.With<Alert>().AddOrUpdate(updatedDbModel);
            unitOfWork.SaveChanges();
            var newCustomResult = AlertsMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
}
