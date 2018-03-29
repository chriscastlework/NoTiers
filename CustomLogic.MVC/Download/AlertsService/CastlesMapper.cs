using System.Linq;
using CustomLogic.Database;

namespace CustomLogic.Services.AlertsService
{
 public static class AlertsMapper
    {


        public static Alert MapInsertModelToDbModel(AlertsViewModel model, Alert newDomainModel = null)
        {
            if (newDomainModel == null)
            {
                newDomainModel = new Alert();
            }

newDomainModel.Id = model.Id;
newDomainModel.Name = model.Name;
newDomainModel.AlertJson = model.AlertJson;

            return newDomainModel;
        }



        public static AlertsViewModel MapDbModelToViewModel(Alert dbModel)
        {
            var viewModel = new  AlertsViewModel();
viewModel.Id = dbModel.Id;
viewModel.Name = dbModel.Name;
viewModel.AlertJson = dbModel.AlertJson;
            return viewModel;
        }

        public static IQueryable<AlertsViewModel> MapDbModelQueryToViewModelQuery(IQueryable<Alert> databaseQuery)
        {
            return databaseQuery.OrderByDescending(c=>c.Id).Select(c => new AlertsViewModel()
                                             {
                                                 Id = c.Id,
Name = c.Name,
AlertJson = c.AlertJson,
                                             });
        }




}
}

