    public class View : IViewEvent<RelationshipMetaViewModel>
    {
        public int CreatedId = 0;

        public Response<RelationshipMetaViewModel> Run(RelationshipMetaViewModel model, IUnitOfWork unitOfWork, Response<RelationshipMetaViewModel> result)
        {
            var itemToUpdate = unitOfWork.With<RelationshipMeta>().SingleOrDefault(c => c.Id == model.Id);

            if (itemToUpdate != null)
            {
                var newCustomResult = RelationshipMetaMapper.MapDbModelToViewModel(itemToUpdate);
                result.Data = newCustomResult;
                result.Success = true;
            }
            else
            {
                result.Success = false;
                result.LogError("Error viewing RelationshipMeta"); 
            }

            return result;
        }

    
    }