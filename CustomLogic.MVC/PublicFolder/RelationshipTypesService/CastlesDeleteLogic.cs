    public class Delete : IDeleteEvent<RelationshipTypesViewModel>
    {
        public bool Run(RelationshipTypesViewModel model, IUnitOfWork unitOfWork, Response<RelationshipTypesViewModel> result)
        {
            // Todo change id for the tables PK
            var customToRemove = unitOfWork.With<RelationshipType>().Find(model.Id);
            unitOfWork.With<RelationshipType>().Remove(customToRemove);
            unitOfWork.SaveChanges();
            return true;
        }
    }
