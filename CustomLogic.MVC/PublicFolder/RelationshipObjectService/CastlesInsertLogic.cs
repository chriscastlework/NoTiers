
    public class Save : IInsertEvent<RelationshipObjectViewModel>
    {
        public int CreatedId = 0;

        public bool Run(RelationshipObjectViewModel model, IUnitOfWork unitOfWork, Response<RelationshipObjectViewModel> result)
        {
          
            var newCustom = RelationshipObjectMapper.MapInsertModelToDbModel(model);
            unitOfWork.With<RelationshipObject>().Add(newCustom);
            unitOfWork.SaveChanges();
            CreatedId = newCustom.Id;
            var newCustomResult = RelationshipObjectMapper.MapDbModelToViewModel(newCustom);
            result.Data = newCustomResult;
            return true;
        }

        public bool Rollback(RelationshipObjectViewModel model, IUnitOfWork unitOfWork)
        {
            var removeItem = unitOfWork.With<RelationshipObject>().FirstOrDefault(c=>c.Id == CreatedId);
            unitOfWork.With<RelationshipObject>().Remove(removeItem);
            unitOfWork.SaveChanges();
            return true;
        }
    }