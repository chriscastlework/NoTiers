 using CustomLogic.Core.Interfaces;
 using CustomLogic.Core.Interfaces.DL;
 using CustomLogic.Core.Models;
using CustomLogic.Database;
 using System.Linq;

namespace CustomLogic.Services.ToolsService
{
 public class Update : IUpdateEvent<ToolsViewModel,Tool>
    {

        public int priority()
        {
            return 0;
        }

        public bool Run(ToolsViewModel model, ref IQueryable<Tool> repository, IUnitOfWork unitOfWork, Response<ToolsViewModel> result, ICoreUser user)
        {
            var dbModel =  repository.Single(c=>c.Id == model.Id); // you need to be using the primary key could be composit
            var updatedDbModel = ToolsMapper.MapInsertModelToDbModel(model, dbModel);
            unitOfWork.With<Tool>().AddOrUpdate(updatedDbModel);
            unitOfWork.SaveChanges();
            var newCustomResult = ToolsMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
}
