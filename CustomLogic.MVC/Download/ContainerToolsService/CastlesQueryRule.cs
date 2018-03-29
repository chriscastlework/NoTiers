using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.BL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.ContainerToolsService
{
    public class LimitContainerTools : IViewListRule<ContainerToolsViewModel, ContainerTool>
    {
      
        public bool Run(NgTableParams model, ref IQueryable<ContainerTool> repository, NgTable<ContainerToolsViewModel> result, ICoreUser user, IUnitOfWork unitOfWork)
        {
             // unitOfWork = unitOfWork.Where(c => c.OwnerId == null);
             // limit by organisation owner etc... business rules 
              return true;
        }

    }
}

