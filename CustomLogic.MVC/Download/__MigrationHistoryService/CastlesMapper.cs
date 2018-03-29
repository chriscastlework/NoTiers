using System.Linq;
using CustomLogic.Database;

namespace CustomLogic.Services.MigrationHistoryService
{
 public static class MigrationHistoryMapper
    {


        public static MigrationHistory MapInsertModelToDbModel(MigrationHistoryViewModel model, MigrationHistory newDomainModel = null)
        {
            if (newDomainModel == null)
            {
                newDomainModel = new MigrationHistory();
            }

newDomainModel.MigrationId = model.MigrationId;
newDomainModel.ContextKey = model.ContextKey;
newDomainModel.Model = model.Model;
newDomainModel.ProductVersion = model.ProductVersion;

            return newDomainModel;
        }



        public static MigrationHistoryViewModel MapDbModelToViewModel(MigrationHistory dbModel)
        {
            var viewModel = new  MigrationHistoryViewModel();
viewModel.MigrationId = dbModel.MigrationId;
viewModel.ContextKey = dbModel.ContextKey;
viewModel.Model = dbModel.Model;
viewModel.ProductVersion = dbModel.ProductVersion;
            return viewModel;
        }

        public static IQueryable<MigrationHistoryViewModel> MapDbModelQueryToViewModelQuery(IQueryable<MigrationHistory> databaseQuery)
        {
            return databaseQuery.OrderByDescending(c=>c.Id).Select(c => new MigrationHistoryViewModel()
                                             {
                                                 MigrationId = c.MigrationId,
ContextKey = c.ContextKey,
Model = c.Model,
ProductVersion = c.ProductVersion,
                                             });
        }




}
}
