
    public class Save : IInsertEvent<FieldTypesViewModel>
    {
        public int CreatedId = 0;

        public bool Run(FieldTypesViewModel model, IUnitOfWork unitOfWork, Response<FieldTypesViewModel> result)
        {
          
            var newCustom = FieldTypesMapper.MapInsertModelToDbModel(model);
            unitOfWork.With<FieldType>().Add(newCustom);
            unitOfWork.SaveChanges();
            CreatedId = newCustom.Id;
            var newCustomResult = FieldTypesMapper.MapDbModelToViewModel(newCustom);
            result.Data = newCustomResult;
            return true;
        }

        public bool Rollback(FieldTypesViewModel model, IUnitOfWork unitOfWork)
        {
            var removeItem = unitOfWork.With<FieldType>().FirstOrDefault(c=>c.Id == CreatedId);
            unitOfWork.With<FieldType>().Remove(removeItem);
            unitOfWork.SaveChanges();
            return true;
        }
    }