    public class View : IViewEvent<AomFieldMetaViewModel>
    {
        public int CreatedId = 0;

        public Response<AomFieldMetaViewModel> Run(AomFieldMetaViewModel model, IUnitOfWork unitOfWork, Response<AomFieldMetaViewModel> result)
        {
            var itemToUpdate = unitOfWork.With<AomFieldMeta>().SingleOrDefault(c => c.Id == model.Id);

            if (itemToUpdate != null)
            {
                var newCustomResult = AomFieldMetaMapper.MapDbModelToViewModel(itemToUpdate);
                result.Data = newCustomResult;
                result.Success = true;
            }
            else
            {
                result.Success = false;
                result.LogError("Error viewing AomFieldMeta"); 
            }

            return result;
        }

    
    }