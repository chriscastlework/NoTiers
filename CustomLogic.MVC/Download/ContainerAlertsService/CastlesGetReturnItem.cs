using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.ContainerAlertsService
{
    public class ReturnResultEvent : IUpdateEvent<ContainerAlertsViewModel, ContainerAlert>
    {
        public int priority()
        {
            return 1000;
        }

        public bool Run(ContainerAlertsViewModel model, ref IQueryable< ContainerAlert> repository, IUnitOfWork unitOfWork, Response<ContainerAlertsViewModel> result, ICoreUser user)
        {
            var updatedDbModel = unitOfWork.With< ContainerAlert>().Single(c => c.Id == model.Id); // Might be a partial class
            var newCustomResult = ContainerAlertsMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
}
