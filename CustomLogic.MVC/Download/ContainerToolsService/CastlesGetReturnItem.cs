using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.ContainerToolsService
{
    public class ReturnResultEvent : IUpdateEvent<ContainerToolsViewModel, ContainerTool>
    {
        public int priority()
        {
            return 1000;
        }

        public bool Run(ContainerToolsViewModel model, ref IQueryable< ContainerTool> repository, IUnitOfWork unitOfWork, Response<ContainerToolsViewModel> result, ICoreUser user)
        {
            var updatedDbModel = unitOfWork.With< ContainerTool>().Single(c => c.Id == model.Id); // Might be a partial class
            var newCustomResult = ContainerToolsMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
}
