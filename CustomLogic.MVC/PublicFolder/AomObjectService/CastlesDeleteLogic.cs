    public class Delete : IDeleteEvent<AomObjectViewModel>
    {
        public bool Run(AomObjectViewModel model, IUnitOfWork unitOfWork, Response<AomObjectViewModel> result)
        {
            // Todo change id for the tables PK
            var customToRemove = unitOfWork.With<AomObject>().Find(model.Id);
            unitOfWork.With<AomObject>().Remove(customToRemove);
            unitOfWork.SaveChanges();
            return true;
        }
    }
