    public class View : IViewEvent<RelationshipObjectViewModel>
    {
        public int CreatedId = 0;

        public Response<RelationshipObjectViewModel> Run(RelationshipObjectViewModel model, IUnitOfWork unitOfWork, Response<RelationshipObjectViewModel> result)
        {
            var itemToUpdate = unitOfWork.With<RelationshipObject>().SingleOrDefault(c => c.Id == model.Id);

            if (itemToUpdate != null)
            {
                var newCustomResult = RelationshipObjectMapper.MapDbModelToViewModel(itemToUpdate);
                result.Data = newCustomResult;
                result.Success = true;
            }
            else
            {
                result.Success = false;
                result.LogError("Error viewing RelationshipObject"); 
            }

            return result;
        }

    
    }