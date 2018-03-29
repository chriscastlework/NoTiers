using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.RelationshipMetaService
{
    public class ReturnResultEvent : IUpdateEvent<RelationshipMetaViewModel, RelationshipMeta>
    {
        public int priority()
        {
            return 1000;
        }

        public bool Run(RelationshipMetaViewModel model, ref IQueryable< RelationshipMeta> repository, IUnitOfWork unitOfWork, Response<RelationshipMetaViewModel> result, ICoreUser user)
        {
            var updatedDbModel = unitOfWork.With< RelationshipMeta>().Single(c => c.Id == model.Id); // Might be a partial class
            var newCustomResult = RelationshipMetaMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
}
