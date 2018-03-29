using System.Linq;
using CustomLogic.Database;

namespace CustomLogic.Services.ContainersService
{
 public static class ContainersMapper
    {


        public static Container MapInsertModelToDbModel(ContainersViewModel model, Container newDomainModel = null)
        {
            if (newDomainModel == null)
            {
                newDomainModel = new Container();
            }

newDomainModel.Id = model.Id;
newDomainModel.Name = model.Name;

            return newDomainModel;
        }



        public static ContainersViewModel MapDbModelToViewModel(Container dbModel)
        {
            var viewModel = new  ContainersViewModel();
viewModel.Id = dbModel.Id;
viewModel.Name = dbModel.Name;
            return viewModel;
        }

        public static IQueryable<ContainersViewModel> MapDbModelQueryToViewModelQuery(IQueryable<Container> databaseQuery)
        {
            return databaseQuery.OrderByDescending(c=>c.Id).Select(c => new ContainersViewModel()
                                             {
                                                 Id = c.Id,
Name = c.Name,
                                             });
        }




}
}

