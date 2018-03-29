using System.Linq;
using CustomLogic.Database;

namespace CustomLogic.Services.ContainerToolsService
{
 public static class ContainerToolsMapper
    {


        public static ContainerTool MapInsertModelToDbModel(ContainerToolsViewModel model, ContainerTool newDomainModel = null)
        {
            if (newDomainModel == null)
            {
                newDomainModel = new ContainerTool();
            }

newDomainModel.Id = model.Id;
newDomainModel.ContainerId = model.ContainerId;
newDomainModel.ToolId = model.ToolId;

            return newDomainModel;
        }



        public static ContainerToolsViewModel MapDbModelToViewModel(ContainerTool dbModel)
        {
            var viewModel = new  ContainerToolsViewModel();
viewModel.Id = dbModel.Id;
viewModel.ContainerId = dbModel.ContainerId;
viewModel.ToolId = dbModel.ToolId;
            return viewModel;
        }

        public static IQueryable<ContainerToolsViewModel> MapDbModelQueryToViewModelQuery(IQueryable<ContainerTool> databaseQuery)
        {
            return databaseQuery.OrderByDescending(c=>c.Id).Select(c => new ContainerToolsViewModel()
                                             {
                                                 Id = c.Id,
ContainerId = c.ContainerId,
ToolId = c.ToolId,
                                             });
        }




}
}

