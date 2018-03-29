﻿using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.CustomObjectRowFieldsService
{
    public class View : IViewEvent<CustomObjectRowFieldsViewModel, CustomObjectRowField>
    {
        public int CreatedId = 0;


        public Response<CustomObjectRowFieldsViewModel> Run(CustomObjectRowFieldsViewModel model, ref IQueryable<CustomObjectRowField> repository, IUnitOfWork db, Response<CustomObjectRowFieldsViewModel> result,
            ICoreUser user)
        {
            var itemToUpdate = repository.SingleOrDefault(c => c.Id == model.Id);

            if (itemToUpdate != null)
            {
                var newCustomResult = CustomObjectRowFieldsMapper.MapDbModelToViewModel(itemToUpdate);
                result.Data = newCustomResult;
                result.Success = true;
            }
            else
            {
                result.Success = false;
                result.LogError("Error viewing Intent");
            }

            return result;
        }
    }
}