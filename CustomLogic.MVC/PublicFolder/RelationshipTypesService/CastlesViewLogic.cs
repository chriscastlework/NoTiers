    public class View : IViewEvent<RelationshipTypesViewModel>
    {
        public int CreatedId = 0;

        public Response<RelationshipTypesViewModel> Run(RelationshipTypesViewModel model, IUnitOfWork unitOfWork, Response<RelationshipTypesViewModel> result)
        {
            var itemToUpdate = unitOfWork.With<RelationshipType>().SingleOrDefault(c => c.Id == model.Id);

            if (itemToUpdate != null)
            {
                var newCustomResult = RelationshipTypesMapper.MapDbModelToViewModel(itemToUpdate);
                result.Data = newCustomResult;
                result.Success = true;
            }
            else
            {
                result.Success = false;
                result.LogError("Error viewing RelationshipTypes"); 
            }

            return result;
        }

    
    }