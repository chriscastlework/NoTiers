    public class View : IViewEvent<AomMetaViewModel>
    {
        public int CreatedId = 0;

        public Response<AomMetaViewModel> Run(AomMetaViewModel model, IUnitOfWork unitOfWork, Response<AomMetaViewModel> result)
        {
            var itemToUpdate = unitOfWork.With<AomMeta>().SingleOrDefault(c => c.Id == model.Id);

            if (itemToUpdate != null)
            {
                var newCustomResult = AomMetaMapper.MapDbModelToViewModel(itemToUpdate);
                result.Data = newCustomResult;
                result.Success = true;
            }
            else
            {
                result.Success = false;
                result.LogError("Error viewing AomMeta"); 
            }

            return result;
        }

    
    }