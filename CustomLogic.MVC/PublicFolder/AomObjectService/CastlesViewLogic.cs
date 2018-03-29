    public class View : IViewEvent<AomObjectViewModel>
    {
        public int CreatedId = 0;

        public Response<AomObjectViewModel> Run(AomObjectViewModel model, IUnitOfWork unitOfWork, Response<AomObjectViewModel> result)
        {
            var itemToUpdate = unitOfWork.With<AomObject>().SingleOrDefault(c => c.Id == model.Id);

            if (itemToUpdate != null)
            {
                var newCustomResult = AomObjectMapper.MapDbModelToViewModel(itemToUpdate);
                result.Data = newCustomResult;
                result.Success = true;
            }
            else
            {
                result.Success = false;
                result.LogError("Error viewing AomObject"); 
            }

            return result;
        }

    
    }