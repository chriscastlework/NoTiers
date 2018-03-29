using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.AlertsService
{
    public class Delete : IDeleteEvent<AlertsViewModel,Alert >
    {
  
        public bool Run(AlertsViewModel model, ref IQueryable<Alert> repository, IUnitOfWork unitOfWork, Response<AlertsViewModel> result, ICoreUser user)
        {
             // Todo change id for the tables PK
            var customToRemove = unitOfWork.With<Alert>().Find(model.Id);
            unitOfWork.With<Alert>().Remove(customToRemove);
            unitOfWork.SaveChanges();
            return true;
        }
    }
}
