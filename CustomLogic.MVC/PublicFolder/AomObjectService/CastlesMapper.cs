 public static class AomObjectMapper
    {


        public static AomObject MapInsertModelToDbModel(AomObjectViewModel model, AomObject newDomainModel = null)
        {
            if (newDomainModel == null)
            {
                newDomainModel = new AomObject();
            }

newDomainModel.ID = model.ID;
newDomainModel.AOMMetaID = model.AOMMetaID;
newDomainModel.Name = model.Name;

            return newDomainModel;
        }



        public static AomObjectViewModel MapDbModelToViewModel(AomObject dbModel)
        {
            var viewModel = new  AomObjectViewModel();
viewModel.ID = dbModel.ID;
viewModel.AOMMetaID = dbModel.AOMMetaID;
viewModel.Name = dbModel.Name;
            return viewModel;
        }

        public static IQueryable<AomObjectViewModel> MapDbModelQueryToViewModelQuery(IQueryable<AomObject> databaseQuery)
        {
            return databaseQuery.OrderByDescending(c=>c.Id).Select(c => new AomObjectViewModel()
                                             {
                                                 ID = c.ID,
AOMMetaID = c.AOMMetaID,
Name = c.Name,
                                             });
        }




}

