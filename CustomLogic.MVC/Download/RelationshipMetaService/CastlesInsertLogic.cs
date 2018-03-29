using System;
using System.Linq;
using CustomLogic;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;


namespace CustomLogic.Services.RelationshipMetaService
{
    public class Save : IInsertEvent<RelationshipMetaViewModel>
    {
        public Guid CreatedId; // Might be a composite key!

        public bool Run(RelationshipMetaViewModel model, IUnitOfWork unitOfWork, Response<RelationshipMetaViewModel> result, ICoreUser user)
        {
          
            var newCustom = RelationshipMetaMapper.MapInsertModelToDbModel(model);
            unitOfWork.With<RelationshipMeta>().Add(newCustom);
            unitOfWork.SaveChanges();
            CreatedId = newCustom.Id;
            model.Id = CreatedId; // Might be a composit key
            var newCustomResult = RelationshipMetaMapper.MapDbModelToViewModel(newCustom);
            result.Data = newCustomResult;
            return true;
        }

        public bool Rollback(RelationshipMetaViewModel model, IUnitOfWork unitOfWork)
        {
            var removeItem = unitOfWork.With<RelationshipMeta>().FirstOrDefault(c=>c.Id == CreatedId);
            unitOfWork.With<RelationshipMeta>().Remove(removeItem);
            unitOfWork.SaveChanges();
            return true;
        }

        public int priority()
        {
            return 1;
        }
    }
}