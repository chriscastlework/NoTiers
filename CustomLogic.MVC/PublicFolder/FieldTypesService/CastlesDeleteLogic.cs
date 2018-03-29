    public class Delete : IDeleteEvent<FieldTypesViewModel>
    {
        public bool Run(FieldTypesViewModel model, IUnitOfWork unitOfWork, Response<FieldTypesViewModel> result)
        {
            // Todo change id for the tables PK
            var customToRemove = unitOfWork.With<FieldType>().Find(model.Id);
            unitOfWork.With<FieldType>().Remove(customToRemove);
            unitOfWork.SaveChanges();
            return true;
        }
    }
