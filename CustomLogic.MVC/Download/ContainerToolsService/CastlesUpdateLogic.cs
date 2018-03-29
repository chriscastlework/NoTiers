 using CustomLogic.Core.Interfaces;
 using CustomLogic.Core.Interfaces.DL;
 using CustomLogic.Core.Models;
using CustomLogic.Database;
 using System.Linq;

namespace CustomLogic.Services.ContainerToolsService
{
 public class Update : IUpdateEvent<ContainerToolsViewModel,ContainerTool>
    {

        public int priority()
        {
            return 0;
        }

        public bool Run(ContainerToolsViewModel model, ref IQueryable<ContainerTool> repository, IUnitOfWork unitOfWork, Response<ContainerToolsViewModel> result, ICoreUser user)
        {
            var dbModel =  repository.Single(c=>c.Id == model.Id); // you need to be using the primary key could be composit
            var updatedDbModel = ContainerToolsMapper.MapInsertModelToDbModel(model, dbModel);
            unitOfWork.With<ContainerTool>().AddOrUpdate(updatedDbModel);
            unitOfWork.SaveChanges();
            var newCustomResult = ContainerToolsMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
}
