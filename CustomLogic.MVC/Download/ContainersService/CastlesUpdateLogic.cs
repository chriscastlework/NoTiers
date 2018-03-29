 using CustomLogic.Core.Interfaces;
 using CustomLogic.Core.Interfaces.DL;
 using CustomLogic.Core.Models;
using CustomLogic.Database;
 using System.Linq;

namespace CustomLogic.Services.ContainersService
{
 public class Update : IUpdateEvent<ContainersViewModel,Container>
    {

        public int priority()
        {
            return 0;
        }

        public bool Run(ContainersViewModel model, ref IQueryable<Container> repository, IUnitOfWork unitOfWork, Response<ContainersViewModel> result, ICoreUser user)
        {
            var dbModel =  repository.Single(c=>c.Id == model.Id); // you need to be using the primary key could be composit
            var updatedDbModel = ContainersMapper.MapInsertModelToDbModel(model, dbModel);
            unitOfWork.With<Container>().AddOrUpdate(updatedDbModel);
            unitOfWork.SaveChanges();
            var newCustomResult = ContainersMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
}
