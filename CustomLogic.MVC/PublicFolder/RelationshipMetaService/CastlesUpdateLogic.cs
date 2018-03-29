
 public class Update : IUpdateEvent<RelationshipMetaViewModel>
    {
        public bool Run(RelationshipMetaViewModel model, IUnitOfWork unitOfWork, Response<RelationshipMetaViewModel> result)
        {
            var dbModel = unitOfWork.With<RelationshipMeta>().Find(model.Id);
            var updatedDbModel = RelationshipMetaMapper.MapInsertModelToDbModel(model, dbModel);
            unitOfWork.With<RelationshipMeta>().AddOrUpdate(updatedDbModel);
            unitOfWork.SaveChanges();
            var newCustomResult = RelationshipMetaMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
