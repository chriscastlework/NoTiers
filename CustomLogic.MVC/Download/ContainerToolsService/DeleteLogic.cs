using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.ContainerToolsService
{
    public class Delete : IDeleteEvent<ContainerToolsViewModel,ContainerTool >
    {
  
        public bool Run(ContainerToolsViewModel model, ref IQueryable<ContainerTool> repository, IUnitOfWork unitOfWork, Response<ContainerToolsViewModel> result, ICoreUser user)
        {
             // Todo change id for the tables PK
            var customToRemove = unitOfWork.With<ContainerTool>().Find(model.Id);
            unitOfWork.With<ContainerTool>().Remove(customToRemove);
            unitOfWork.SaveChanges();
            return true;
        }
    }
}
