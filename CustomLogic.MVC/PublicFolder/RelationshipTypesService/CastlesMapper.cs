 public static class RelationshipTypesMapper
    {


        public static RelationshipType MapInsertModelToDbModel(RelationshipTypesViewModel model, RelationshipType newDomainModel = null)
        {
            if (newDomainModel == null)
            {
                newDomainModel = new RelationshipType();
            }

newDomainModel.ID = model.ID;
newDomainModel.Name = model.Name;

            return newDomainModel;
        }



        public static RelationshipTypesViewModel MapDbModelToViewModel(RelationshipType dbModel)
        {
            var viewModel = new  RelationshipTypesViewModel();
viewModel.ID = dbModel.ID;
viewModel.Name = dbModel.Name;
            return viewModel;
        }

        public static IQueryable<RelationshipTypesViewModel> MapDbModelQueryToViewModelQuery(IQueryable<RelationshipType> databaseQuery)
        {
            return databaseQuery.OrderByDescending(c=>c.Id).Select(c => new RelationshipTypesViewModel()
                                             {
                                                 ID = c.ID,
Name = c.Name,
                                             });
        }




}

