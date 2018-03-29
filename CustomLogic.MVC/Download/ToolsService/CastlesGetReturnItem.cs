using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.ToolsService
{
    public class ReturnResultEvent : IUpdateEvent<ToolsViewModel, Tool>
    {
        public int priority()
        {
            return 1000;
        }

        public bool Run(ToolsViewModel model, ref IQueryable< Tool> repository, IUnitOfWork unitOfWork, Response<ToolsViewModel> result, ICoreUser user)
        {
            var updatedDbModel = unitOfWork.With< Tool>().Single(c => c.Id == model.Id); // Might be a partial class
            var newCustomResult = ToolsMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
}
