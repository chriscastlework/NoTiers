using System;
using System.Linq;
using CustomLogic;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;


namespace CustomLogic.Services.AomObjectService
{
    public class Save : IInsertEvent<AomObjectViewModel>
    {
        public Guid CreatedId; // Might be a composite key!

        public bool Run(AomObjectViewModel model, IUnitOfWork unitOfWork, Response<AomObjectViewModel> result, ICoreUser user)
        {
          
            var newCustom = AomObjectMapper.MapInsertModelToDbModel(model);
            unitOfWork.With<AomObject>().Add(newCustom);
            unitOfWork.SaveChanges();
            CreatedId = newCustom.Id;
            model.Id = CreatedId; // Might be a composit key
            var newCustomResult = AomObjectMapper.MapDbModelToViewModel(newCustom);
            result.Data = newCustomResult;
            return true;
        }

        public bool Rollback(AomObjectViewModel model, IUnitOfWork unitOfWork)
        {
            var removeItem = unitOfWork.With<AomObject>().FirstOrDefault(c=>c.Id == CreatedId);
            unitOfWork.With<AomObject>().Remove(removeItem);
            unitOfWork.SaveChanges();
            return true;
        }

        public int priority()
        {
            return 1;
        }
    }
}