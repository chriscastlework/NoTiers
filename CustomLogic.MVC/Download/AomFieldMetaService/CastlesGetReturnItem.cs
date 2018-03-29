using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.AomFieldMetaService
{
    public class ReturnResultEvent : IUpdateEvent<AomFieldMetaViewModel, AomFieldMeta>
    {
        public int priority()
        {
            return 1000;
        }

        public bool Run(AomFieldMetaViewModel model, ref IQueryable< AomFieldMeta> repository, IUnitOfWork unitOfWork, Response<AomFieldMetaViewModel> result, ICoreUser user)
        {
            var updatedDbModel = unitOfWork.With< AomFieldMeta>().Single(c => c.Id == model.Id); // Might be a partial class
            var newCustomResult = AomFieldMetaMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
}
