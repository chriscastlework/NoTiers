
    public class Save : IInsertEvent<RelationshipTypesViewModel>
    {
        public int CreatedId = 0;

        public bool Run(RelationshipTypesViewModel model, IUnitOfWork unitOfWork, Response<RelationshipTypesViewModel> result)
        {
          
            var newCustom = RelationshipTypesMapper.MapInsertModelToDbModel(model);
            unitOfWork.With<RelationshipType>().Add(newCustom);
            unitOfWork.SaveChanges();
            CreatedId = newCustom.Id;
            var newCustomResult = RelationshipTypesMapper.MapDbModelToViewModel(newCustom);
            result.Data = newCustomResult;
            return true;
        }

        public bool Rollback(RelationshipTypesViewModel model, IUnitOfWork unitOfWork)
        {
            var removeItem = unitOfWork.With<RelationshipType>().FirstOrDefault(c=>c.Id == CreatedId);
            unitOfWork.With<RelationshipType>().Remove(removeItem);
            unitOfWork.SaveChanges();
            return true;
        }
    }