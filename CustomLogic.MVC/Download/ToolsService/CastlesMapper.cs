using System.Linq;
using CustomLogic.Database;

namespace CustomLogic.Services.ToolsService
{
 public static class ToolsMapper
    {


        public static Tool MapInsertModelToDbModel(ToolsViewModel model, Tool newDomainModel = null)
        {
            if (newDomainModel == null)
            {
                newDomainModel = new Tool();
            }

newDomainModel.Id = model.Id;
newDomainModel.Name = model.Name;
newDomainModel.Json = model.Json;

            return newDomainModel;
        }



        public static ToolsViewModel MapDbModelToViewModel(Tool dbModel)
        {
            var viewModel = new  ToolsViewModel();
viewModel.Id = dbModel.Id;
viewModel.Name = dbModel.Name;
viewModel.Json = dbModel.Json;
            return viewModel;
        }

        public static IQueryable<ToolsViewModel> MapDbModelQueryToViewModelQuery(IQueryable<Tool> databaseQuery)
        {
            return databaseQuery.OrderByDescending(c=>c.Id).Select(c => new ToolsViewModel()
                                             {
                                                 Id = c.Id,
Name = c.Name,
Json = c.Json,
                                             });
        }




}
}

