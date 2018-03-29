using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.AlertsService
{
    public class ReturnResultEvent : IUpdateEvent<AlertsViewModel, Alert>
    {
        public int priority()
        {
            return 1000;
        }

        public bool Run(AlertsViewModel model, ref IQueryable< Alert> repository, IUnitOfWork unitOfWork, Response<AlertsViewModel> result, ICoreUser user)
        {
            var updatedDbModel = unitOfWork.With< Alert>().Single(c => c.Id == model.Id); // Might be a partial class
            var newCustomResult = AlertsMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
}
