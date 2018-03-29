
 public class Update : IUpdateEvent<RelationshipTypeViewModel>
    {
        public bool Run(RelationshipTypeViewModel model, IUnitOfWork unitOfWork, Response<RelationshipTypeViewModel> result)
        {
            var dbModel = unitOfWork.With<RelationshipType>().Find(model.Id);
            var updatedDbModel = RelationshipTypesMapper.MapInsertModelToDbModel(model, dbModel);
            unitOfWork.With<RelationshipType>().AddOrUpdate(updatedDbModel);
            unitOfWork.SaveChanges();
            var newCustomResult = RelationshipTypesMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
