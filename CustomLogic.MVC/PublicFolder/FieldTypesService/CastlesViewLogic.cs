    public class View : IViewEvent<FieldTypesViewModel>
    {
        public int CreatedId = 0;

        public Response<FieldTypesViewModel> Run(FieldTypesViewModel model, IUnitOfWork unitOfWork, Response<FieldTypesViewModel> result)
        {
            var itemToUpdate = unitOfWork.With<FieldType>().SingleOrDefault(c => c.Id == model.Id);

            if (itemToUpdate != null)
            {
                var newCustomResult = FieldTypesMapper.MapDbModelToViewModel(itemToUpdate);
                result.Data = newCustomResult;
                result.Success = true;
            }
            else
            {
                result.Success = false;
                result.LogError("Error viewing FieldTypes"); 
            }

            return result;
        }

    
    }