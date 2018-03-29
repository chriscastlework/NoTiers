using System;
using System.Linq;
using CustomLogic;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;


namespace CustomLogic.Services.AomFieldObjectService
{
    public class Save : IInsertEvent<AomFieldObjectViewModel>
    {
        public Guid CreatedId; // Might be a composite key!

        public bool Run(AomFieldObjectViewModel model, IUnitOfWork unitOfWork, Response<AomFieldObjectViewModel> result, ICoreUser user)
        {
          
            var newCustom = AomFieldObjectMapper.MapInsertModelToDbModel(model);
            unitOfWork.With<AomFieldObject>().Add(newCustom);
            unitOfWork.SaveChanges();
            CreatedId = newCustom.Id;
            model.Id = CreatedId; // Might be a composit key
            var newCustomResult = AomFieldObjectMapper.MapDbModelToViewModel(newCustom);
            result.Data = newCustomResult;
            return true;
        }

        public bool Rollback(AomFieldObjectViewModel model, IUnitOfWork unitOfWork)
        {
            var removeItem = unitOfWork.With<AomFieldObject>().FirstOrDefault(c=>c.Id == CreatedId);
            unitOfWork.With<AomFieldObject>().Remove(removeItem);
            unitOfWork.SaveChanges();
            return true;
        }

        public int priority()
        {
            return 1;
        }
    }
}