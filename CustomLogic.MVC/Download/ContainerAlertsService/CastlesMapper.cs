using System.Linq;
using CustomLogic.Database;

namespace CustomLogic.Services.ContainerAlertsService
{
 public static class ContainerAlertsMapper
    {


        public static ContainerAlert MapInsertModelToDbModel(ContainerAlertsViewModel model, ContainerAlert newDomainModel = null)
        {
            if (newDomainModel == null)
            {
                newDomainModel = new ContainerAlert();
            }

newDomainModel.Id = model.Id;
newDomainModel.AlertId = model.AlertId;
newDomainModel.ContainerId = model.ContainerId;

            return newDomainModel;
        }



        public static ContainerAlertsViewModel MapDbModelToViewModel(ContainerAlert dbModel)
        {
            var viewModel = new  ContainerAlertsViewModel();
viewModel.Id = dbModel.Id;
viewModel.AlertId = dbModel.AlertId;
viewModel.ContainerId = dbModel.ContainerId;
            return viewModel;
        }

        public static IQueryable<ContainerAlertsViewModel> MapDbModelQueryToViewModelQuery(IQueryable<ContainerAlert> databaseQuery)
        {
            return databaseQuery.OrderByDescending(c=>c.Id).Select(c => new ContainerAlertsViewModel()
                                             {
                                                 Id = c.Id,
AlertId = c.AlertId,
ContainerId = c.ContainerId,
                                             });
        }




}
}

