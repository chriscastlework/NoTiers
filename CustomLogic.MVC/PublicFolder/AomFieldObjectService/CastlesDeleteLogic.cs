    public class Delete : IDeleteEvent<AomFieldObjectViewModel>
    {
        public bool Run(AomFieldObjectViewModel model, IUnitOfWork unitOfWork, Response<AomFieldObjectViewModel> result)
        {
            // Todo change id for the tables PK
            var customToRemove = unitOfWork.With<AomFieldObject>().Find(model.Id);
            unitOfWork.With<AomFieldObject>().Remove(customToRemove);
            unitOfWork.SaveChanges();
            return true;
        }
    }
