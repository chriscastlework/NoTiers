    public class View : IViewEvent<AomFieldObjectViewModel>
    {
        public int CreatedId = 0;

        public Response<AomFieldObjectViewModel> Run(AomFieldObjectViewModel model, IUnitOfWork unitOfWork, Response<AomFieldObjectViewModel> result)
        {
            var itemToUpdate = unitOfWork.With<AomFieldObject>().SingleOrDefault(c => c.Id == model.Id);

            if (itemToUpdate != null)
            {
                var newCustomResult = AomFieldObjectMapper.MapDbModelToViewModel(itemToUpdate);
                result.Data = newCustomResult;
                result.Success = true;
            }
            else
            {
                result.Success = false;
                result.LogError("Error viewing AomFieldObject"); 
            }

            return result;
        }

    
    }