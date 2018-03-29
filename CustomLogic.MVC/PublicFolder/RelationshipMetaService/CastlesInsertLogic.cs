
    public class Save : IInsertEvent<RelationshipMetaViewModel>
    {
        public int CreatedId = 0;

        public bool Run(RelationshipMetaViewModel model, IUnitOfWork unitOfWork, Response<RelationshipMetaViewModel> result)
        {
          
            var newCustom = RelationshipMetaMapper.MapInsertModelToDbModel(model);
            unitOfWork.With<RelationshipMeta>().Add(newCustom);
            unitOfWork.SaveChanges();
            CreatedId = newCustom.Id;
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
    }