
 public class Update : IUpdateEvent<RelationshipObjectViewModel>
    {
        public bool Run(RelationshipObjectViewModel model, IUnitOfWork unitOfWork, Response<RelationshipObjectViewModel> result)
        {
            var dbModel = unitOfWork.With<RelationshipObject>().Find(model.Id);
            var updatedDbModel = RelationshipObjectMapper.MapInsertModelToDbModel(model, dbModel);
            unitOfWork.With<RelationshipObject>().AddOrUpdate(updatedDbModel);
            unitOfWork.SaveChanges();
            var newCustomResult = RelationshipObjectMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
