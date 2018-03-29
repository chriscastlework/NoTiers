
 public class Update : IUpdateEvent<FieldTypeViewModel>
    {
        public bool Run(FieldTypeViewModel model, IUnitOfWork unitOfWork, Response<FieldTypeViewModel> result)
        {
            var dbModel = unitOfWork.With<FieldType>().Find(model.Id);
            var updatedDbModel = FieldTypesMapper.MapInsertModelToDbModel(model, dbModel);
            unitOfWork.With<FieldType>().AddOrUpdate(updatedDbModel);
            unitOfWork.SaveChanges();
            var newCustomResult = FieldTypesMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
