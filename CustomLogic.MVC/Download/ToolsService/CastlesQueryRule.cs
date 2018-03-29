using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.BL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.ToolsService
{
    public class LimitTools : IViewListRule<ToolsViewModel, Tool>
    {
      
        public bool Run(NgTableParams model, ref IQueryable<Tool> repository, NgTable<ToolsViewModel> result, ICoreUser user, IUnitOfWork unitOfWork)
        {
             // unitOfWork = unitOfWork.Where(c => c.OwnerId == null);
             // limit by organisation owner etc... business rules 
              return true;
        }

    }
}

