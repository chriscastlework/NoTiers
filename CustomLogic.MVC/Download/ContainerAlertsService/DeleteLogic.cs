using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.ContainerAlertsService
{
    public class Delete : IDeleteEvent<ContainerAlertsViewModel,ContainerAlert >
    {
  
        public bool Run(ContainerAlertsViewModel model, ref IQueryable<ContainerAlert> repository, IUnitOfWork unitOfWork, Response<ContainerAlertsViewModel> result, ICoreUser user)
        {
             // Todo change id for the tables PK
            var customToRemove = unitOfWork.With<ContainerAlert>().Find(model.Id);
            unitOfWork.With<ContainerAlert>().Remove(customToRemove);
            unitOfWork.SaveChanges();
            return true;
        }
    }
}
