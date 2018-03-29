using System;
using System.Linq;
using CustomLogic;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;


namespace CustomLogic.Services.AomMetaService
{
    public class Save : IInsertEvent<AomMetaViewModel>
    {
        public Guid CreatedId; // Might be a composite key!

        public bool Run(AomMetaViewModel model, IUnitOfWork unitOfWork, Response<AomMetaViewModel> result, ICoreUser user)
        {
          
            var newCustom = AomMetaMapper.MapInsertModelToDbModel(model);
            unitOfWork.With<AomMeta>().Add(newCustom);
            unitOfWork.SaveChanges();
            CreatedId = newCustom.Id;
            model.Id = CreatedId; // Might be a composit key
            var newCustomResult = AomMetaMapper.MapDbModelToViewModel(newCustom);
            result.Data = newCustomResult;
            return true;
        }

        public bool Rollback(AomMetaViewModel model, IUnitOfWork unitOfWork)
        {
            var removeItem = unitOfWork.With<AomMeta>().FirstOrDefault(c=>c.Id == CreatedId);
            unitOfWork.With<AomMeta>().Remove(removeItem);
            unitOfWork.SaveChanges();
            return true;
        }

        public int priority()
        {
            return 1;
        }
    }
}