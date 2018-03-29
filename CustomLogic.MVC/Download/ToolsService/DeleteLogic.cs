using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.ToolsService
{
    public class Delete : IDeleteEvent<ToolsViewModel,Tool >
    {
  
        public bool Run(ToolsViewModel model, ref IQueryable<Tool> repository, IUnitOfWork unitOfWork, Response<ToolsViewModel> result, ICoreUser user)
        {
             // Todo change id for the tables PK
            var customToRemove = unitOfWork.With<Tool>().Find(model.Id);
            unitOfWork.With<Tool>().Remove(customToRemove);
            unitOfWork.SaveChanges();
            return true;
        }
    }
}
